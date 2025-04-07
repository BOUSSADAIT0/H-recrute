const Job = require('../models/Job');
const Company = require('../models/Company');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all jobs
// @route   GET /api/v1/jobs
// @route   GET /api/v1/companies/:companyId/jobs
// @access  Public
exports.getJobs = asyncHandler(async (req, res, next) => {
  if (req.params.companyId) {
    const jobs = await Job.find({ company: req.params.companyId });
    
    return res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get single job
// @route   GET /api/v1/jobs/:id
// @access  Public
exports.getJob = asyncHandler(async (req, res, next) => {
  const job = await Job.findById(req.params.id).populate({
    path: 'company',
    select: 'name description location website logo'
  });
  
  if (!job) {
    return next(
      new ErrorResponse(`Job not found with id of ${req.params.id}`, 404)
    );
  }
  
  res.status(200).json({
    success: true,
    data: job
  });
});

// @desc    Create new job
// @route   POST /api/v1/companies/:companyId/jobs
// @access  Private
exports.createJob = asyncHandler(async (req, res, next) => {
  req.body.company = req.params.companyId;
  req.body.user = req.user.id;
  
  const company = await Company.findById(req.params.companyId);
  
  if (!company) {
    return next(
      new ErrorResponse(
        `Company not found with id of ${req.params.companyId}`,
        404
      )
    );
  }
  
  // Make sure user is company owner or admin
  if (company.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to add a job to this company`,
        401
      )
    );
  }
  
  const job = await Job.create(req.body);
  
  res.status(201).json({
    success: true,
    data: job
  });
});

// @desc    Update job
// @route   PUT /api/v1/jobs/:id
// @access  Private
exports.updateJob = asyncHandler(async (req, res, next) => {
  let job = await Job.findById(req.params.id);
  
  if (!job) {
    return next(
      new ErrorResponse(`Job not found with id of ${req.params.id}`, 404)
    );
  }
  
  // Make sure user is job owner or admin
  if (job.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this job`,
        401
      )
    );
  }
  
  job = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    success: true,
    data: job
  });
});

// @desc    Delete job
// @route   DELETE /api/v1/jobs/:id
// @access  Private
exports.deleteJob = asyncHandler(async (req, res, next) => {
  const job = await Job.findById(req.params.id);
  
  if (!job) {
    return next(
      new ErrorResponse(`Job not found with id of ${req.params.id}`, 404)
    );
  }
  
  // Make sure user is job owner or admin
  if (job.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this job`,
        401
      )
    );
  }
  
  await job.remove();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get jobs created by current user
// @route   GET /api/v1/jobs/user
// @access  Private
exports.getUserJobs = asyncHandler(async (req, res, next) => {
  const jobs = await Job.find({ user: req.user.id }).populate({
    path: 'company',
    select: 'name logo'
  });
  
  res.status(200).json({
    success: true,
    count: jobs.length,
    data: jobs
  });
});

// @desc    Get jobs matching user's skills
// @route   GET /api/v1/jobs/matches
// @access  Private
exports.getMatchingJobs = asyncHandler(async (req, res, next) => {
  const user = req.user;
  
  // Find jobs that match user's skills
  const jobs = await Job.find({
    requiredSkills: { $in: user.skills }
  }).populate({
    path: 'company',
    select: 'name location logo'
  });
  
  res.status(200).json({
    success: true,
    count: jobs.length,
    data: jobs
  });
});

// @desc    Toggle job active status
// @route   PUT /api/v1/jobs/:id/toggle-status
// @access  Private
exports.toggleJobStatus = asyncHandler(async (req, res, next) => {
  let job = await Job.findById(req.params.id);
  
  if (!job) {
    return next(
      new ErrorResponse(`Job not found with id of ${req.params.id}`, 404)
    );
  }
  
  // Make sure user is job owner or admin
  if (job.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this job`,
        401
      )
    );
  }
  
  job = await Job.findByIdAndUpdate(
    req.params.id,
    { isActive: !job.isActive },
    {
      new: true,
      runValidators: true
    }
  );
  
  res.status(200).json({
    success: true,
    data: job
  });
});