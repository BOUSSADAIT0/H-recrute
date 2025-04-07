const Application = require('../models/Application');
const Job = require('../models/Job');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const Notification = require('../models/Notification');

// @desc    Get all applications
// @route   GET /api/v1/applications
// @route   GET /api/v1/jobs/:jobId/applications
// @access  Private
exports.getApplications = asyncHandler(async (req, res, next) => {
  if (req.params.jobId) {
    const job = await Job.findById(req.params.jobId);
    
    if (!job) {
      return next(
        new ErrorResponse(`No job with the id of ${req.params.jobId}`),
        404
      );
    }
    
    // Make sure user is job owner or admin
    if (job.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to view applications for this job`,
          401
        )
      );
    }
    
    const applications = await Application.find({ job: req.params.jobId }).populate({
      path: 'user',
      select: 'name email location skills resume'
    });
    
    return res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } else {
    if (req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User not authorized to access all applications`,
          401
        )
      );
    }
    
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get single application
// @route   GET /api/v1/applications/:id
// @access  Private
exports.getApplication = asyncHandler(async (req, res, next) => {
  const application = await Application.findById(req.params.id).populate([
    {
      path: 'user',
      select: 'name email location skills resume'
    },
    {
      path: 'job',
      select: 'title company location salary'
    }
  ]);
  
  if (!application) {
    return next(
      new ErrorResponse(`Application not found with id of ${req.params.id}`, 404)
    );
  }
  
  // Make sure user is application owner, job owner, or admin
  const job = await Job.findById(application.job);
  
  if (
    application.user._id.toString() !== req.user.id &&
    job.user.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to view this application`,
        401
      )
    );
  }
  
  res.status(200).json({
    success: true,
    data: application
  });
});

// @desc    Apply for job
// @route   POST /api/v1/jobs/:jobId/applications
// @access  Private
exports.applyForJob = asyncHandler(async (req, res, next) => {
  req.body.job = req.params.jobId;
  req.body.user = req.user.id;
  
  const job = await Job.findById(req.params.jobId);
  
  if (!job) {
    return next(
      new ErrorResponse(`No job with the id of ${req.params.jobId}`),
      404
    );
  }
  
  // Check if job is still active
  if (!job.isActive) {
    return next(
      new ErrorResponse(
        `This job is no longer accepting applications`,
        400
      )
    );
  }
  
  // Check if user has already applied for this job
  const existingApplication = await Application.findOne({
    user: req.user.id,
    job: req.params.jobId
  });
  
  if (existingApplication) {
    return next(
      new ErrorResponse(
        `You have already applied for this job`,
        400
      )
    );
  }
  
  const application = await Application.create(req.body);
  
  // Create notification for job owner
  await Notification.create({
    recipient: job.user,
    type: 'application',
    message: `New application received for: ${job.title}`,
    link: `/applications/${application._id}`,
    relatedId: application._id
  });
  
  res.status(201).json({
    success: true,
    data: application
  });
});

// @desc    Update application status
// @route   PUT /api/v1/applications/:id/status
// @access  Private
exports.updateApplicationStatus = asyncHandler(async (req, res, next) => {
  let application = await Application.findById(req.params.id);
  
  if (!application) {
    return next(
      new ErrorResponse(`Application not found with id of ${req.params.id}`, 404)
    );
  }
  
  const job = await Job.findById(application.job);
  
  // Make sure user is job owner or admin
  if (job.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this application`,
        401
      )
    );
  }
  
  application = await Application.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    {
      new: true,
      runValidators: true
    }
  );
  
  // Create notification for applicant
  let message;
  if (req.body.status === 'reviewing') {
    message = `Your application for ${job.title} is being reviewed`;
  } else if (req.body.status === 'interviewed') {
    message = `You've been selected for an interview for ${job.title}`;
  } else if (req.body.status === 'accepted') {
    message = `Congratulations! Your application for ${job.title} has been accepted`;
  } else if (req.body.status === 'rejected') {
    message = `Your application for ${job.title} was not selected`;
  }
  
  if (message) {
    await Notification.create({
      recipient: application.user,
      type: 'status',
      message,
      link: `/applications/${application._id}`,
      relatedId: application._id
    });
  }
  
  res.status(200).json({
    success: true,
    data: application
  });
});

// @desc    Delete application
// @route   DELETE /api/v1/applications/:id
// @access  Private
exports.deleteApplication = asyncHandler(async (req, res, next) => {
  const application = await Application.findById(req.params.id);
  
  if (!application) {
    return next(
      new ErrorResponse(`Application not found with id of ${req.params.id}`, 404)
    );
  }
  
  // Make sure user is application owner or admin
  if (application.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this application`,
        401
      )
    );
  }
  
  await application.remove();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get user's applications
// @route   GET /api/v1/applications/user
// @access  Private
exports.getUserApplications = asyncHandler(async (req, res, next) => {
  const applications = await Application.find({ user: req.user.id }).populate({
    path: 'job',
    select: 'title company location salary',
    populate: {
      path: 'company',
      select: 'name logo'
    }
  });
  
  res.status(200).json({
    success: true,
    count: applications.length,
    data: applications
  });
});

// @desc    Add notes to application
// @route   PUT /api/v1/applications/:id/notes
// @access  Private
exports.addApplicationNotes = asyncHandler(async (req, res, next) => {
  let application = await Application.findById(req.params.id);
  
  if (!application) {
    return next(
      new ErrorResponse(`Application not found with id of ${req.params.id}`, 404)
    );
  }
  
  const job = await Job.findById(application.job);
  
  // Make sure user is job owner or admin
  if (job.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this application`,
        401
      )
    );
  }
  
  application = await Application.findByIdAndUpdate(
    req.params.id,
    { notes: req.body.notes },
    {
      new: true,
      runValidators: true
    }
  );
  
  res.status(200).json({
    success: true,
    data: application
  });
});