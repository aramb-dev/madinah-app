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
  const [bookTitle, setBookTitle] = useState<string>(''); // Keep this for book title
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Moved useThemeColor calls to the top level
  const itemBackgroundColor = useThemeColor({}, 'background'); // Using 'background' for 'card'
  const textColor = useThemeColor({}, 'text');
  const mutedTextColor = useThemeColor({}, 'text'); // Using 'text' for 'muted'
  const separatorColor = useThemeColor({}, 'tabIconDefault'); // Using 'tabIconDefault' for 'border'

  useEffect(() => {
    if (!bookId) {
      // It's good practice to handle the case where bookId might be undefined or null
      // For example, by setting an error state or redirecting
      setError('Book ID is missing.');
      setLoading(false);
      return;
    }

    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        // Assuming api.getBookById returns an object with title and lessons array
        // And that title is a LocalizedString { ar: string, en: string }
        const bookDetails = await api.getBookById(bookId);
        // Ensure bookDetails.title is an object with an 'en' property before accessing it
        if (bookDetails && typeof bookDetails.title === 'object' && bookDetails.title.en) {
          setBookTitle(bookDetails.title.en); // Display English title
        } else if (bookDetails && typeof bookDetails.title === 'string') {
          // Fallback if title is just a string (older structure?)
          setBookTitle(bookDetails.title);
        } else {
          setBookTitle('Book Title Unavailable'); // Fallback title
        }

        if (bookDetails.lessons && Array.isArray(bookDetails.lessons)) {
          setLessons(bookDetails.lessons);
        } else {
          // If lessons are not directly in bookDetails, fetch them separately
          const bookLessons = await api.getBookLessons(bookId);
          setLessons(bookLessons);
        }
      } catch (err) {
        console.error('Failed to fetch book details or lessons:', err);
        setError(`Failed to load lessons for book ${bookId}. Please check console for details.`);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [bookId]); // Removed theme color dependencies as they are now top-level

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

  // Removed duplicate useThemeColor calls here

  return (
    <ScrollView style={[styles.scrollContainer, { backgroundColor: itemBackgroundColor /* Use theme background for scroll view */ }]} >
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
            {/* Assuming lesson.title is also a LocalizedString */}
            <Text style={[styles.lessonTitle, { color: textColor }]}>{
              typeof lesson.title === 'object' && lesson.title.en ? lesson.title.en : 
              typeof lesson.title === 'string' ? lesson.title : 'Lesson Title Unavailable'
            }</Text>
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