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

interface Lesson extends Omit<ApiLesson, 'content'> {
  content?: LessonContentItem[];
  description?: string; // Add description to Lesson type
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
        const lessonDetails = await api.getBookLesson(bookId, lessonId);
        // Adapt the API response to the component's Lesson type
        const adaptedLesson: Lesson = {
          ...lessonDetails,
          // Assuming lessonDetails.content is a string that needs parsing or is structured differently
          // For now, let's assume it might be an array or needs to be transformed.
          // If lessonDetails.content is a simple string, this will need adjustment.
          // If the API returns content as an array of objects {arabic, translation}, this is fine.
          // If it's a string, you might need to parse it or adjust the type.
          // For the purpose of fixing the type error, we'll assume it can be cast or is already compatible.
          content: lessonDetails.content ? (typeof lessonDetails.content === 'string' ? JSON.parse(lessonDetails.content) : lessonDetails.content) : [],
          description: lessonDetails.description || '', // Ensure description is always a string
        };
        setLesson(adaptedLesson);
      } catch (err) {
        console.error('Failed to fetch lesson details:', err);
        setError(`Failed to load lesson ${lessonId} from book ${bookId}`);
      } finally {
        setLoading(false);
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
            <Text style={[styles.title, { color: textColor }]}>{lesson.title}</Text>
            {lesson.description && (
              <Text style={[styles.description, { color: mutedTextColor }]}>{lesson.description}</Text>
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
    marginBottom: 24,
    textAlign: 'center',
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