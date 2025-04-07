const Job = require('../models/Job');
const Application = require('../models/Application');
const User = require('../models/User');
const mongoose = require('mongoose');

/**
 * Service for handling analytics operations
 */
class AnalyticsService {
  /**
   * Get employer dashboard analytics
   * @param {string} employerId - Employer ID
   * @returns {Promise<Object>} - Dashboard analytics data
   */
  async getEmployerDashboardAnalytics(employerId) {
    try {
      // Get count of active jobs
      const activeJobsCount = await Job.countDocuments({
        employer: employerId,
        status: 'active'
      });
      
      // Get total jobs count
      const totalJobsCount = await Job.countDocuments({
        employer: employerId
      });
      
      // Get application statistics
      const jobs = await Job.find({ employer: employerId }).select('_id');
      const jobIds = jobs.map(job => job._id);
      
      // Get applications count by status
      const applicationStats = await Application.aggregate([
        { $match: { job: { $in: jobIds } } },
        { $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);
      
      // Format application stats
      const formattedAppStats = {
        total: 0,
        pending: 0,
        reviewing: 0,
        interviewed: 0,
        offered: 0,
        rejected: 0,
        withdrawn: 0,
        hired: 0
      };
      
      applicationStats.forEach(stat => {
        formattedAppStats[stat._id] = stat.count;
        formattedAppStats.total += stat.count;
      });
      
      // Get application trends (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const applicationTrends = await Application.aggregate([
        { $match: {
            job: { $in: jobIds },
            appliedAt: { $gte: thirtyDaysAgo }
          }
        },
        { $group: {
            _id: {
              year: { $year: '$appliedAt' },
              month: { $month: '$appliedAt' },
              day: { $dayOfMonth: '$appliedAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
      ]);
      
      // Format application trends
      const formattedTrends = applicationTrends.map(item => ({
        date: new Date(item._id.year, item._id.month - 1, item._id.day),
        count: item.count
      }));
      
      // Get job performance
      const jobPerformance = await Application.aggregate([
        { $match: { job: { $in: jobIds } } },
        { $group: {
            _id: '$job',
            applicationsCount: { $sum: 1 },
            interviewsCount: { $sum: { $cond: [{ $in: ['$status', ['interviewed', 'offered', 'hired']] }, 1, 0] } },
            offersCount: { $sum: { $cond: [{ $in: ['$status', ['offered', 'hired']] }, 1, 0] } },
            hiresCount: { $sum: { $cond: [{ $eq: ['$status', 'hired'] }, 1, 0] } }
          }
        },
        { $sort: { applicationsCount: -1 } },
        { $limit: 5 }
      ]);
      
      // Get job details for the performance data
      const jobDetails = await Job.find({
        _id: { $in: jobPerformance.map(item => item._id) }
      }).select('title location');
      
      // Format job performance
      const formattedJobPerformance = jobPerformance.map(item => {
        const job = jobDetails.find(
          job => job._id.toString() === item._id.toString()
        );
        
        return {
          jobId: item._id,
          title: job ? job.title : 'Unknown Job',
          location: job ? job.location : 'Unknown',
          applications: item.applicationsCount,
          interviews: item.interviewsCount,
          offers: item.offersCount,
          hires: item.hiresCount,
          conversionRate: item.applicationsCount > 0 
            ? Math.round((item.hiresCount / item.applicationsCount) * 100) 
            : 0
        };
      });
      
      return {
        jobStats: {
          activeJobs: activeJobsCount,
          totalJobs: totalJobsCount,
          filledRate: totalJobsCount > 0 
            ? Math.round(((totalJobsCount - activeJobsCount) / totalJobsCount) * 100) 
            : 0
        },
        applicationStats: formattedAppStats,
        applicationTrends: formattedTrends,
        jobPerformance: formattedJobPerformance
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get job seeker dashboard analytics
   * @param {string} jobSeekerId - Job seeker ID
   * @returns {Promise<Object>} - Dashboard analytics data
   */
  async getJobSeekerDashboardAnalytics(jobSeekerId) {
    try {
      // Get application statistics
      const applicationStats = await Application.aggregate([
        { $match: { jobSeeker: mongoose.Types.ObjectId(jobSeekerId) } },
        { $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);
      
      // Format application stats
      const formattedAppStats = {
        total: 0,
        pending: 0,
        reviewing: 0,
        interviewed: 0,
        offered: 0,
        rejected: 0,
        withdrawn: 0,
        hired: 0
      };
      
      applicationStats.forEach(stat => {
        formattedAppStats[stat._id] = stat.count;
        formattedAppStats.total += stat.count;
      });
      
      // Get application trends (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const applicationTrends = await Application.aggregate([
        { $match: {
            jobSeeker: mongoose.Types.ObjectId(jobSeekerId),
            appliedAt: { $gte: thirtyDaysAgo }
          }
        },
        { $group: {
            _id: {
              year: { $year: '$appliedAt' },
              month: { $month: '$appliedAt' },
              day: { $dayOfMonth: '$appliedAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
      ]);
      
      // Format application trends
      const formattedTrends = applicationTrends.map(item => ({
        date: new Date(item._id.year, item._id.month - 1, item._id.day),
        count: item.count
      }));
      
      // Get recent application results
      const recentApplications = await Application.find({
        jobSeeker: jobSeekerId
      })
      .populate('job', 'title company location')
      .sort({ appliedAt: -1 })
      .limit(5);
      
      // Format recent applications
      const formattedRecentApplications = recentApplications.map(app => ({
        id: app._id,
        jobTitle: app.job.title,
        company: app.job.company,
        location: app.job.location,
        status: app.status,
        appliedAt: app.appliedAt,
        feedback: app.feedback || null
      }));
      
      // Get application success rate
      const successRate = formattedAppStats.total > 0
        ? Math.round(((formattedAppStats.interviewed + formattedAppStats.offered + formattedAppStats.hired) / formattedAppStats.total) * 100)
        : 0;
      
      return {
        applicationStats: formattedAppStats,
        applicationTrends: formattedTrends,
        recentApplications: formattedRecentApplications,
        successRate: successRate
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get analytics for a specific job
   * @param {string} jobId - Job ID
   * @param {string} employerId - Employer ID (for authorization)
   * @returns {Promise<Object>} - Job analytics
   */
  async getJobAnalytics(jobId, employerId) {
    try {
      // Verify job exists and belongs to employer
      const job = await Job.findById(jobId);
      if (!job) {
        throw new Error('Job not found');
      }
      
      if (job.employer.toString() !== employerId) {
        throw new Error('You are not authorized to view analytics for this job');
      }
      
      // Get application statistics
      const applicationStats = await Application.aggregate([
        { $match: { job: mongoose.Types.ObjectId(jobId) } },
        { $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);
      
      // Format application stats
      const formattedAppStats = {
        total: 0,
        pending: 0,
        reviewing: 0,
        interviewed: 0,
        offered: 0,
        rejected: 0,
        withdrawn: 0,
        hired: 0
      };
      
      applicationStats.forEach(stat => {
        formattedAppStats[stat._id] = stat.count;
        formattedAppStats.total += stat.count;
      });
      
      // Get application trends since job posting
      const applicationTrends = await Application.aggregate([
        { $match: { job: mongoose.Types.ObjectId(jobId) } },
        { $group: {
            _id: {
              year: { $year: '$appliedAt' },
              month: { $month: '$appliedAt' },
              day: { $dayOfMonth: '$appliedAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
      ]);
      
      // Format application trends
      const formattedTrends = applicationTrends.map(item => ({
        date: new Date(item._id.year, item._id.month - 1, item._id.day),
        count: item.count
      }));
      
      // Get funnel conversion rates
      const funnelRates = {
        appliedToReviewing: formattedAppStats.total > 0 
          ? Math.round(((formattedAppStats.reviewing + formattedAppStats.interviewed + formattedAppStats.offered + formattedAppStats.hired) / formattedAppStats.total) * 100) 
          : 0,
        reviewingToInterview: (formattedAppStats.reviewing + formattedAppStats.interviewed + formattedAppStats.offered + formattedAppStats.hired) > 0 
          ? Math.round(((formattedAppStats.interviewed + formattedAppStats.offered + formattedAppStats.hired) / (formattedAppStats.reviewing + formattedAppStats.interviewed + formattedAppStats.offered + formattedAppStats.hired)) * 100) 
          : 0,
        interviewToOffer: (formattedAppStats.interviewed + formattedAppStats.offered + formattedAppStats.hired) > 0 
          ? Math.round(((formattedAppStats.offered + formattedAppStats.hired) / (formattedAppStats.interviewed + formattedAppStats.offered + formattedAppStats.hired)) * 100) 
          : 0,
        offerToHire: (formattedAppStats.offered + formattedAppStats.hired) > 0 
          ? Math.round((formattedAppStats.hired / (formattedAppStats.offered + formattedAppStats.hired)) * 100) 
          : 0
      };
      
      // Get application source data (if available)
      const applicationSources = await Application.aggregate([
        { $match: { job: mongoose.Types.ObjectId(jobId) } },
        { $group: {
            _id: '$source',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]);
      
      // Format application sources
      const formattedSources = applicationSources.map(item => ({
        source: item._id || 'Direct',
        count: item.count
      }));
      
      return {
        jobDetails: {
          title: job.title,
          location: job.location,
          status: job.status,
          postedAt: job.createdAt,
          viewCount: job.viewCount || 0
        },
        applicationStats: formattedAppStats,
        applicationTrends: formattedTrends,
        funnelRates: funnelRates,
        applicationSources: formattedSources
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get admin platform analytics
   * @returns {Promise<Object>} - Platform analytics
   */
  async getPlatformAnalytics() {
    try {
      // Get user statistics
      const userStats = await User.aggregate([
        { $group: {
            _id: '$role',
            count: { $sum: 1 }
          }
        }
      ]);
      
      // Format user stats
      const formattedUserStats = {
        total: 0,
        jobSeekers: 0,
        employers: 0,
        admins: 0
      };
      
      userStats.forEach(stat => {
        formattedUserStats[stat._id === 'jobSeeker' ? 'jobSeekers' : (stat._id === 'employer' ? 'employers' : 'admins')] = stat.count;
        formattedUserStats.total += stat.count;
      });
      
      // Get job statistics
      const jobStats = await Job.aggregate([
        { $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);
      
      // Format job stats
      const formattedJobStats = {
        total: 0,
        active: 0,
        closed: 0,
        draft: 0
      };
      
      jobStats.forEach(stat => {
        formattedJobStats[stat._id] = stat.count;
        formattedJobStats.total += stat.count;
      });
      
      // Get application statistics
      const applicationStats = await Application.aggregate([
        { $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);
      
      // Format application stats
      const formattedAppStats = {
        total: 0,
        pending: 0,
        reviewing: 0,
        interviewed: 0,
        offered: 0,
        rejected: 0,
        withdrawn: 0,
        hired: 0
      };
      
      applicationStats.forEach(stat => {
        formattedAppStats[stat._id] = stat.count;
        formattedAppStats.total += stat.count;
      });
      
      // Get new user registrations trend (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const userTrends = await User.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        { $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' },
              role: '$role'
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
      ]);
      
      // Format user trends
      const formattedUserTrends = [];
      
      userTrends.forEach(item => {
        const date = new Date(item._id.year, item._id.month - 1, item._id.day);
        const dateStr = date.toISOString().split('T')[0];
        
        let existingEntry = formattedUserTrends.find(entry => entry.date === dateStr);
        
        if (!existingEntry) {
          existingEntry = {
            date: dateStr,
            jobSeekers: 0,
            employers: 0
          };
          formattedUserTrends.push(existingEntry);
        }
        
        if (item._id.role === 'jobSeeker') {
          existingEntry.jobSeekers = item.count;
        } else if (item._id.role === 'employer') {
          existingEntry.employers = item.count;
        }
      });
      
      // Get overall platform metrics
      const platformMetrics = {
        jobsPerEmployer: formattedUserStats.employers > 0 
          ? (formattedJobStats.total / formattedUserStats.employers).toFixed(2) 
          : 0,
        applicationsPerJob: formattedJobStats.total > 0 
          ? (formattedAppStats.total / formattedJobStats.total).toFixed(2) 
          : 0,
        applicationSuccessRate: formattedAppStats.total > 0 
          ? Math.round((formattedAppStats.hired / formattedAppStats.total) * 100) 
          : 0,
        averageTimeToHire: 0, // Would require additional calculation with actual data
        activeJobSeekerRate: formattedUserStats.jobSeekers > 0 
          ? Math.round((formattedAppStats.total / formattedUserStats.jobSeekers) * 100) 
          : 0
      };
      
      return {
        userStats: formattedUserStats,
        jobStats: formattedJobStats,
        applicationStats: formattedAppStats,
        userTrends: formattedUserTrends,
        platformMetrics: platformMetrics
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AnalyticsService();