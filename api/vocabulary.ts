import { apiRequest, ApiResponse, LocalizedString } from './client';

export interface Vocabulary {
  id: string;
  bookId: string;
  lessonId: string;
  word: string;
  translation: {
    en: string;
  };
}

export const getVocabulary = async (
  book?: string,
  lesson?: string
): Promise<Vocabulary[]> => {
  let endpoint = '/vocabulary';
  const params = new URLSearchParams();
  if (book) {
    params.append('book', book);
  }
  if (lesson) {
    params.append('lesson', lesson);
  }
  if (params.toString()) {
    endpoint += `?${params.toString()}`;
  }

  const response = await apiRequest<ApiResponse<Vocabulary[]>>(endpoint);
  if (response && response.success && Array.isArray(response.data)) {
    return response.data;
  }
  console.error('Unexpected response structure for getVocabulary:', response);
  return [];
};

export const getBookVocabulary = async (
  bookId: string
): Promise<Vocabulary[]> => {
  const response = await apiRequest<ApiResponse<Vocabulary[]>>(
    `/books/${bookId}/vocabulary`
  );
  if (response && response.success && Array.isArray(response.data)) {
    return response.data;
  }
  console.error(
    `Unexpected response structure for getBookVocabulary (bookId: ${bookId}):`,
    response
  );
  return [];
};

export const getLessonVocabulary = async (
  bookId: string,
  lessonId: string
): Promise<Vocabulary[]> => {
  const response = await apiRequest<ApiResponse<Vocabulary[]>>(
    `/books/${bookId}/lessons/${lessonId}/vocabulary`
  );
  if (response && response.success && Array.isArray(response.data)) {
    return response.data;
  }
  console.error(
    `Unexpected response structure for getLessonVocabulary (bookId: ${bookId}, lessonId: ${lessonId}):`,
    response
  );
  return [];
};