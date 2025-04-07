const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const mongoose = require('mongoose');
const notificationService = require('./notificationService');

/**
 * Service for handling job application operations
 */
class ApplicationService {
  /**
   * Create a new job application
   * @param {string} jobId - Job ID
   * @param {string} jobSeekerId - Job seeker ID
   * @param {Object} applicationData - Application data
   * @returns {Promise<Object>} - Newly created application
   */
  async applyForJob(jobId, jobSeekerId, applicationData) {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      if (!mongoose.Types.ObjectId.isValid(jobId)) {
        throw new Error('Invalid job ID');
      }
      
      // Check if job exists and is active
      const job = await Job.findById(jobId);
      if (!job) {
        throw new Error('Job not found');
      }
      
      if (job.status !== 'active') {
        throw new Error('This job is no longer accepting applications');
      }
      
      // Check if user has already applied
      const existingApplication = await Application.findOne({
        job: jobId,
        jobSeeker: jobSeekerId
      });
      
      if (existingApplication) {
        throw new Error('You have already applied for this job');
      }
      
      // Create new application
      const newApplication = new Application({
        job: jobId,
        jobSeeker: jobSeekerId,
        employer: job.employer,
        status: 'pending',
        ...applicationData,
        appliedAt: new Date()
      });
      
      await newApplication.save({ session });
      
      // Send notification to employer
      await notificationService.createNotification({
        recipient: job.employer,
        type: 'newApplication',
        message: `New application received for ${job.title}`,
        referenceId: newApplication._id,
        referenceType: 'application'
      }, session);
      
      await session.commitTransaction();
      
      // Populate response
      const populatedApplication = await Application.findById(newApplication._id)
        .populate('job', 'title company location')
        .populate('jobSeeker', 'firstName lastName email');
      
      return populatedApplication;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Get application by ID
   * @param {string} applicationId - Application ID
   * @param {string} userId - User ID (either job seeker or employer)
   * @returns {Promise<Object>} - Application object
   */
  async getApplicationById(applicationId, userId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(applicationId)) {
        throw new Error('Invalid application ID');
      }
      
      const application = await Application.findById(applicationId)
        .populate('job', 'title company location salary jobType')
        .populate('jobSeeker', 'firstName lastName email resume skills')
        .populate('employer', 'companyName email');
        
      if (!application) {
        throw new Error('Application not found');
      }
      
      // Verify authorization
      const isEmployer = application.employer._id.toString() === userId;
      const isJobSeeker = application.jobSeeker._id.toString() === userId;
      
      if (!isEmployer && !isJobSeeker) {
        throw new Error('You are not authorized to view this application');
      }
      
      return application;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update application status
   * @param {string} applicationId - Application ID
   * @param {string} newStatus - New status
   * @param {string} employerId - Employer ID
   * @param {Object} updateData - Additional update data
   * @returns {Promise<Object>} - Updated application
   */
  async updateApplicationStatus(applicationId, newStatus, employerId, updateData = {}) {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      if (!mongoose.Types.ObjectId.isValid(applicationId)) {
        throw new Error('Invalid application ID');
      }
      
      const application = await Application.findById(applicationId);
      if (!application) {
        throw new Error('Application not found');
      }
      
      // Verify employer owns this application
      if (application.employer.toString() !== employerId) {
        throw new Error('You are not authorized to update this application');
      }
      
      // Validate status
      const validStatuses = ['pending', 'reviewing', 'interviewed', 'offered', 'rejected', 'withdrawn', 'hired'];
      if (!validStatuses.includes(newStatus)) {
        throw new Error('Invalid status value');
      }
      
      // Update application
      application.status = newStatus;
      application.statusUpdatedAt = new Date();
      
      // Add feedback if provided
      if (updateData.feedback) {
        application.feedback = updateData.feedback;
      }
      
      // Add interview details if provided
      if (updateData.interviewDate) {
        application.interviewDetails = {
          ...application.interviewDetails,
          date: new Date(updateData.interviewDate),
          location: updateData.interviewLocation || application.interviewDetails?.location,
          notes: updateData.interviewNotes || application.interviewDetails?.notes
        };
      }
      
      await application.save({ session });
      
      // Send notification to job seeker
      await notificationService.createNotification({
        recipient: application.jobSeeker,
        type: 'applicationStatusUpdate',
        message: `Your application status has been updated to ${newStatus}`,
        referenceId: application._id,
        referenceType: 'application'
      }, session);
      
      await session.commitTransaction();
      
      // Populate response
      const populatedApplication = await Application.findById(application._id)
        .populate('job', 'title company location')
        .populate('jobSeeker', 'firstName lastName email');
      
      return populatedApplication;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Withdraw application (by job seeker)
   * @param {string} applicationId - Application ID
   * @param {string} jobSeekerId - Job seeker ID
   * @returns {Promise<boolean>} - Success status
   */
  async withdrawApplication(applicationId, jobSeekerId) {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      if (!mongoose.Types.ObjectId.isValid(applicationId)) {
        throw new Error('Invalid application ID');
      }
      
      const application = await Application.findById(applicationId);
      if (!application) {
        throw new Error('Application not found');
      }
      
      // Verify job seeker owns this application
      if (application.jobSeeker.toString() !== jobSeekerId) {
        throw new Error('You are not authorized to withdraw this application');
      }
      
      // Update application status
      application.status = 'withdrawn';
      application.statusUpdatedAt = new Date();
      await application.save({ session });
      
      // Send notification to employer
      await notificationService.createNotification({
        recipient: application.employer,
        type: 'applicationWithdrawn',
        message: 'A candidate has withdrawn their application',
        referenceId: application._id,
        referenceType: 'application'
      }, session);
      
      await session.commitTransaction();
      return true;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Get applications for a job
   * @param {string} jobId - Job ID
   * @param {string} employerId - Employer ID
   * @param {Object} filters - Optional filters
   * @returns {Promise<Array>} - Array of applications
   */
  async getApplicationsForJob(jobId, employerId, filters = {}) {
    try {
      if (!mongoose.Types.ObjectId.isValid(jobId)) {
        throw new Error('Invalid job ID');
      }
      
      // Verify job exists and belongs to employer
      const job = await Job.findById(jobId);
      if (!job) {
        throw new Error('Job not found');
      }
      
      if (job.employer.toString() !== employerId) {
        throw new Error('You are not authorized to view applications for this job');
      }
      
      // Build query
      const query = { job: jobId };
      
      // Apply status filter if provided
      if (filters.status && filters.status !== 'all') {
        query.status = filters.status;
      }
      
      // Get applications
      const applications = await Application.find(query)
        .populate('jobSeeker', 'firstName lastName email resume skills')
        .sort({ appliedAt: -1 });
      
      return applications;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get applications for a job seeker
   * @param {string} jobSeekerId - Job seeker ID
   * @param {Object} filters - Optional filters
   * @returns {Promise<Array>} - Array of applications
   */
  async getJobSeekerApplications(jobSeekerId, filters = {}) {
    try {
      // Build query
      const query = { jobSeeker: jobSeekerId };
      
      // Apply status filter if provided
      if (filters.status && filters.status !== 'all') {
        query.status = filters.status;
      }
      
      // Get applications
      const applications = await Application.find(query)
        .populate('job', 'title company location salary jobType status')
        .populate('employer', 'companyName')
        .sort({ appliedAt: -1 });
      
      return applications;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get application statistics for an employer
   * @param {string} employerId - Employer ID
   * @returns {Promise<Object>} - Application statistics
   */
  async getEmployerApplicationStats(employerId) {
    try {
      // Get all jobs by this employer
      const jobs = await Job.find({ employer: employerId });
      const jobIds = jobs.map(job => job._id);
      
      // Get applications count by status
      const stats = await Application.aggregate([
        { $match: { job: { $in: jobIds } } },
        { $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);
      
      // Format stats into an object
      const formattedStats = {
        total: 0,
        pending: 0,
        reviewing: 0,
        interviewed: 0,
        offered: 0,
        rejected: 0,
        withdrawn: 0,
        hired: 0
      };
      
      stats.forEach(stat => {
        formattedStats[stat._id] = stat.count;
        formattedStats.total += stat.count;
      });
      
      return formattedStats;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ApplicationService();