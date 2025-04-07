const Company = require('../models/Company');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const path = require('path');

// @desc    Get all companies
// @route   GET /api/v1/companies
// @access  Public
exports.getCompanies = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single company
// @route   GET /api/v1/companies/:id
// @access  Public
exports.getCompany = asyncHandler(async (req, res, next) => {
  const company = await Company.findById(req.params.id).populate('jobs');
  
  if (!company) {
    return next(
      new ErrorResponse(`Company not found with id of ${req.params.id}`, 404)
    );
  }
  
  res.status(200).json({
    success: true,
    data: company
  });
});

// @desc    Create new company
// @route   POST /api/v1/companies
// @access  Private
exports.createCompany = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;
  
  // Check if company already exists for this user
  const existingCompany = await Company.findOne({ user: req.user.id });
  
  // If the user is not an admin, they can only create one company
  if (existingCompany && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has already created a company`,
        400
      )
    );
  }
  
  const company = await Company.create(req.body);
  
  res.status(201).json({
    success: true,
    data: company
  });
});

// @desc    Update company
// @route   PUT /api/v1/companies/:id
// @access  Private
exports.updateCompany = asyncHandler(async (req, res, next) => {
  let company = await Company.findById(req.params.id);
  
  if (!company) {
    return next(
      new ErrorResponse(`Company not found with id of ${req.params.id}`, 404)
    );
  }
  
  // Make sure user is company owner or admin
  if (company.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this company`,
        401
      )
    );
  }
  
  company = await Company.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    success: true,
    data: company
  });
});

// @desc    Delete company
// @route   DELETE /api/v1/companies/:id
// @access  Private
exports.deleteCompany = asyncHandler(async (req, res, next) => {
  const company = await Company.findById(req.params.id);
  
  if (!company) {
    return next(
      new ErrorResponse(`Company not found with id of ${req.params.id}`, 404)
    );
  }
  
  // Make sure user is company owner or admin
  if (company.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this company`,
        401
      )
    );
  }
  
  await company.remove();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Upload company logo
// @route   PUT /api/v1/companies/:id/logo
// @access  Private
exports.companyLogoUpload = asyncHandler(async (req, res, next) => {
  const company = await Company.findById(req.params.id);
  
  if (!company) {
    return next(
      new ErrorResponse(`Company not found with id of ${req.params.id}`, 404)
    );
  }
  
  // Make sure user is company owner or admin
  if (company.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this company`,
        401
      )
    );
  }
  
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }
  
  const file = req.files.file;
  
  // Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }
  
  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }
  
  // Create custom filename
  file.name = `logo_${company._id}${path.parse(file.name).ext}`;
  
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }
    
    await Company.findByIdAndUpdate(req.params.id, { logo: file.name });
    
    res.status(200).json({
      success: true,
      data: file.name
    });
  });
});

// @desc    Get companies owned by current user
// @route   GET /api/v1/companies/user
// @access  Private
exports.getUserCompanies = asyncHandler(async (req, res, next) => {
  const companies = await Company.find({ user: req.user.id });
  
  res.status(200).json({
    success: true,
    count: companies.length,
    data: companies
  });
});