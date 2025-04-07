const Job = require('../models/Job');
const User = require('../models/User');
const JobSeekerProfile = require('../models/JobSeekerProfile');
const EmployerProfile = require('../models/EmployerProfile');

/**
 * Service for handling search operations
 */
class SearchService {
  /**
   * Search jobs with various filters
   * @param {Object} searchParams - Search parameters
   * @param {Object} pagination - Pagination options
   * @returns {Promise<Object>} - Search results with pagination
   */
  async searchJobs(searchParams, pagination = { page: 1, limit: 10 }) {
    try {
      const query = { status: 'active' };
      
      // Text search
      if (searchParams.keyword) {
        query.$or = [
          { title: { $regex: searchParams.keyword, $options: 'i' } },
          { description: { $regex: searchParams.keyword, $options: 'i' } },
          { requirements: { $regex: searchParams.keyword, $options: 'i' } }
        ];
      }
      
      // Location filter
      if (searchParams.location) {
        query.location = { $regex: searchParams.location, $options: 'i' };
      }
      
      // Job type filter
      if (searchParams.jobType && searchParams.jobType !== 'all') {
        query.jobType = searchParams.jobType;
      }
      
      // Salary range filter
      if (searchParams.minSalary || searchParams.maxSalary) {
        query.salary = {};
        
        if (searchParams.minSalary) {
          query.salary.$gte = parseFloat(searchParams.minSalary);
        }
        
        if (searchParams.maxSalary) {
          query.salary.$lte = parseFloat(searchParams.maxSalary);
        }
      }
      
      // Skills filter
      if (searchParams.skills && searchParams.skills.length > 0) {
        query.skills = { $in: searchParams.skills };
      }
      
      // Experience level filter
      if (searchParams.experienceLevel && searchParams.experienceLevel !== 'all') {
        query.experienceLevel = searchParams.experienceLevel;
      }
      
      // Posted date filter
      if (searchParams.postedWithin) {
        const dateLimit = new Date();
        
        switch (searchParams.postedWithin) {
          case '24h':
            dateLimit.setDate(dateLimit.getDate() - 1);
            break;
          case '7d':
            dateLimit.setDate(dateLimit.getDate() - 7);
            break;
          case '30d':
            dateLimit.setDate(dateLimit.getDate() - 30);
            break;
          default:
            // No date filter
        }
        
        if (searchParams.postedWithin !== 'all') {
          query.createdAt = { $gte: dateLimit };
        }
      }
      
      // Calculate pagination
      const page = parseInt(pagination.page) || 1;
      const limit = parseInt(pagination.limit) || 10;
      const skip = (page - 1) * limit;
      
      // Execute query with pagination
      const jobs = await Job.find(query)
        .populate('employer', 'companyName location companyLogo')
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
   * Search job seekers with various filters
   * @param {Object} searchParams - Search parameters
   * @param {Object} pagination - Pagination options
   * @returns {Promise<Object>} - Search results with pagination
   */
  async searchJobSeekers(searchParams, pagination = { page: 1, limit: 10 }) {
    try {
      // Find job seeker profiles that match criteria
      const profileQuery = {};
      
      // Skills filter
      if (searchParams.skills && searchParams.skills.length > 0) {
        profileQuery.skills = { $in: searchParams.skills };
      }
      
      // Experience level filter
      if (searchParams.experienceLevel && searchParams.experienceLevel !== 'all') {
        profileQuery.experienceLevel = searchParams.experienceLevel;
      }
      
      // Education level filter
      if (searchParams.educationLevel && searchParams.educationLevel !== 'all') {
        profileQuery['education.degreeLevel'] = searchParams.educationLevel;
      }
      
      // Location filter
      if (searchParams.location) {
        profileQuery.location = { $regex: searchParams.location, $options: 'i' };
      }
      
      // Availability filter
      if (searchParams.availability && searchParams.availability !== 'all') {
        profileQuery['jobPreferences.availability'] = searchParams.availability;
      }
      
      // Calculate pagination
      const page = parseInt(pagination.page) || 1;
      const limit = parseInt(pagination.limit) || 10;
      const skip = (page - 1) * limit;
      
      // Find users with matching profiles
      const profiles = await JobSeekerProfile.find(profileQuery)
        .populate('user', 'firstName lastName email avatar')
        .populate('skills', 'name category level')
        .skip(skip)
        .limit(limit);
      
      // Get total count for pagination
      const total = await JobSeekerProfile.countDocuments(profileQuery);
      
      // Format response
      const jobSeekers = profiles.map(profile => ({
        id: profile.user._id,
        companyName: profile.user.companyName,
        email: profile.user.email,
        logo: profile.user.logo,
        industry: profile.industry ? profile.industry.name : null,
        companySize: profile.companySize,
        locations: profile.locations,
        founded: profile.founded,
        website: profile.website,
        profileId: profile._id._id,
        firstName: profile.user.firstName,
        lastName: profile.user.lastName,
        email: profile.user.email,
        avatar: profile.user.avatar,
        title: profile.title,
        summary: profile.summary,
        location: profile.location,
        skills: profile.skills,
        experience: profile.yearsOfExperience,
        profileId: profile._id
      }));
      
      return {
        jobSeekers,
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
   * Search employers with various filters
   * @param {Object} searchParams - Search parameters
   * @param {Object} pagination - Pagination options
   * @returns {Promise<Object>} - Search results with pagination
   */
  async searchEmployers(searchParams, pagination = { page: 1, limit: 10 }) {
    try {
      // Find employer profiles that match criteria
      const profileQuery = {};
      
      // Industry filter
      if (searchParams.industry) {
        profileQuery.industry = searchParams.industry;
      }
      
      // Company size filter
      if (searchParams.companySize && searchParams.companySize !== 'all') {
        profileQuery.companySize = searchParams.companySize;
      }
      
      // Location filter
      if (searchParams.location) {
        profileQuery.locations = { $elemMatch: { $regex: searchParams.location, $options: 'i' } };
      }
      
      // Calculate pagination
      const page = parseInt(pagination.page) || 1;
      const limit = parseInt(pagination.limit) || 10;
      const skip = (page - 1) * limit;
      
      // Find users with matching profiles
      const profiles = await EmployerProfile.find(profileQuery)
        .populate('user', 'companyName email logo')
        .populate('industry', 'name')
        .skip(skip)
        .limit(limit);
      
      // Get total count for pagination
      const total = await EmployerProfile.countDocuments(profileQuery);
      
      // Format response
      const employers = profiles.map(profile => ({
        id: profile.user