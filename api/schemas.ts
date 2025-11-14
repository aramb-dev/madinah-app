/**
 * Zod schemas for API response validation
 * Provides runtime type checking and validation for API data
 */

import { z } from 'zod';

// Base schemas
export const LocalizedStringSchema = z.object({
  ar: z.string(),
  en: z.string(),
});

export const RuleSchema = z.object({
  name: z.string(),
  arabicText: z.string(),
  explanation: z.string(),
  id: z.string().optional(),
  type: z.string().optional(),
});

export const LessonContentItemSchema = z.object({
  arabic: z.string().optional(),
  translation: z.string().optional(),
});

export const LessonSchema = z.object({
  id: z.string(),
  bookId: z.string(),
  title: LocalizedStringSchema,
  introduction: LocalizedStringSchema.optional(),
  description: z.string().optional(),
  content: z.union([z.string(), z.array(LessonContentItemSchema)]).optional(),
  rules: z.array(RuleSchema).optional(),
});

export const BookSchema = z.object({
  id: z.string(),
  title: LocalizedStringSchema,
  description: LocalizedStringSchema.optional(),
  lessons: z.array(LessonSchema).optional(),
  available: z.boolean().optional(),
  comingSoon: z.boolean().optional(),
});

export const VocabularySchema = z.object({
  id: z.string(),
  bookId: z.string(),
  lessonId: z.string(),
  word: z.string(),
  translation: z.object({
    en: z.string(),
  }),
});

export const LessonTitleSchema = z.object({
  id: z.string(),
  title: z.string(),
  bookId: z.string(),
});

export const RuleCountSchema = z.object({
  bookId: z.string(),
  totalRules: z.number(),
  rulesByType: z.record(z.string(), z.number()),
});

export const MetadataSchema = z.object({
  books: z.array(BookSchema),
  totalLessons: z.number(),
  lastUpdated: z.string(),
});

// Generic API response wrapper
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema,
    count: z.number().optional(),
  });

// Helper function to safely validate and parse data
export function validateResponse<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  context: string
): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      throw new Error(`API validation error for ${context}: ${errorMessages}`);
    }
    throw error;
  }
}
