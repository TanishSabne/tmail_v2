import api from '../config/api.js';
import { APP_CONFIG, ERROR_MESSAGES } from '../config/constants.js';

// Enhanced API service with retry logic and better error handling
class EmailAPIService {
  constructor() {
    this.retryAttempts = APP_CONFIG.API.RETRY_ATTEMPTS;
    this.retryDelay = APP_CONFIG.API.RETRY_DELAY;
  }

  // Retry wrapper for API calls
  async withRetry(apiCall, attempts = this.retryAttempts) {
    try {
      return await apiCall();
    } catch (error) {
      if (attempts > 1 && this.isRetryableError(error)) {
        await this.delay(this.retryDelay);
        return this.withRetry(apiCall, attempts - 1);
      }
      throw this.handleError(error);
    }
  }

  // Check if error is retryable
  isRetryableError(error) {
    const retryableStatuses = [408, 429, 500, 502, 503, 504];
    return (
      !error.response || 
      retryableStatuses.includes(error.response.status) ||
      error.code === 'NETWORK_ERROR' ||
      error.code === 'ECONNABORTED'
    );
  }

  // Delay utility for retry logic
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Enhanced error handling
  handleError(error) {
    if (!error.response) {
      // Network error
      if (error.code === 'ECONNABORTED') {
        throw new Error(ERROR_MESSAGES.TIMEOUT_ERROR);
      }
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    }

    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        throw new Error(data?.msg || ERROR_MESSAGES.VALIDATION_ERROR);
      case 404:
        throw new Error(data?.msg || 'Resource not found');
      case 429:
        throw new Error(ERROR_MESSAGES.RATE_LIMIT_ERROR);
      case 500:
      case 502:
      case 503:
      case 504:
        throw new Error(ERROR_MESSAGES.API_ERROR);
      default:
        throw new Error(data?.msg || ERROR_MESSAGES.UNKNOWN_ERROR);
    }
  }

  // Generate a new temporary email address
  async generateEmail(username, domain) {
    return this.withRetry(async () => {
      const response = await api.post('/address/generate', {
        username,
        domain
      });
      return response.data;
    });
  }

  // Get available domains
  async getDomains() {
    return this.withRetry(async () => {
      const response = await api.get('/domains');
      return response.data;
    });
  }

  // Get email envelopes for a specific email address
  async getEnvelopes(email) {
    return this.withRetry(async () => {
      const response = await api.get(`/getEnvelopes/${encodeURIComponent(email)}`);
      return response.data;
    });
  }

  // Get full email content
  async getEmailContent(uid, email) {
    return this.withRetry(async () => {
      const response = await api.get(`/email/${uid}/content`, {
        params: { email }
      });
      return response.data;
    });
  }

  // Get email attachments
  async getAttachments(uid, email) {
    return this.withRetry(async () => {
      const response = await api.get(`/getAttachments/${uid}`, {
        params: { email }
      });
      return response.data;
    });
  }

  // Health check
  async healthCheck() {
    return this.withRetry(async () => {
      const response = await api.get('/');
      return response.data;
    });
  }
}

export const emailAPI = new EmailAPIService();