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
        console.log(`[BookLessonsScreen] Fetching details for bookId: ${bookId}`);
        const bookDetails = await api.getBookById(bookId);
        console.log('[BookLessonsScreen] Received bookDetails:', JSON.stringify(bookDetails, null, 2));

        if (bookDetails) {
          console.log('[BookLessonsScreen] bookDetails.title:', JSON.stringify(bookDetails.title));
          console.log('[BookLessonsScreen] typeof bookDetails.title:', typeof bookDetails.title);
          if (typeof bookDetails.title === 'object' && bookDetails.title !== null) {
            console.log('[BookLessonsScreen] bookDetails.title.en:', bookDetails.title.en);
          }
        }

        if (bookDetails && typeof bookDetails.title === 'object' && bookDetails.title !== null && bookDetails.title.en) {
          setBookTitle(bookDetails.title.en);
          console.log(`[BookLessonsScreen] Set bookTitle to: ${bookDetails.title.en}`);
        } else if (bookDetails && typeof bookDetails.title === 'string') {
          setBookTitle(bookDetails.title);
          console.log(`[BookLessonsScreen] Set bookTitle to (string): ${bookDetails.title}`);
        } else {
          setBookTitle('Book Title Unavailable');
          console.log('[BookLessonsScreen] Set bookTitle to: Book Title Unavailable');
        }

        if (bookDetails && bookDetails.lessons) {
          console.log('[BookLessonsScreen] bookDetails.lessons (first 5):', JSON.stringify(bookDetails.lessons.slice(0,5)));
          console.log('[BookLessonsScreen] Array.isArray(bookDetails.lessons):', Array.isArray(bookDetails.lessons));
          console.log('[BookLessonsScreen] bookDetails.lessons.length:', bookDetails.lessons.length);
        }

        if (bookDetails && bookDetails.lessons && Array.isArray(bookDetails.lessons)) {
          setLessons(bookDetails.lessons);
          console.log(`[BookLessonsScreen] Set lessons from bookDetails.lessons. Count: ${bookDetails.lessons.length}`);
        } else {
          console.log('[BookLessonsScreen] bookDetails.lessons not found/not an array or bookDetails is null. Fetching lessons separately.');
          const bookLessons = await api.getBookLessons(bookId);
          console.log('[BookLessonsScreen] Received bookLessons from api.getBookLessons (first 5):', JSON.stringify(bookLessons.slice(0,5)));
          setLessons(Array.isArray(bookLessons) ? bookLessons : []);
          console.log(`[BookLessonsScreen] Set lessons from api.getBookLessons. Count: ${Array.isArray(bookLessons) ? bookLessons.length : 0}`);
        }
      } catch (err) {
        console.error('[BookLessonsScreen] Error in fetchBookDetails:', err);
        setError(`Failed to load lessons for book ${bookId}.`);
        setLessons([]); 
        setBookTitle('Error Loading Data'); // Set a title in case of error
      } finally {
        setLoading(false);
        console.log('[BookLessonsScreen] fetchBookDetails finished.');
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

  // Removed duplicate useThemeColor calls here

  return (
    <ScrollView style={[styles.scrollContainer, { backgroundColor: itemBackgroundColor /* Use theme background for scroll view */ }]} >
      <View style={styles.container}>
        {bookTitle && (
          <Text style={[styles.title, { color: textColor }]}>{bookTitle} - Lessons</Text>
        )}
        <View style={[styles.separator, { backgroundColor: separatorColor }]} />

        {lessons && lessons.length > 0 ? lessons.map((lesson, index) => (
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
        )) : (
          !loading && <Text style={[styles.noDataText, { color: mutedTextColor }]}>No lessons available for this book.</Text>
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