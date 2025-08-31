import { APP_CONFIG, ERROR_MESSAGES } from '../config/constants.js';

// Enhanced cookie management utilities with error handling and validation
export const COOKIE_NAME = APP_CONFIG.COOKIES.NAME;
export const COOKIE_EXPIRY_DAYS = APP_CONFIG.COOKIES.EXPIRY_DAYS;
export const MAX_EMAILS = APP_CONFIG.COOKIES.MAX_EMAILS;

export const setCookie = (name, value, days) => {
  try {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    
    const cookieValue = JSON.stringify(value);
    
    // Check if cookie size is reasonable (browsers typically limit to 4KB)
    if (cookieValue.length > 4000) {
      console.warn('Cookie size is large, may be truncated by browser');
    }
    
    document.cookie = `${name}=${cookieValue};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
    return true;
  } catch (error) {
    console.error('Failed to set cookie:', error);
    return false;
  }
};

export const getCookie = (name) => {
  try {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      
      if (c.indexOf(nameEQ) === 0) {
        const cookieValue = c.substring(nameEQ.length, c.length);
        return JSON.parse(cookieValue);
      }
    }
    return null;
  } catch (error) {
    console.error('Failed to get cookie:', error);
    return null;
  }
};

export const deleteCookie = (name) => {
  try {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Strict`;
    return true;
  } catch (error) {
    console.error('Failed to delete cookie:', error);
    return false;
  }
};

export const saveEmailsToCookie = (emails) => {
  try {
    // Limit the number of emails to prevent cookie overflow
    const limitedEmails = emails.slice(-MAX_EMAILS);
    
    // Clean up old emails (older than expiry days)
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - COOKIE_EXPIRY_DAYS);
    
    const validEmails = limitedEmails.filter(email => {
      const emailDate = new Date(email.timestamp);
      return emailDate > cutoffDate;
    });
    
    return setCookie(COOKIE_NAME, validEmails, COOKIE_EXPIRY_DAYS);
  } catch (error) {
    console.error('Failed to save emails to cookie:', error);
    throw new Error(ERROR_MESSAGES.STORAGE_ERROR);
  }
};

export const getEmailsFromCookie = () => {
  try {
    const emails = getCookie(COOKIE_NAME) || [];
    
    // Validate email structure
    return emails.filter(email => 
      email && 
      typeof email === 'object' && 
      email.email && 
      email.timestamp
    );
  } catch (error) {
    console.error('Failed to get emails from cookie:', error);
    return [];
  }
};

export const clearAllEmails = () => {
  try {
    return deleteCookie(COOKIE_NAME);
  } catch (error) {
    console.error('Failed to clear emails:', error);
    throw new Error(ERROR_MESSAGES.STORAGE_ERROR);
  }
};

// Check if cookies are enabled
export const areCookiesEnabled = () => {
  try {
    const testCookie = 'test_cookie';
    setCookie(testCookie, 'test', 1);
    const result = getCookie(testCookie) === 'test';
    deleteCookie(testCookie);
    return result;
  } catch (error) {
    return false;
  }
};

// Get cookie storage usage (approximate)
export const getCookieStorageUsage = () => {
  try {
    const emails = getEmailsFromCookie();
    const cookieSize = JSON.stringify(emails).length;
    return {
      size: cookieSize,
      percentage: (cookieSize / 4000) * 100, // Approximate browser limit
      emailCount: emails.length
    };
  } catch (error) {
    return { size: 0, percentage: 0, emailCount: 0 };
  }
};