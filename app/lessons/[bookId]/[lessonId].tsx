import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { api, Lesson as ApiLesson } from '@/api/client'; // Assuming Lesson type includes content
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from '@/components/ThemedText';

// Define a more specific Lesson type for the component's needs
interface LessonContentItem {
  arabic?: string;
  translation?: string;
}

interface Rule {
  id: string;
  content: string;
  type?: string;
}

interface Lesson extends Omit<ApiLesson, 'content' | 'rules'> { // Exclude rules as well if it's handled separately
  content?: LessonContentItem[];
  description?: string; 
  introduction?: ApiLesson['introduction']; // Align with ApiLesson's LocalizedString or undefined
  rules?: Rule[]; // Add rules
}

export default function LessonDetailScreen() {
  const { bookId, lessonId } = useLocalSearchParams<{ bookId: string; lessonId: string }>();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Moved useThemeColor calls to the top level
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const mutedTextColor = useThemeColor({}, 'muted');
  const cardBackgroundColor = useThemeColor({}, 'card');
  const separatorColor = useThemeColor({}, 'border');

  useEffect(() => {
    if (!bookId || !lessonId) return;

    const fetchLessonDetails = async () => {
      try {
        setLoading(true);
        const apiResponse = await api.getBookLesson(bookId, lessonId);
        console.log('[LessonDetailScreen] Received apiResponse for lesson details:', JSON.stringify(apiResponse, null, 2));

        if (apiResponse && apiResponse.success && apiResponse.data) {
          const lessonData = apiResponse.data;
          // Adapt the API response to the component's Lesson type
          const adaptedLesson: Lesson = {
            ...lessonData,
            // Process content: if it's a string, parse it; otherwise, use as is or default to empty array
            content: lessonData.content
              ? typeof lessonData.content === 'string'
                ? JSON.parse(lessonData.content)
                : Array.isArray(lessonData.content) ? lessonData.content : []
              : [],
            description: lessonData.description || '', // Ensure description is always a string
          };
          setLesson(adaptedLesson);
          console.log('[LessonDetailScreen] Adapted lesson set:', JSON.stringify(adaptedLesson, null, 2));
        } else {
          console.error('[LessonDetailScreen] Failed to fetch lesson details or data is missing in response:', apiResponse);
          setError(`Failed to load details for lesson ${lessonId} from book ${bookId}.`);
          setLesson(null);
        }
      } catch (err) {
        console.error('[LessonDetailScreen] Error in fetchLessonDetails:', err);
        setError(`Failed to load lesson ${lessonId} from book ${bookId}.`);
        setLesson(null);
      } finally {
        setLoading(false);
        console.log('[LessonDetailScreen] fetchLessonDetails finished.');
      }
    };

    fetchLessonDetails();
  }, [bookId, lessonId]);

  if (loading) {
    return (
      <View style={[styles.container, styles.centeredContent]}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>Loading lesson content...</ThemedText>
      </View>
    );
  }

  if (error || !lesson) {
    return (
      <View style={[styles.container, styles.centeredContent]}>
        <ThemedText style={styles.errorText}>{error || 'Lesson not found.'}</ThemedText>
      </View>
    );
  }

  // useThemeColor calls moved to top

  return (
    <ScrollView style={[styles.scrollContainer, { backgroundColor }]}>
      <View style={styles.container}>
        {lesson && (
          <>
            <Text style={[styles.title, { color: textColor }]}>{
              typeof lesson.title === 'object' && lesson.title.en 
                ? lesson.title.en 
                : typeof lesson.title === 'string' 
                  ? lesson.title 
                  : 'Lesson Title Unavailable'
            }</Text>
            {lesson.introduction && (
              <Text style={[styles.description, { color: mutedTextColor }]}>{
                typeof lesson.introduction === 'object' && lesson.introduction.en 
                ? lesson.introduction.en 
                : typeof lesson.introduction === 'string' 
                  ? lesson.introduction 
                  : ''
              }</Text>
            )}
            {lesson.description && (
              <Text style={[styles.description, { color: mutedTextColor }]}>{lesson.description}</Text>
            )}
            
            {lesson.rules && Array.isArray(lesson.rules) && lesson.rules.length > 0 && (
              <View style={styles.rulesContainer}>
                <ThemedText type="subtitle" style={[styles.rulesTitle, { color: textColor }]}>Rules:</ThemedText>
                {lesson.rules.map((rule, index) => (
                  <View key={`rule-${index}`} style={[styles.contentItem, { backgroundColor: cardBackgroundColor }]}>
                    <Text style={[styles.translationText, { color: textColor }]}>{rule.content}</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={[styles.separator, { backgroundColor: separatorColor }]} />

            {lesson.content && Array.isArray(lesson.content) && lesson.content.length > 0 ? (
              lesson.content.map((item: LessonContentItem, index: number) => (
                <View key={index} style={[styles.contentItem, { backgroundColor: cardBackgroundColor }]}>
                  {item.arabic && (
                    <ThemedText type="arabic" style={[styles.arabicText, { color: textColor }]}>
                      {item.arabic}
                    </ThemedText>
                  )}
                  {item.translation && (
                    <Text style={[styles.translationText, { color: mutedTextColor }]}>
                      {item.translation}
                    </Text>
                  )}
                </View>
              ))
            ) : (
              <Text style={[styles.noDataText, { color: mutedTextColor }]}>No content available for this lesson.</Text>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 24,
  },
  centeredContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    marginBottom: 16, // Adjusted margin
    textAlign: 'center',
  },
  rulesContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
  rulesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  separator: {
    marginVertical: 24,
    height: 1,
    width: '100%',
  },
  contentItem: {
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
  },
  arabicText: {
    fontSize: 22, // Adjusted for Arabic font
    lineHeight: 36, // Adjusted for Arabic font readability
    textAlign: 'right', // Standard for Arabic text
    marginBottom: 8,
  },
  translationText: {
    fontSize: 15,
    fontStyle: 'italic',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 24,
  },
});