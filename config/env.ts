/**
 * Environment configuration with validation
 * Centralized configuration management for the app
 */

import { z } from 'zod';
import logger from '@/utils/logger';

// Define the schema for environment variables
const EnvSchema = z.object({
  API_BASE_URL: z.string().url('API_BASE_URL must be a valid URL'),
  API_TIMEOUT: z.number().positive().default(30000), // 30 seconds
  ENABLE_API_LOGGING: z.boolean().default(__DEV__),
  APP_ENV: z.enum(['development', 'staging', 'production']).default(
    __DEV__ ? 'development' : 'production'
  ),
});

type EnvConfig = z.infer<typeof EnvSchema>;

// Default configuration
const defaultConfig: EnvConfig = {
  API_BASE_URL: 'https://madinah.arabic.aramb.dev/api',
  API_TIMEOUT: 30000,
  ENABLE_API_LOGGING: __DEV__,
  APP_ENV: __DEV__ ? 'development' : 'production',
};

/**
 * Load and validate environment configuration
 * Falls back to defaults if validation fails
 */
function loadConfig(): EnvConfig {
  try {
    // In a real app, you might load from expo-constants or process.env
    // For now, we use the defaults
    const rawConfig = {
      API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || defaultConfig.API_BASE_URL,
      API_TIMEOUT: process.env.EXPO_PUBLIC_API_TIMEOUT
        ? parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT, 10)
        : defaultConfig.API_TIMEOUT,
      ENABLE_API_LOGGING: process.env.EXPO_PUBLIC_ENABLE_API_LOGGING === 'true'
        ? true
        : defaultConfig.ENABLE_API_LOGGING,
      APP_ENV: (process.env.EXPO_PUBLIC_APP_ENV || defaultConfig.APP_ENV) as EnvConfig['APP_ENV'],
    };

    const config = EnvSchema.parse(rawConfig);
    logger.log('Environment configuration loaded successfully');
    return config;
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.error('Environment configuration validation failed:', error.errors);
      logger.warn('Using default configuration');
    } else {
      logger.error('Failed to load environment configuration:', error);
    }
    return defaultConfig;
  }
}

// Export validated configuration
export const config = loadConfig();

// Export individual values for convenience
export const {
  API_BASE_URL,
  API_TIMEOUT,
  ENABLE_API_LOGGING,
  APP_ENV,
} = config;

// Helper to check environment
export const isDevelopment = APP_ENV === 'development';
export const isStaging = APP_ENV === 'staging';
export const isProduction = APP_ENV === 'production';

export default config;
