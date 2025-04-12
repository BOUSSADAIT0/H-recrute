// API Endpoints
export const API_ENDPOINTS = {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH_TOKEN: '/auth/refresh-token',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
      ME: '/auth/me',
    },
    USERS: {
      PROFILE: '/users/me',
      UPDATE_PROFILE: '/users/updateprofile',
      RESUME: '/users/resume',
      SKILLS: '/users/skills',
    },
    JOBS: {
      LIST: '/jobs',
      DETAIL: '/jobs/:id',
      CREATE: '/jobs',
      UPDATE: '/jobs/:id',
      DELETE: '/jobs/:id',
      SEARCH: '/jobs/search',
      RECOMMENDED: '/jobs/recommended',
      MY_JOBS: '/jobs/user',
    },
    APPLICATIONS: {
      LIST: '/applications',
      DETAIL: '/applications/:id',
      CREATE: '/applications',
      UPDATE_STATUS: '/applications/:id/status',
      USER_APPLICATIONS: '/applications/user',
    },
    COMPANIES: {
      LIST: '/companies',
      DETAIL: '/companies/:id',
      CREATE: '/companies',
      UPDATE: '/companies/:id',
      JOBS: '/companies/:id/jobs',
      LOGO: '/companies/:id/logo',
    },
    MESSAGES: {
      CONVERSATIONS: '/messages/conversations',
      MESSAGES: '/messages/conversations/:id',
      SEND: '/messages',
      UNREAD_COUNT: '/messages/unread/count',
    },
    NOTIFICATIONS: {
      LIST: '/notifications',
      MARK_READ: '/notifications/:id/read',
      MARK_ALL_READ: '/notifications/read/all',
      UNREAD_COUNT: '/notifications/unread/count',
    },
    SKILLS: {
      LIST: '/skills',
      CATEGORIES: '/skills/categories',
      POPULAR: '/skills/popular',
      SEARCH: '/skills/search',
    },
  };
  
  // User Roles
  export const USER_ROLES = {
    JOB_SEEKER: 'jobseeker',
    EMPLOYER: 'recruiter',
    ADMIN: 'admin',
  };
  
  // Job Types
  export const JOB_TYPES = [
    { id: 'full-time', label: 'Full-time' },
    { id: 'part-time', label: 'Part-time' },
    { id: 'contract', label: 'Contract' },
    { id: 'internship', label: 'Internship' },
    { id: 'remote', label: 'Remote' },
  ];
  
  // Experience Levels
  export const EXPERIENCE_LEVELS = [
    { id: 'entry', label: 'Entry Level' },
    { id: 'junior', label: 'Junior' },
    { id: 'mid-level', label: 'Mid-Level' },
    { id: 'senior', label: 'Senior' },
    { id: 'executive', label: 'Executive' },
  ];
  
  // Application Status
  export const APPLICATION_STATUS = {
    PENDING: 'pending',
    REVIEWING: 'reviewing',
    INTERVIEWED: 'interviewed',
    REJECTED: 'rejected',
    OFFERED: 'offered',
    HIRED: 'hired',
    WITHDRAWN: 'withdrawn',
  };
  
  // Company Sizes
  export const COMPANY_SIZES = [
    { id: '1-10', label: '1-10 employees' },
    { id: '11-50', label: '11-50 employees' },
    { id: '51-200', label: '51-200 employees' },
    { id: '201-500', label: '201-500 employees' },
    { id: '501-1000', label: '501-1000 employees' },
    { id: '1000+', label: 'More than 1000 employees' },
  ];
  
  // Notification Types
  export const NOTIFICATION_TYPES = {
    APPLICATION: 'application',
    STATUS_UPDATE: 'status',
    MESSAGE: 'message',
    INTERVIEW: 'interview',
    OFFER: 'offer',
    SYSTEM: 'system',
  };
  
  // Date Formats
  export const DATE_FORMATS = {
    DEFAULT: 'MMMM D, YYYY',
    SHORT: 'MMM D, YYYY',
    WITH_TIME: 'MMMM D, YYYY h:mm A',
    ISO: 'YYYY-MM-DD',
  };
  
  // Storage Keys
  export const STORAGE_KEYS = {
    AUTH_TOKEN: '@JobMatchApp:token',
    REFRESH_TOKEN: '@JobMatchApp:refreshToken',
    USER_DATA: '@JobMatchApp:userData',
    ONBOARDING_COMPLETE: '@JobMatchApp:onboardingComplete',
    APP_THEME: '@JobMatchApp:theme',
    APP_LANGUAGE: '@JobMatchApp:language',
    LAST_NOTIFICATION_CHECK: '@JobMatchApp:lastNotificationCheck',
  };
  
  // App Routes
  export const ROUTES = {
    // Auth Routes
    AUTH: {
      LOGIN: 'Login',
      REGISTER: 'Register',
      FORGOT_PASSWORD: 'ForgotPassword',
      RESET_PASSWORD: 'ResetPassword',
      ONBOARDING: 'Onboarding',
    },
    // Common Routes
    COMMON: {
      NOTIFICATIONS: 'Notifications',
      MESSAGES: 'Messages',
      CHAT: 'Chat',
      SETTINGS: 'Settings',
      PROFILE: 'Profile',
    },
    // Job Seeker Routes
    JOB_SEEKER: {
      HOME: 'CandidateHome',
      JOB_SEARCH: 'JobSearch',
      JOB_DETAIL: 'JobDetail',
      APPLICATIONS: 'MyApplications',
      APPLICATION_DETAIL: 'ApplicationDetail',
      PROFILE: 'CandidateProfile',
      EDIT_PROFILE: 'EditCandidateProfile',
      SAVED_JOBS: 'SavedJobs',
    },
    // Employer Routes
    EMPLOYER: {
      DASHBOARD: 'EmployerDashboard',
      POST_JOB: 'PostJob',
      EDIT_JOB: 'EditJob',
      MY_JOBS: 'MyJobs',
      JOB_APPLICATIONS: 'JobApplications',
      CANDIDATE_SEARCH: 'CandidateSearch',
      CANDIDATE_DETAIL: 'CandidateDetail',
      COMPANY_PROFILE: 'CompanyProfile',
      EDIT_COMPANY: 'EditCompanyProfile',
    },
  };
  
  export default {
    API_ENDPOINTS,
    USER_ROLES,
    JOB_TYPES,
    EXPERIENCE_LEVELS,
    APPLICATION_STATUS,
    COMPANY_SIZES,
    NOTIFICATION_TYPES,
    DATE_FORMATS,
    STORAGE_KEYS,
    ROUTES,
  };