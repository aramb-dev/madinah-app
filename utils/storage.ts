/**
 * Storage utility with improved error handling and user feedback
 * Wraps AsyncStorage with type-safe operations and graceful degradation
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import logger from './logger';

export interface StorageError {
  key: string;
  operation: 'read' | 'write' | 'remove';
  error: Error;
}

// Storage error callback - can be set by app to show custom UI
let errorCallback: ((error: StorageError) => void) | null = null;

export const setStorageErrorCallback = (callback: (error: StorageError) => void) => {
  errorCallback = callback;
};

/**
 * Safely get an item from storage
 * Returns null if not found or on error
 */
export const getItem = async <T = string>(
  key: string,
  options: {
    defaultValue?: T;
    parse?: boolean;
    showAlert?: boolean;
  } = {}
): Promise<T | null> => {
  try {
    const value = await AsyncStorage.getItem(key);

    if (value === null) {
      return options.defaultValue ?? null;
    }

    if (options.parse) {
      try {
        return JSON.parse(value) as T;
      } catch (parseError) {
        logger.error(`Failed to parse stored value for key: ${key}`);
        return options.defaultValue ?? null;
      }
    }

    return value as T;
  } catch (error) {
    const storageError: StorageError = {
      key,
      operation: 'read',
      error: error as Error,
    };

    logger.error(`Failed to read from storage: ${key}`, error);

    if (errorCallback) {
      errorCallback(storageError);
    } else if (options.showAlert) {
      Alert.alert(
        'Storage Error',
        'Failed to load your settings. Default settings will be used.',
        [{ text: 'OK' }]
      );
    }

    return options.defaultValue ?? null;
  }
};

/**
 * Safely set an item in storage
 * Returns true on success, false on failure
 */
export const setItem = async <T = string>(
  key: string,
  value: T,
  options: {
    stringify?: boolean;
    showAlert?: boolean;
  } = {}
): Promise<boolean> => {
  try {
    const valueToStore = options.stringify
      ? JSON.stringify(value)
      : String(value);

    await AsyncStorage.setItem(key, valueToStore);
    return true;
  } catch (error) {
    const storageError: StorageError = {
      key,
      operation: 'write',
      error: error as Error,
    };

    logger.error(`Failed to write to storage: ${key}`, error);

    if (errorCallback) {
      errorCallback(storageError);
    } else if (options.showAlert) {
      Alert.alert(
        'Storage Error',
        'Failed to save your settings. Your changes may not persist.',
        [{ text: 'OK' }]
      );
    }

    return false;
  }
};

/**
 * Safely remove an item from storage
 * Returns true on success, false on failure
 */
export const removeItem = async (
  key: string,
  options: {
    showAlert?: boolean;
  } = {}
): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    const storageError: StorageError = {
      key,
      operation: 'remove',
      error: error as Error,
    };

    logger.error(`Failed to remove from storage: ${key}`, error);

    if (errorCallback) {
      errorCallback(storageError);
    } else if (options.showAlert) {
      Alert.alert(
        'Storage Error',
        'Failed to remove stored data.',
        [{ text: 'OK' }]
      );
    }

    return false;
  }
};

/**
 * Clear all storage (use with caution)
 */
export const clearAll = async (options: { showAlert?: boolean } = {}): Promise<boolean> => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    logger.error('Failed to clear storage', error);

    if (options.showAlert) {
      Alert.alert(
        'Storage Error',
        'Failed to clear stored data.',
        [{ text: 'OK' }]
      );
    }

    return false;
  }
};

/**
 * Get multiple items at once
 */
export const getMultiple = async (
  keys: string[],
  options: { showAlert?: boolean } = {}
): Promise<Record<string, string | null>> => {
  try {
    const keyValuePairs = await AsyncStorage.multiGet(keys);
    return Object.fromEntries(keyValuePairs);
  } catch (error) {
    logger.error('Failed to get multiple items from storage', error);

    if (options.showAlert) {
      Alert.alert(
        'Storage Error',
        'Failed to load your settings.',
        [{ text: 'OK' }]
      );
    }

    return Object.fromEntries(keys.map(key => [key, null]));
  }
};

/**
 * Set multiple items at once
 */
export const setMultiple = async (
  keyValuePairs: [string, string][],
  options: { showAlert?: boolean } = {}
): Promise<boolean> => {
  try {
    await AsyncStorage.multiSet(keyValuePairs);
    return true;
  } catch (error) {
    logger.error('Failed to set multiple items in storage', error);

    if (options.showAlert) {
      Alert.alert(
        'Storage Error',
        'Failed to save your settings.',
        [{ text: 'OK' }]
      );
    }

    return false;
  }
};

export default {
  getItem,
  setItem,
  removeItem,
  clearAll,
  getMultiple,
  setMultiple,
  setStorageErrorCallback,
};
