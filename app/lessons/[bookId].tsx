import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, Link } from 'expo-router';
import { api, Lesson } from '@/api/client';
import { ThemedText } from '@/components/Themed'; // Corrected import path
import LessonListItem from '@/components/LessonListItem'; // Import the LessonListItem component

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

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <ThemedText type="title" style={styles.title}>{bookTitle}</ThemedText>
        <ThemedText style={styles.subtitle}>Lessons</ThemedText>
        
        {lessons.length > 0 ? (
          lessons.map((lesson) => (
            <LessonListItem
              key={lesson.id}
              id={lesson.id}
              title={lesson.title}
              onPress={() => router.push(`/lessons/${bookId}/${lesson.id}`)} // Navigate to individual lesson screen
            />
          ))
        ) : (
          <ThemedText style={styles.noDataText}>No lessons found for this book.</ThemedText>
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
    padding: 20,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    opacity: 0.8,
  },
  loadingText: {
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    opacity: 0.7,
  },
});