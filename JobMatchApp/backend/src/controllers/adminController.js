const User = require('../models/User');
const Job = require('../models/Job');
const Company = require('../models/Company');
const Application = require('../models/Application');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get admin dashboard stats
// @route   GET /api/v1/admin/stats
// @access  Private/Admin
exports.getDashboardStats = asyncHandler(async (req, res, next) => {
  // Get counts
  const userCount = await User.countDocuments();
  const jobCount = await Job.countDocuments();
  const companyCount = await Company.countDocuments();
  const applicationCount = await Application.countDocuments();
  
  // Active jobs vs inactive jobs
  const activeJobs = await Job.countDocuments({ isActive: true });
  const inactiveJobs = await Job.countDocuments({ isActive: false });
  
  // User role distribution
  const jobseekers = await User.countDocuments({ role: 'jobseeker' });
  const employers = await User.countDocuments({ role: 'employer' });
  const admins = await User.countDocuments({ role: 'admin' });
  
  // Application status distribution
  const pendingApplications = await Application.countDocuments({ status: 'pending' });
  const reviewingApplications = await Application.countDocuments({ status: 'reviewing' });
  const interviewedApplications = await Application.countDocuments({ status: 'interviewed' });
  const acceptedApplications = await Application.countDocuments({ status: 'accepted' });
  const rejectedApplications = await Application.countDocuments({ status: 'rejected' });
  
  // Recent activity
  const recentUsers = await User.find()
    .select('name email role createdAt')
    .sort({ createdAt: -1 })
    .limit(5);
    
  const recentJobs = await Job.find()
    .select('title company location createdAt')
    .populate({
      path: 'company',
      select: 'name'
    })
    .sort({ createdAt: -1 })
    .limit(5);
    
  const recentApplications = await Application.find()
    .select('job user status createdAt')
    .populate({
      path: 'job',
      select: 'title'
    })
    .populate({
      path: 'user',
      select: 'name'
    })
    .sort({ createdAt: -1 })
    .limit(5);
  
  res.status(200).json({
    success: true,
    data: {
      counts: {
        users: userCount,
        jobs: jobCount,
        companies: companyCount,
        applications: applicationCount
      },
      jobs: {
        active: activeJobs,
        inactive: inactiveJobs
      },
      users: {
        jobseekers,
        employers,
        admins
      },
      applications: {
        pending: pendingApplications,
        reviewing: reviewingApplications,
        interviewed: interviewedApplications,
        accepted: acceptedApplications,
        rejected: rejectedApplications
      },
      recent: {
        users: recentUsers,
        jobs: recentJobs,
        applications: recentApplications
      }
    }
  });
});

// @desc    Get all users with pagination and filtering
// @route   GET /api/v1/admin/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get all jobs with pagination and filtering
// @route   GET /api/v1/admin/jobs
// @access  Private/Admin
exports.getJobs = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get all companies with pagination and filtering
// @route   GET /api/v1/admin/companies
// @access  Private/Admin
exports.getCompanies = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get all applications with pagination and filtering
// @route   GET /api/v1/admin/applications
// @access  Private/Admin
exports.getApplications = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Update user role
// @route   PUT /api/v1/admin/users/:id/role
// @access  Private/Admin
exports.updateUserRole = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }
  
  // Prevent admin from changing their own role
  if (user._id.toString() === req.user.id) {
    return next(
      new ErrorResponse(`You cannot change your own role`, 400)
    );
  }
  
  user.role = req.body.role;
  await user.save();
  
  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Toggle user account status (active/inactive)
// @route   PUT /api/v1/admin/users/:id/status
// @access  Private/Admin
exports.toggleUserStatus = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }
  
  // Prevent admin from disabling their own account
  if (user._id.toString() === req.user.id) {
    return next(
      new ErrorResponse(`You cannot change your own account status`, 400)
    );
  }
  
  user.isActive = !user.isActive;
  await user.save();
  
  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Delete user (admin only)
// @route   DELETE /api/v1/admin/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }
  
  // Prevent admin from deleting their own account
  if (user._id.toString() === req.user.id) {
    return next(
      new ErrorResponse(`You cannot delete your own account`, 400)
    );
  }
  
  await user.remove();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get application analytics
// @route   GET /api/v1/admin/analytics/applications
// @access  Private/Admin
exports.getApplicationAnalytics = asyncHandler(async (req, res, next) => {
  // Applications by date (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const applicationsByDate = await Application.aggregate([
    {
      $match: {
        createdAt: { $gte: thirtyDaysAgo }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);
  
  // Applications by job category
  const applicationsByJobCategory = await Application.aggregate([
    {
      $lookup: {
        from: 'jobs',
        localField: 'job',
        foreignField: '_id',
        as: 'jobData'
      }
    },
    {
      $unwind: '$jobData'
    },
    {
      $group: {
        _id: '$jobData.category',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
  
  // Applications by status
  const applicationsByStatus = await Application.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
  
  res.status(200).json({
    success: true,
    data: {
      byDate: applicationsByDate,
      byJobCategory: applicationsByJobCategory,
      byStatus: applicationsByStatus
    }
  });
});

// @desc    Get user analytics
// @route   GET /api/v1/admin/analytics/users
// @access  Private/Admin
exports.getUserAnalytics = asyncHandler(async (req, res, next) => {
  // User registrations by date (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const usersByDate = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: thirtyDaysAgo }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);
  
  // Users by role
  const usersByRole = await User.aggregate([
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
  
  // Users by location
  const usersByLocation = await User.aggregate([
    {
      $group: {
        _id: '$location',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    },
    {
      $limit: 10
    }
  ]);
  
  res.status(200).json({
    success: true,
    data: {
      byDate: usersByDate,
      byRole: usersByRole,
      byLocation: usersByLocation
    }
  });
});

// @desc    Get job posting analytics
// @route   GET /api/v1/admin/analytics/jobs
// @access  Private/Admin
exports.getJobAnalytics = asyncHandler(async (req, res, next) => {
  // Jobs created by date (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const jobsByDate = await Job.aggregate([
    {
      $match: {
        createdAt: { $gte: thirtyDaysAgo }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);
  
  // Jobs by category
  const jobsByCategory = await Job.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
  
  // Jobs by location
  const jobsByLocation = await Job.aggregate([
    {
      $group: {
        _id: '$location',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    },
    {
      $limit: 10
    }
  ]);
  
  // Jobs by type (full-time, part-time, etc.)
  const jobsByType = await Job.aggregate([
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
  
  res.status(200).json({
    success: true,
    data: {
      byDate: jobsByDate,
      byCategory: jobsByCategory,
      byLocation: jobsByLocation,
      byType: jobsByType
    }
  });
});