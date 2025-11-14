/**
 * API Client for Madinah Arabic Learning App
 */

import logger from '@/utils/logger';
import { z } from 'zod';
import {
  ApiResponseSchema,
  BookSchema,
  LessonSchema,
  LessonTitleSchema,
  MetadataSchema,
  RuleCountSchema,
  validateResponse,
} from './schemas';
import { API_BASE_URL, API_TIMEOUT } from '@/config/env';

const BASE_URL = API_BASE_URL;

// Types based on the API specification
export interface LocalizedString {
  ar: string;
  en: string;
}

export interface Vocabulary {
  id: string;
  bookId: string;
  lessonId: string;
  arabic: string;
  english: string;
}

export interface Book {
  id: string;
  title: LocalizedString;
  description?: LocalizedString;
  lessons?: Lesson[];
  available?: boolean; // Added based on log: "available": true
  comingSoon?: boolean; // Added based on log: "comingSoon": false
}

export interface LessonContentItem {
  arabic?: string;
  translation?: string;
}

export interface Lesson {
  id: string;
  bookId: string;
  title: LocalizedString; // Updated to LocalizedString
  introduction?: LocalizedString; // Added based on log: "introduction":{"arabic":"هَ
  description?: string; // Kept as string, or could be LocalizedString if API supports
  content?: string | LessonContentItem[]; // Made content more flexible
  rules?: Rule[];
}

export interface Rule {
  name: string; // Updated based on logs
  arabicText: string; // Updated based on logs
  explanation: string; // Updated based on logs
  id?: string; // Optional, as not present in all log examples for rules
  type?: string; // Optional
}

export interface Metadata {
  books: Book[];
  totalLessons: number;
  lastUpdated: string;
}

export interface ChangelogEntry {
  version: string;
  date: string;
  changes: string[];
}

export interface LessonTitle {
  id: string;
  title: string;
  bookId: string;
}

export interface RuleCount {
  bookId: string;
  totalRules: number;
  rulesByType: Record<string, number>;
}

// Fetch with timeout helper
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout: number = API_TIMEOUT): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}

// Generic fetch function with error handling
export async function apiRequest<T>(endpoint: string): Promise<T> {
  try {
    logger.api.request(endpoint);
    const response = await fetchWithTimeout(`${BASE_URL}${endpoint}`);

    if (!response.ok) {
      logger.api.error(endpoint, `Status ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    logger.api.response(endpoint, response.status);
    logger.api.data(endpoint, data);

    return data;
  } catch (error) {
    if (error instanceof SyntaxError) {
      // JSON parsing error
      logger.api.error(endpoint, 'Invalid JSON response');
      throw new Error('Invalid response format from server');
    }
    logger.api.error(endpoint, error);
    throw error;
  }
}

// Define a type for the API response structure
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number; // Optional count property seen in logs
}

// Books API
export const getBooks = async (): Promise<Book[]> => {
  const rawResponse = await apiRequest<unknown>('/books');
  const response = validateResponse(
    ApiResponseSchema(z.array(BookSchema)),
    rawResponse,
    'getBooks'
  );
  return response.data;
};

export const getBookById = (bookId: string): Promise<ApiResponse<Book>> => {
  return apiRequest<ApiResponse<Book>>(`/books/${bookId}`);
};

export const getBookLessons = async (bookId: string): Promise<Lesson[]> => {
  const rawResponse = await apiRequest<unknown>(`/books/${bookId}/lessons`);
  const response = validateResponse(
    ApiResponseSchema(z.array(LessonSchema)),
    rawResponse,
    `getBookLessons(${bookId})`
  );
  return response.data;
};

export const getBookLesson = (bookId: string, lessonId: string): Promise<ApiResponse<Lesson>> => {
  return apiRequest<ApiResponse<Lesson>>(`/books/${bookId}/lessons/${lessonId}`);
};

// Lessons API
export const getAllLessons = (): Promise<Lesson[]> => {
  return apiRequest<Lesson[]>('/lessons');
};

export const getAllLessonTitles = (): Promise<LessonTitle[]> => {
  return apiRequest<LessonTitle[]>('/lesson-titles');
};

// Metadata & App Info API
export const getMetadata = (): Promise<Metadata> => {
  return apiRequest<Metadata>('/metadata');
};


export const getBookMetadata = (bookId: string): Promise<Metadata> => {
  return apiRequest<Metadata>(`/books/${bookId}/metadata`);
};

export const getBookLessonTitles = (bookId: string): Promise<LessonTitle[]> => {
  return apiRequest<LessonTitle[]>(`/books/${bookId}/lesson-titles`);
};

export const getBookRuleCount = (bookId: string): Promise<RuleCount> => {
  return apiRequest<RuleCount>(`/books/${bookId}/rule-count`);
};

import {
  getVocabulary,
} from './vocabulary';

// Export all API functions as a single object for easier imports
export const api = {
  // Books
  getBooks,
  getBookById,
  getBookLessons,
  getBookLesson,

  // Vocabulary
  getVocabulary,

  // Lessons
  getAllLessons,
  getAllLessonTitles,

  // Metadata & App Info
  getMetadata,
  getBookMetadata,
  getBookLessonTitles,
  getBookRuleCount,
};

export default api;