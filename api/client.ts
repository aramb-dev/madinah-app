/**
 * API Client for Madinah Arabic Learning App
 * Base URL: https://madinah.arabic.aramb.dev/api
 */

const BASE_URL = 'https://madinah.arabic.aramb.dev/api';

// Types based on the API specification
export interface LocalizedString {
  ar: string;
  en: string;
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
      console.error(`API request error for ${endpoint}: Status ${response.status}`);
      const errorText = await response.text();
      console.error(`API request error text for ${endpoint}:`, errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Log the raw response text before parsing
    const responseText = await response.text();
    console.log(`Raw response for ${endpoint}:`, responseText.substring(0, 500)); // Log first 500 chars

    try {
      const data = JSON.parse(responseText); // Parse the logged text
      console.log(`Parsed data for ${endpoint}:`, data);
      return data;
    } catch (parseError) {
      console.error(`Failed to parse JSON for ${endpoint}:`, parseError);
      console.error(`Response text that failed to parse for ${endpoint}:`, responseText.substring(0, 1000)); // Log more if parse fails
      throw parseError; // Re-throw the parsing error
    }
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
}

// Define a type for the API response structure
interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number; // Optional count property seen in logs
}

// Books API
export const getBooks = async (): Promise<Book[]> => {
  const response = await apiRequest<ApiResponse<Book[]>>('/books');
  if (response && response.success && Array.isArray(response.data)) {
    return response.data;
  }
  // Log an error or return an empty array if the structure is not as expected
  console.error('Unexpected response structure for getBooks:', response);
  return [];
};

export const getBookById = (bookId: string): Promise<ApiResponse<Book>> => {
  return apiRequest<ApiResponse<Book>>(`/books/${bookId}`);
};

export const getBookLessons = async (bookId: string): Promise<Lesson[]> => {
  const response = await apiRequest<ApiResponse<Lesson[]>>(`/books/${bookId}/lessons`);
  if (response && response.success && Array.isArray(response.data)) {
    return response.data;
  }
  console.error(`Unexpected response structure for getBookLessons (bookId: ${bookId}):`, response);
  return []; // Return empty array on unexpected structure or error
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