import { APP_CONFIG, ERROR_MESSAGES } from '../config/constants.js';

// Enhanced utility functions with better error handling and validation

// Generate random username with improved randomness
export const generateRandomUsername = () => {
  const adjectives = [
    'cool', 'fast', 'smart', 'quick', 'bright', 'sharp', 'swift', 'bold',
    'clever', 'wise', 'brave', 'calm', 'eager', 'fair', 'kind', 'neat'
  ];
  const nouns = [
    'user', 'mail', 'temp', 'box', 'inbox', 'post', 'msg', 'note',
    'bird', 'star', 'moon', 'wave', 'fire', 'wind', 'rock', 'tree'
  ];
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const numbers = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `${adjective}${noun}${numbers}`;
};

// Enhanced copy to clipboard with better error handling
export const copyToClipboard = async (text) => {
  try {
    // Modern clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    
    // Fallback for older browsers or non-secure contexts
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const result = document.execCommand('copy');
      document.body.removeChild(textArea);
      return result;
    } catch (fallbackErr) {
      document.body.removeChild(textArea);
      throw fallbackErr;
    }
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
};

// Enhanced date formatting with relative time
export const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 60) {
      return diffMinutes === 1 ? '1 minute ago' : `${diffMinutes} minutes ago`;
    } else if (diffHours < 24) {
      return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Unknown date';
  }
};

// Enhanced username validation
export const validateUsername = (username) => {
  if (!username || typeof username !== 'string') {
    return false;
  }
  
  const { MIN_LENGTH, MAX_LENGTH, PATTERN } = APP_CONFIG.VALIDATION.USERNAME;
  
  return (
    username.length >= MIN_LENGTH &&
    username.length <= MAX_LENGTH &&
    PATTERN.test(username)
  );
};

// Enhanced text truncation with word boundary respect
export const truncateText = (text, maxLength) => {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  if (text.length <= maxLength) {
    return text;
  }
  
  // Try to break at word boundary
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > maxLength * 0.8) {
    return truncated.substring(0, lastSpace) + '...';
  }
  
  return truncated + '...';
};

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Sanitize HTML content for safe display
export const sanitizeHTML = (html) => {
  if (!html || typeof html !== 'string') {
    return '';
  }
  
  // Basic HTML sanitization - remove script tags and dangerous attributes
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/javascript:/gi, '');
};

// Debounce function for performance optimization
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function for performance optimization
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Generate unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Check if device is mobile
export const isMobile = () => {
  return window.innerWidth <= 768;
};

// Get browser info
export const getBrowserInfo = () => {
  const ua = navigator.userAgent;
  let browser = 'Unknown';
  
  if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Safari')) browser = 'Safari';
  else if (ua.includes('Edge')) browser = 'Edge';
  
  return {
    browser,
    userAgent: ua,
    language: navigator.language,
    platform: navigator.platform
  };
};