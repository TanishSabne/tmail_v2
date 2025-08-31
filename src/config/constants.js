// Application constants and configuration
export const APP_CONFIG = {
  NAME: 'TEMP MAIL',
  VERSION: '1.0.0',
  DESCRIPTION: 'Secure temporary email service',
  
  // API Configuration
  API: {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://alphabackend-production.up.railway.app',
    TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000
  },
  
  // Auto-refresh settings
  AUTO_REFRESH: {
    INTERVAL: 30000, // 30 seconds
    COUNTDOWN_INTERVAL: 1000, // 1 second
    DEFAULT_ENABLED: true
  },
  
  // Cookie settings
  COOKIES: {
    NAME: 'tempEmails',
    EXPIRY_DAYS: 7,
    MAX_EMAILS: 10
  },
  
  // UI Settings
  UI: {
    MAX_EMAIL_DISPLAY_LENGTH: 30,
    MAX_SUBJECT_DISPLAY_LENGTH: 40,
    TOAST_DURATION: 3000,
    LOADING_DEBOUNCE: 300
  },
  
  // Validation rules
  VALIDATION: {
    USERNAME: {
      MIN_LENGTH: 3,
      MAX_LENGTH: 20,
      PATTERN: /^[a-z][a-z0-9]{2,19}$/
    }
  }
};

// Environment-specific settings
export const ENV = {
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  apiUrl: import.meta.env.VITE_API_BASE_URL
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection failed. Please check your internet connection.',
  API_ERROR: 'Service temporarily unavailable. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  CLIPBOARD_ERROR: 'Failed to copy to clipboard. Please try manually.',
  STORAGE_ERROR: 'Failed to save data. Please check your browser settings.',
  RATE_LIMIT_ERROR: 'Too many requests. Please wait a moment and try again.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.'
};

// Success messages
export const SUCCESS_MESSAGES = {
  EMAIL_GENERATED: 'Email address generated successfully!',
  EMAIL_COPIED: 'Email copied to clipboard!',
  EMAIL_DELETED: 'Email deleted successfully!',
  EMAILS_CLEARED: 'All emails cleared successfully!',
  EMAILS_REFRESHED: 'Emails refreshed successfully!'
};