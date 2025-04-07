const Skill = require('../models/Skill');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all skills
// @route   GET /api/v1/skills
// @access  Public
exports.getSkills = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single skill
// @route   GET /api/v1/skills/:id
// @access  Public
exports.getSkill = asyncHandler(async (req, res, next) => {
  const skill = await Skill.findById(req.params.id);
  
  if (!skill) {
    return next(
      new ErrorResponse(`Skill not found with id of ${req.params.id}`, 404)
    );
  }
  
  res.status(200).json({
    success: true,
    data: skill
  });
});

// @desc    Create new skill
// @route   POST /api/v1/skills
// @access  Private/Admin
exports.createSkill = asyncHandler(async (req, res, next) => {
  const skill = await Skill.create(req.body);
  
  res.status(201).json({
    success: true,
    data: skill
  });
});

// @desc    Update skill
// @route   PUT /api/v1/skills/:id
// @access  Private/Admin
exports.updateSkill = asyncHandler(async (req, res, next) => {
  let skill = await Skill.findById(req.params.id);
  
  if (!skill) {
    return next(
      new ErrorResponse(`Skill not found with id of ${req.params.id}`, 404)
    );
  }
  
  skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    success: true,
    data: skill
  });
});

// @desc    Delete skill
// @route   DELETE /api/v1/skills/:id
// @access  Private/Admin
exports.deleteSkill = asyncHandler(async (req, res, next) => {
  const skill = await Skill.findById(req.params.id);
  
  if (!skill) {
    return next(
      new ErrorResponse(`Skill not found with id of ${req.params.id}`, 404)
    );
  }
  
  await skill.remove();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get skills by category
// @route   GET /api/v1/skills/category/:category
// @access  Public
exports.getSkillsByCategory = asyncHandler(async (req, res, next) => {
  const skills = await Skill.find({ category: req.params.category });
  
  res.status(200).json({
    success: true,
    count: skills.length,
    data: skills
  });
});

// @desc    Get popular skills
// @route   GET /api/v1/skills/popular
// @access  Public
exports.getPopularSkills = asyncHandler(async (req, res, next) => {
  const skills = await Skill.find().sort({ popularity: -1 }).limit(10);
  
  res.status(200).json({
    success: true,
    count: skills.length,
    data: skills
  });
});

// @desc    Increment skill popularity
// @route   PUT /api/v1/skills/:id/increment
// @access  Private/Admin
exports.incrementSkillPopularity = asyncHandler(async (req, res, next) => {
  let skill = await Skill.findById(req.params.id);
  
  if (!skill) {
    return next(
      new ErrorResponse(`Skill not found with id of ${req.params.id}`, 404)
    );
  }
  
  skill = await Skill.findByIdAndUpdate(
    req.params.id,
    { $inc: { popularity: 1 } },
    {
      new: true,
      runValidators: true
    }
  );
  
  res.status(200).json({
    success: true,
    data: skill
  });
});