const JobSeekerProfile = require('../models/JobSeekerProfile');
const EmployerProfile = require('../models/EmployerProfile');
const User = require('../models/User');
const mongoose = require('mongoose');

/**
 * Service for handling user profile operations
 */
class ProfileService {
  /**
   * Create or update job seeker profile
   * @param {string} userId - User ID
   * @param {Object} profileData - Profile data
   * @returns {Promise<Object>} - Updated job seeker profile
   */
  async updateJobSeekerProfile(userId, profileData) {
    try {
      // Check if user exists and is a job seeker
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      
      if (user.role !== 'jobSeeker') {
        throw new Error('User is not a job seeker');
      }
      
      // Find existing profile or create new one
      let profile = await JobSeekerProfile.findOne({ user: userId });
      
      if (profile) {
        // Update existing profile
        Object.assign(profile, profileData);
      } else {
        // Create new profile
        profile = new JobSeekerProfile({
          user: userId,
          ...profileData
        });
      }
      
      await profile.save();
      
      // Populate skills and return
      const populatedProfile = await JobSeekerProfile.findById(profile._id)
        .populate('skills', 'name category level')
        .populate('education.institution')
        .populate('workExperience.company');
      
      return populatedProfile;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create or update employer profile
   * @param {string} userId - User ID
   * @param {Object} profileData - Profile data
   * @returns {Promise<Object>} - Updated employer profile
   */
  async updateEmployerProfile(userId, profileData) {
    try {
      // Check if user exists and is an employer
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      
      if (user.role !== 'employer') {
        throw new Error('User is not an employer');
      }
      
      // Find existing profile or create new one
      let profile = await EmployerProfile.findOne({ user: userId });
      
      if (profile) {
        // Update existing profile
        Object.assign(profile, profileData);
      } else {
        // Create new profile
        profile = new EmployerProfile({
          user: userId,
          ...profileData
        });
      }
      
      await profile.save();
      
      // Populate and return
      const populatedProfile = await EmployerProfile.findById(profile._id)
        .populate('industry')
        .populate('locations');
      
      return populatedProfile;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get job seeker profile
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Job seeker profile
   */
  async getJobSeekerProfile(userId) {
    try {
      const profile = await JobSeekerProfile.findOne({ user: userId })
        .populate('skills', 'name category level')
        .populate('education.institution')
        .populate('workExperience.company');
      
      if (!profile) {
        throw new Error('Profile not found');
      }
      
      return profile;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get employer profile
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Employer profile
   */
  async getEmployerProfile(userId) {
    try {
      const profile = await EmployerProfile.findOne({ user: userId })
        .populate('industry')
        .populate('locations');
      
      if (!profile) {
        throw new Error('Profile not found');
      }
      
      return profile;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Add education to job seeker profile
   * @param {string} userId - User ID
   * @param {Object} educationData - Education data
   * @returns {Promise<Object>} - Updated profile
   */
  async addEducation(userId, educationData) {
    try {
      const profile = await JobSeekerProfile.findOne({ user: userId });
      if (!profile) {
        throw new Error('Profile not found');
      }
      
      profile.education.push({
        ...educationData,
        _id: new mongoose.Types.ObjectId()
      });
      
      await profile.save();
      
      // Populate and return
      const updatedProfile = await JobSeekerProfile.findById(profile._id)
        .populate('skills', 'name category level')
        .populate('education.institution')
        .populate('workExperience.company');
      
      return updatedProfile;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update education in job seeker profile
   * @param {string} userId - User ID
   * @param {string} educationId - Education ID
   * @param {Object} educationData - Updated education data
   * @returns {Promise<Object>} - Updated profile
   */
  async updateEducation(userId, educationId, educationData) {
    try {
      const profile = await JobSeekerProfile.findOne({ user: userId });
      if (!profile) {
        throw new Error('Profile not found');
      }
      
      // Find education entry
      const educationIndex = profile.education.findIndex(
        edu => edu._id.toString() === educationId
      );
      
      if (educationIndex === -1) {
        throw new Error('Education entry not found');
      }
      
      // Update education
      Object.assign(profile.education[educationIndex], educationData);
      profile.markModified('education');
      
      await profile.save();
      
      // Populate and return
      const updatedProfile = await JobSeekerProfile.findById(profile._id)
        .populate('skills', 'name category level')
        .populate('education.institution')
        .populate('workExperience.company');
      
      return updatedProfile;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete education from job seeker profile
   * @param {string} userId - User ID
   * @param {string} educationId - Education ID
   * @returns {Promise<Object>} - Updated profile
   */
  async deleteEducation(userId, educationId) {
    try {
      const profile = await JobSeekerProfile.findOne({ user: userId });
      if (!profile) {
        throw new Error('Profile not found');
      }
      
      // Remove education entry
      profile.education = profile.education.filter(
        edu => edu._id.toString() !== educationId
      );
      
      await profile.save();
      
      // Populate and return
      const updatedProfile = await JobSeekerProfile.findById(profile._id)
        .populate('skills', 'name category level')
        .populate('education.institution')
        .populate('workExperience.company');
      
      return updatedProfile;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Add work experience to job seeker profile
   * @param {string} userId - User ID
   * @param {Object} experienceData - Work experience data
   * @returns {Promise<Object>} - Updated profile
   */
  async addWorkExperience(userId, experienceData) {
    try {
      const profile = await JobSeekerProfile.findOne({ user: userId });
      if (!profile) {
        throw new Error('Profile not found');
      }
      
      profile.workExperience.push({
        ...experienceData,
        _id: new mongoose.Types.ObjectId()
      });
      
      await profile.save();
      
      // Populate and return
      const updatedProfile = await JobSeekerProfile.findById(profile._id)
        .populate('skills', 'name category level')
        .populate('education.institution')
        .populate('workExperience.company');
      
      return updatedProfile;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update work experience in job seeker profile
   * @param {string} userId - User ID
   * @param {string} experienceId - Experience ID
   * @param {Object} experienceData - Updated experience data
   * @returns {Promise<Object>} - Updated profile
   */
  async updateWorkExperience(userId, experienceId, experienceData) {
    try {
      const profile = await JobSeekerProfile.findOne({ user: userId });
      if (!profile) {
        throw new Error('Profile not found');
      }
      
      // Find experience entry
      const expIndex = profile.workExperience.findIndex(
        exp => exp._id.toString() === experienceId
      );
      
      if (expIndex === -1) {
        throw new Error('Work experience entry not found');
      }
      
      // Update experience
      Object.assign(profile.workExperience[expIndex], experienceData);
      profile.markModified('workExperience');
      
      await profile.save();
      
      // Populate and return
      const updatedProfile = await JobSeekerProfile.findById(profile._id)
        .populate('skills', 'name category level')
        .populate('education.institution')
        .populate('workExperience.company');
      
      return updatedProfile;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete work experience from job seeker profile
   * @param {string} userId - User ID
   * @param {string} experienceId - Experience ID
   * @returns {Promise<Object>} - Updated profile
   */
  async deleteWorkExperience(userId, experienceId) {
    try {
      const profile = await JobSeekerProfile.findOne({ user: userId });
      if (!profile) {
        throw new Error('Profile not found');
      }
      
      // Remove experience entry
      profile.workExperience = profile.workExperience.filter(
        exp => exp._id.toString() !== experienceId
      );
      
      await profile.save();
      
      // Populate and return
      const updatedProfile = await JobSeekerProfile.findById(profile._id)
        .populate('skills', 'name category level')
        .populate('education.institution')
        .populate('workExperience.company');
      
      return updatedProfile;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update job preferences in job seeker profile
   * @param {string} userId - User ID
   * @param {Object} preferencesData - Job preferences
   * @returns {Promise<Object>} - Updated profile
   */
  async updateJobPreferences(userId, preferencesData) {
    try {
      const profile = await JobSeekerProfile.findOne({ user: userId });
      if (!profile) {
        throw new Error('Profile not found');
      }
      
      // Create or update job preferences
      if (!profile.jobPreferences) {
        profile.jobPreferences = preferencesData;
      } else {
        Object.assign(profile.jobPreferences, preferencesData);
      }
      
      profile.markModified('jobPreferences');
      await profile.save();
      
      return profile;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update company details in employer profile
   * @param {string} userId - User ID
   * @param {Object} companyData - Company details
   * @returns {Promise<Object>} - Updated profile
   */
  async updateCompanyDetails(userId, companyData) {
    try {
      const profile = await EmployerProfile.findOne({ user: userId });
      if (!profile) {
        throw new Error('Profile not found');
      }
      
      // Update company details
      Object.assign(profile, companyData);
      
      await profile.save();
      
      // Populate and return
      const updatedProfile = await EmployerProfile.findById(profile._id)
        .populate('industry')
        .populate('locations');
      
      return updatedProfile;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ProfileService();