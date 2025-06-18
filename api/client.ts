/**
 * API Client for Madinah Arabic Learning App
 * Base URL: https://madinah.arabic.aramb.dev/api
 */

const BASE_URL = 'https://madinah.arabic.aramb.dev/api';

// Types based on the API specification
export interface Book {
  id: string;
  title: string;
  description?: string;
  lessons?: Lesson[];
}

export interface LessonContentItem {
  arabic?: string;
  translation?: string;
}

export interface Lesson {
  id: string;
  bookId: string;
  title: string;
  description?: string; // Added description
  content?: string | LessonContentItem[]; // Made content more flexible
  rules?: Rule[];
}

export interface Rule {
  id: string;
  content: string;
  type?: string;
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

// Generic fetch function with error handling
async function apiRequest<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
}

// Books API
export const getBooks = (): Promise<Book[]> => {
  return apiRequest<Book[]>('/books');
};

export const getBookById = (bookId: string): Promise<Book> => {
  return apiRequest<Book>(`/books/${bookId}`);
};

export const getBookLessons = (bookId: string): Promise<Lesson[]> => {
  return apiRequest<Lesson[]>(`/books/${bookId}/lessons`);
};

export const getBookLesson = (bookId: string, lessonId: string): Promise<Lesson> => {
  return apiRequest<Lesson>(`/books/${bookId}/lessons/${lessonId}`);
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

// Export all API functions as a single object for easier imports
export const api = {
  // Books
  getBooks,
  getBookById,
  getBookLessons,
  getBookLesson,
  
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