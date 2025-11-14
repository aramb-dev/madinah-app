import { apiRequest, ApiResponse, LocalizedString } from './client';
import logger from '@/utils/logger';

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
  bookId?: string,
  lessonId?: string
): Promise<Vocabulary[]> => {
  let endpoint = '/vocabulary';

  if (bookId && lessonId) {
    endpoint = `/books/${bookId}/lessons/${lessonId}/vocabulary`;
  } else if (bookId) {
    endpoint = `/books/${bookId}/vocabulary`;
  }

  const response = await apiRequest<ApiResponse<Vocabulary[]>>(endpoint);
  if (response && response.success && Array.isArray(response.data)) {
    return response.data;
  }
  logger.error('Unexpected response structure for getVocabulary');
  return [];
};