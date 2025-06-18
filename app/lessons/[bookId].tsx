import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, Link } from 'expo-router';
import { api, Lesson } from '@/api/client';
import { ThemedText } from '@/components/ThemedText'; // Corrected import path
import LessonListItem from '@/components/LessonListItem'; // Import the LessonListItem component
import { useThemeColor } from '@/components/Themed'; // Import useThemeColor

export default function BookLessonsScreen() {
  const { bookId } = useLocalSearchParams<{ bookId: string }>();
  const router = useRouter();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [bookTitle, setBookTitle] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookId) return;

    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        const bookDetails = await api.getBookById(bookId);
        setBookTitle(bookDetails.title);
        if (bookDetails.lessons) {
          setLessons(bookDetails.lessons);
        } else {
          // If lessons are not directly in bookDetails, fetch them separately
          const bookLessons = await api.getBookLessons(bookId);
          setLessons(bookLessons);
        }
      } catch (err) {
        console.error('Failed to fetch book details or lessons:', err);
        setError(`Failed to load lessons for book ${bookId}`);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  const handleLessonPress = (lessonId: string) => {
    router.push(`/lessons/${bookId}/${lessonId}`);
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>Loading lessons...</ThemedText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      </View>
    );
  }

  const itemBackgroundColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const mutedTextColor = useThemeColor({}, 'muted');
  const separatorColor = useThemeColor({}, 'border');

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        {bookTitle && (
          <Text style={[styles.title, { color: textColor }]}>{bookTitle} - Lessons</Text>
        )}
        <View style={[styles.separator, { backgroundColor: separatorColor }]} />

        {lessons.map((lesson, index) => (
          <TouchableOpacity
            key={lesson.id}
            onPress={() => handleLessonPress(lesson.id)}
            style={[styles.lessonItem, { backgroundColor: itemBackgroundColor }]} // Dynamic background
          >
            <Text style={[styles.lessonTitle, { color: textColor }]}>{lesson.title}</Text>
            {/* lesson.description removed as it does not exist on Lesson type */}
          </TouchableOpacity>
        ))}

        {lessons.length === 0 && !loading && (
          <Text style={[styles.noDataText, { color: mutedTextColor }]}>No lessons available for this book.</Text>
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
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  separator: {
    marginVertical: 24,
    height: 1,
    width: '100%',
  },
  lessonItem: {
    width: '100%',
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
    // backgroundColor is now dynamic
  },
  lessonTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  lessonDescription: {
    fontSize: 15,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
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
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});