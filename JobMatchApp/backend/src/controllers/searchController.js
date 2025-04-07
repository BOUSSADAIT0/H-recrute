const Job = require('../models/Job');
const Company = require('../models/Company');
const User = require('../models/User');
const Skill = require('../models/Skill');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Search jobs
// @route   GET /api/v1/search/jobs
// @access  Public
exports.searchJobs = asyncHandler(async (req, res, next) => {
  const { title, location, type, salary, skills, company } = req.query;
  
  let query = { isActive: true };
  
  // Search by title
  if (title) {
    query.title = { $regex: title, $options: 'i' };
  }
  
  // Search by location
  if (location) {
    query.location = { $regex: location, $options: 'i' };
  }
  
  // Search by job type
  if (type) {
    query.type = type;
  }
  
  // Search by salary range
  if (salary) {
    query.salary = { $gte: parseInt(salary) };
  }
  
  // Search by required skills
  if (skills) {
    const skillsArray = skills.split(',');
    query.requiredSkills = { $in: skillsArray };
  }
  
  // Search by company
  if (company) {
    const companies = await Company.find({
      name: { $regex: company, $options: 'i' }
    }).select('_id');
    
    const companyIds = companies.map(company => company._id);
    query.company = { $in: companyIds };
  }
  
  const results = await Job.find(query)
    .populate({
      path: 'company',
      select: 'name logo location'
    })
    .sort({ createdAt: -1 });
  
  res.status(200).json({
    success: true,
    count: results.length,
    data: results
  });
});

// @desc    Search companies
// @route   GET /api/v1/search/companies
// @access  Public
exports.searchCompanies = asyncHandler(async (req, res, next) => {
  const { name, location, industry } = req.query;
  
  let query = {};
  
  // Search by name
  if (name) {
    query.name = { $regex: name, $options: 'i' };
  }
  
  // Search by location
  if (location) {
    query.location = { $regex: location, $options: 'i' };
  }
  
  // Search by industry
  if (industry) {
    query.industry = { $regex: industry, $options: 'i' };
  }
  
  const results = await Company.find(query).sort({ name: 1 });
  
  res.status(200).json({
    success: true,
    count: results.length,
    data: results
  });
});

// @desc    Search skills
// @route   GET /api/v1/search/skills
// @access  Public
exports.searchSkills = asyncHandler(async (req, res, next) => {
  const { name, category } = req.query;
  
  let query = {};
  
  // Search by name
  if (name) {
    query.name = { $regex: name, $options: 'i' };
  }
  
  // Search by category
  if (category) {
    query.category = { $regex: category, $options: 'i' };
  }
  
  const results = await Skill.find(query).sort({ popularity: -1 });
  
  res.status(200).json({
    success: true,
    count: results.length,
    data: results
  });
});

// @desc    Search candidates (for employers)
// @route   GET /api/v1/search/candidates
// @access  Private/Employer
exports.searchCandidates = asyncHandler(async (req, res, next) => {
  // Check if user is an employer or admin
  if (req.user.role !== 'employer' && req.user.role !== 'admin') {
    return next(
      new ErrorResponse('Not authorized to access candidate search', 401)
    );
  }
  
  const { skills, location, experience } = req.query;
  
  let query = { role: 'jobseeker' };
  
  // Search by skills
  if (skills) {
    const skillsArray = skills.split(',');
    query.skills = { $in: skillsArray };
  }
  
  // Search by location
  if (location) {
    query.location = { $regex: location, $options: 'i' };
  }
  
  // Search by years of experience
  if (experience) {
    query.experience = { $gte: parseInt(experience) };
  }
  
  const results = await User.find(query)
    .select('name location skills experience education bio resume')
    .sort({ updatedAt: -1 });
  
  res.status(200).json({
    success: true,
    count: results.length,
    data: results
  });
});

// @desc    Full-text search across multiple resources
// @route   GET /api/v1/search
// @access  Public
exports.globalSearch = asyncHandler(async (req, res, next) => {
  const { q } = req.query;
  
  if (!q) {
    return next(new ErrorResponse('Please provide a search query', 400));
  }
  
  // Search jobs
  const jobs = await Job.find({
    $or: [
      { title: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { location: { $regex: q, $options: 'i' } }
    ],
    isActive: true
  })
    .populate({
      path: 'company',
      select: 'name logo'
    })
    .limit(5);
  
  // Search companies
  const companies = await Company.find({
    $or: [
      { name: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { industry: { $regex: q, $options: 'i' } }
    ]
  }).limit(5);
  
  // Search skills
  const skills = await Skill.find({
    $or: [
      { name: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } }
    ]
  }).limit(5);
  
  res.status(200).json({
    success: true,
    data: {
      jobs: {
        count: jobs.length,
        data: jobs
      },
      companies: {
        count: companies.length,
        data: companies
      },
      skills: {
        count: skills.length,
        data: skills
      }
    }
  });
});