const Skill = require('../models/Skill');
const mongoose = require('mongoose');

/**
 * Service for handling skill-related operations
 */
class SkillService {
  /**
   * Create a new skill
   * @param {Object} skillData - Skill data
   * @returns {Promise<Object>} - Newly created skill
   */
  async createSkill(skillData) {
    try {
      // Check if skill already exists
      const existingSkill = await Skill.findOne({ name: skillData.name });
      if (existingSkill) {
        throw new Error('Skill with this name already exists');
      }
      
      const newSkill = new Skill({
        ...skillData,
        createdAt: new Date()
      });
      
      await newSkill.save();
      return newSkill;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get skill by ID
   * @param {string} skillId - Skill ID
   * @returns {Promise<Object>} - Skill object
   */
  async getSkillById(skillId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(skillId)) {
        throw new Error('Invalid skill ID');
      }
      
      const skill = await Skill.findById(skillId);
      if (!skill) {
        throw new Error('Skill not found');
      }
      
      return skill;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update a skill
   * @param {string} skillId - Skill ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} - Updated skill
   */
  async updateSkill(skillId, updateData) {
    try {
      if (!mongoose.Types.ObjectId.isValid(skillId)) {
        throw new Error('Invalid skill ID');
      }
      
      // Check for duplicate name if name is being updated
      if (updateData.name) {
        const existingSkill = await Skill.findOne({ 
          name: updateData.name,
          _id: { $ne: skillId }
        });
        
        if (existingSkill) {
          throw new Error('Skill with this name already exists');
        }
      }
      
      const updatedSkill = await Skill.findByIdAndUpdate(
        skillId,
        { $set: updateData },
        { new: true }
      );
      
      if (!updatedSkill) {
        throw new Error('Skill not found');
      }
      
      return updatedSkill;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a skill
   * @param {string} skillId - Skill ID
   * @returns {Promise<boolean>} - Success status
   */
  async deleteSkill(skillId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(skillId)) {
        throw new Error('Invalid skill ID');
      }
      
      const result = await Skill.findByIdAndDelete(skillId);
      if (!result) {
        throw new Error('Skill not found');
      }
      
      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all skills or filter by category
   * @param {Object} filters - Optional filters
   * @returns {Promise<Array>} - Array of skills
   */
  async getSkills(filters = {}) {
    try {
      const query = {};
      
      // Apply category filter if provided
      if (filters.category) {
        query.category = filters.category;
      }
      
      // Apply search filter if provided
      if (filters.search) {
        query.name = { $regex: filters.search, $options: 'i' };
      }
      
      const skills = await Skill.find(query).sort({ category: 1, name: 1 });
      return skills;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get skill categories
   * @returns {Promise<Array>} - Array of unique categories
   */
  async getCategories() {
    try {
      const categories = await Skill.distinct('category');
      return categories;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get related skills
   * @param {string} skillId - Skill ID
   * @returns {Promise<Array>} - Array of related skills
   */
  async getRelatedSkills(skillId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(skillId)) {
        throw new Error('Invalid skill ID');
      }
      
      const skill = await Skill.findById(skillId);
      if (!skill) {
        throw new Error('Skill not found');
      }
      
      // Find skills in the same category
      const relatedSkills = await Skill.find({
        category: skill.category,
        _id: { $ne: skillId }
      }).limit(5);
      
      return relatedSkills;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Batch create multiple skills
   * @param {Array} skillsData - Array of skill data objects
   * @returns {Promise<Array>} - Array of created skills
   */
  async batchCreateSkills(skillsData) {
    try {
      // Filter out skills that already exist
      const existingSkills = await Skill.find({
        name: { $in: skillsData.map(skill => skill.name) }
      });
      
      const existingNames = existingSkills.map(skill => skill.name);
      
      const newSkillsData = skillsData.filter(
        skill => !existingNames.includes(skill.name)
      );
      
      if (newSkillsData.length === 0) {
        return [];
      }
      
      // Add timestamps to new skills
      const skillsToCreate = newSkillsData.map(skillData => ({
        ...skillData,
        createdAt: new Date()
      }));
      
      // Create new skills
      const createdSkills = await Skill.insertMany(skillsToCreate);
      
      return createdSkills;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new SkillService();