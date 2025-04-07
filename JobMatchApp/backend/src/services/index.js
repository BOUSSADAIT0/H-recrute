// Export all services from a single file for easier importing

const authService = require('./authService');
const userService = require('./userService');
const jobService = require('./jobService');
const applicationService = require('./applicationService');
const notificationService = require('./notificationService');
const skillService = require('./skillService');
const profileService = require('./profileService');
const searchService = require('./searchService');
const analyticsService = require('./analyticsService');
const bookmarkService = require('./bookmarkService');
const messageService = require('./messageService');
const feedbackService = require('./feedbackService');

module.exports = {
  authService,
  userService,
  jobService,
  applicationService,
  notificationService,
  skillService,
  profileService,
  searchService,
  analyticsService,
  bookmarkService,
  messageService,
  feedbackService
};