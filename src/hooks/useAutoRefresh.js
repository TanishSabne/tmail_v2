import { useState, useEffect, useCallback, useRef } from 'react';
import { APP_CONFIG } from '../config/constants.js';

// Custom hook for auto-refresh functionality
export const useAutoRefresh = (refreshCallback, dependencies = []) => {
  const [isEnabled, setIsEnabled] = useState(APP_CONFIG.AUTO_REFRESH.DEFAULT_ENABLED);
  const [countdown, setCountdown] = useState(APP_CONFIG.AUTO_REFRESH.INTERVAL / 1000);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const intervalRef = useRef(null);
  const countdownRef = useRef(null);
  const refreshCallbackRef = useRef(refreshCallback);

  // Update callback ref when it changes
  useEffect(() => {
    refreshCallbackRef.current = refreshCallback;
  }, [refreshCallback]);

  // Auto-refresh logic
  useEffect(() => {
    if (!isEnabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
      return;
    }

    // Countdown timer
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          return APP_CONFIG.AUTO_REFRESH.INTERVAL / 1000;
        }
        return prev - 1;
      });
    }, APP_CONFIG.AUTO_REFRESH.COUNTDOWN_INTERVAL);

    // Auto-refresh timer
    intervalRef.current = setInterval(async () => {
      if (!isRefreshing) {
        setIsRefreshing(true);
        try {
          await refreshCallbackRef.current(true); // Silent refresh
        } catch (error) {
          console.error('Auto-refresh failed:', error);
        } finally {
          setIsRefreshing(false);
        }
      }
    }, APP_CONFIG.AUTO_REFRESH.INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, [isEnabled, isRefreshing, ...dependencies]);

  // Reset countdown when enabled state changes
  useEffect(() => {
    setCountdown(APP_CONFIG.AUTO_REFRESH.INTERVAL / 1000);
  }, [isEnabled]);

  const toggle = useCallback(() => {
    setIsEnabled(prev => !prev);
  }, []);

  const reset = useCallback(() => {
    setCountdown(APP_CONFIG.AUTO_REFRESH.INTERVAL / 1000);
  }, []);

  const manualRefresh = useCallback(async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await refreshCallbackRef.current(false); // Manual refresh with feedback
      reset();
    } catch (error) {
      console.error('Manual refresh failed:', error);
      throw error;
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing, reset]);

  return {
    isEnabled,
    countdown,
    isRefreshing,
    toggle,
    reset,
    manualRefresh
  };
};