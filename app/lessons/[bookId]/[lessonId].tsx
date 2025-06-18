import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { api, Lesson } from '@/api/client'; // Assuming Lesson type includes content
import { ThemedText } from '@/components/ThemedText';

export default function LessonDetailScreen() {
  const { bookId, lessonId } = useLocalSearchParams<{ bookId: string; lessonId: string }>();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookId || !lessonId) return;

    const fetchLessonDetails = async () => {
      try {
        setLoading(true);
        // Assuming api.getLessonById exists and fetches detailed lesson content
        const lessonDetails = await api.getLessonById(bookId, lessonId);
        setLesson(lessonDetails);
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
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>Loading lesson content...</ThemedText>
      </View>
    );
  }

  if (error || !lesson) {
    return (
      <View style={styles.centeredContainer}>
        <ThemedText style={styles.errorText}>{error || 'Lesson not found.'}</ThemedText>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <ThemedText type="title" style={styles.title}>{lesson.title}</ThemedText>
        {/* Assuming lesson.content holds the main text of the lesson */}
        <ThemedText style={styles.contentText}>{lesson.content || 'No content available for this lesson.'}</ThemedText>
        {/* Add more detailed rendering based on lesson structure if needed */}
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
    padding: 20,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    marginBottom: 15,
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
  },
});