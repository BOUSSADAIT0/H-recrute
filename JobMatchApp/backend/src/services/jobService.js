const Job = require('../models/Job');
const Application = require('../models/Application');
const mongoose = require('mongoose');

/**
 * Service for handling job-related operations
 */
class JobService {
  /**
   * Create a new job listing
   * @param {Object} jobData - Job listing data
   * @param {string} employerId - ID of the employer creating the job
   * @returns {Promise<Object>} - Newly created job
   */
  async createJob(jobData, employerId) {
    try {
      const newJob = new Job({
        ...jobData,
        employer: employerId,
        status: 'active',
        createdAt: new Date(),
      });
      
      await newJob.save();
      return newJob;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get job by ID
   * @param {string} jobId - Job ID
   * @returns {Promise<Object>} - Job object
   */
  async getJobById(jobId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(jobId)) {
        throw new Error('Invalid job ID');
      }
      
      const job = await Job.findById(jobId)
        .populate('employer', 'companyName email location')
        .populate('skills', 'name category level');
        
      if (!job) {
        throw new Error('Job not found');
      }
      
      return job;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update a job listing
   * @param {string} jobId - Job ID
   * @param {Object} updateData - Data to update
   * @param {string} employerId - ID of the employer updating the job
   * @returns {Promise<Object>} - Updated job
   */
  async updateJob(jobId, updateData, employerId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(jobId)) {
        throw new Error('Invalid job ID');
      }
      
      // Find job and verify ownership
      const job = await Job.findById(jobId);
      if (!job) {
        throw new Error('Job not found');
      }
      
      if (job.employer.toString() !== employerId) {
        throw new Error('You are not authorized to update this job');
      }
      
      // Update job
      const updatedJob = await Job.findByIdAndUpdate(
        jobId,
        { $set: updateData },
        { new: true }
      ).populate('employer', 'companyName email location')
        .populate('skills', 'name category level');
      
      return updatedJob;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a job listing
   * @param {string} jobId - Job ID
   * @param {string} employerId - ID of the employer deleting the job
   * @returns {Promise<boolean>} - Success status
   */
  async deleteJob(jobId, employerId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(jobId)) {
        throw new Error('Invalid job ID');
      }
      
      // Find job and verify ownership
      const job = await Job.findById(jobId);
      if (!job) {
        throw new Error('Job not found');
      }
      
      if (job.employer.toString() !== employerId) {
        throw new Error('You are not authorized to delete this job');
      }
      
      // Delete associated applications
      await Application.deleteMany({ job: jobId });
      
      // Delete job
      await Job.findByIdAndDelete(jobId);
      
      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Search jobs with various filters
   * @param {Object} filters - Search filters
   * @param {Object} pagination - Pagination options
   * @returns {Promise<Object>} - Jobs and pagination info
   */
  async searchJobs(filters = {}, pagination = { page: 1, limit: 10 }) {
    try {
      const query = { status: 'active' };
      
      // Apply filters
      if (filters.title) {
        query.title = { $regex: filters.title, $options: 'i' };
      }
      
      if (filters.location) {
        query.location = { $regex: filters.location, $options: 'i' };
      }
      
      if (filters.employerId) {
        query.employer = filters.employerId;
      }
      
      if (filters.skills && filters.skills.length > 0) {
        query.skills = { $in: filters.skills };
      }
      
      if (filters.salaryMin) {
        query.salary = { ...query.salary, $gte: filters.salaryMin };
      }
      
      if (filters.salaryMax) {
        query.salary = { ...query.salary, $lte: filters.salaryMax };
      }
      
      if (filters.jobType) {
        query.jobType = filters.jobType;
      }
      
      // Calculate pagination
      const page = parseInt(pagination.page) || 1;
      const limit = parseInt(pagination.limit) || 10;
      const skip = (page - 1) * limit;
      
      // Execute query with pagination
      const jobs = await Job.find(query)
        .populate('employer', 'companyName location')
        .populate('skills', 'name category')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
      
      // Get total count for pagination
      const total = await Job.countDocuments(query);
      
      return {
        jobs,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get recommended jobs for a job seeker based on skills and preferences
   * @param {string} jobSeekerId - Job seeker ID
   * @param {Array} skills - Job seeker skills
   * @param {Object} preferences - Job seeker preferences
   * @returns {Promise<Array>} - Recommended jobs
   */
  async getRecommendedJobs(jobSeekerId, skills, preferences) {
    try {
      const query = { status: 'active' };
      
      // Skills matching
      if (skills && skills.length > 0) {
        query.skills = { $in: skills };
      }
      
      // Location preference
      if (preferences && preferences.location) {
        query.location = { $regex: preferences.location, $options: 'i' };
      }
      
      // Salary preference
      if (preferences && preferences.minSalary) {
        query.salary = { ...query.salary, $gte: preferences.minSalary };
      }
      
      // Job type preference
      if (preferences && preferences.jobType) {
        query.jobType = preferences.jobType;
      }
      
      // Get already applied jobs
      const appliedJobs = await Application.find({ jobSeeker: jobSeekerId })
        .distinct('job');
      
      // Exclude already applied jobs
      if (appliedJobs.length > 0) {
        query._id = { $nin: appliedJobs };
      }
      
      // Get recommended jobs
      const recommendedJobs = await Job.find(query)
        .populate('employer', 'companyName location')
        .populate('skills', 'name category level')
        .limit(10)
        .sort({ createdAt: -1 });
      
      return recommendedJobs;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Change job status
   * @param {string} jobId - Job ID
   * @param {string} status - New status ('active', 'closed', 'draft')
   * @param {string} employerId - ID of the employer updating the status
   * @returns {Promise<Object>} - Updated job
   */
  async changeJobStatus(jobId, status, employerId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(jobId)) {
        throw new Error('Invalid job ID');
      }
      
      // Find job and verify ownership
      const job = await Job.findById(jobId);
      if (!job) {
        throw new Error('Job not found');
      }
      
      if (job.employer.toString() !== employerId) {
        throw new Error('You are not authorized to update this job');
      }
      
      // Validate status
      const validStatuses = ['active', 'closed', 'draft'];
      if (!validStatuses.includes(status)) {
        throw new Error('Invalid status value');
      }
      
      // Update status
      job.status = status;
      await job.save();
      
      return job;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new JobService();