/**
 * Logger utility for environment-aware logging
 * Only logs in development mode to prevent information disclosure in production
 */

const isDevelopment = __DEV__;

export const logger = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },

  error: (...args: any[]) => {
    // Always log errors, but sanitize in production
    if (isDevelopment) {
      console.error(...args);
    } else {
      // In production, only log the error type, not sensitive details
      console.error('An error occurred. Please check your connection and try again.');
    }
  },

  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },

  // API-specific logging with security considerations
  api: {
    request: (endpoint: string) => {
      if (isDevelopment) {
        console.log(`[API] Request: ${endpoint}`);
      }
    },

    response: (endpoint: string, status: number) => {
      if (isDevelopment) {
        console.log(`[API] Response: ${endpoint} - Status: ${status}`);
      }
    },

    error: (endpoint: string, error: any) => {
      if (isDevelopment) {
        console.error(`[API] Error for ${endpoint}:`, error);
      } else {
        console.error(`[API] Request failed`);
      }
    },

    // Only log response data in development
    data: (endpoint: string, data: any) => {
      if (isDevelopment) {
        console.log(`[API] Data for ${endpoint}:`, data);
      }
    }
  }
};

export default logger;
