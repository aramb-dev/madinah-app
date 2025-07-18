import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from '../../components/Themed';
import { useLocalSearchParams, useRouter, Link, Stack } from 'expo-router';
import { api, Lesson } from '@/api/client';
import LessonListItem from '@/components/LessonListItem'; // Import the LessonListItem component
import { useThemeColor } from '../../components/Themed';
import { useSettings } from '@/contexts/SettingsContext';

export default function BookLessonsScreen() {
  const { bookId } = useLocalSearchParams<{ bookId: string }>();
  const router = useRouter();
  const { fontSize } = useSettings();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [bookTitle, setBookTitle] = useState<string>('Loading title...'); // Initialize with a loading message
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Moved useThemeColor calls to the top level
  const itemBackgroundColor = useThemeColor({}, 'background'); // Using 'background' for 'card'
  const textColor = useThemeColor({}, 'text');
  const mutedTextColor = useThemeColor({}, 'text'); // Using 'text' for 'muted'
  const screenTitle = bookTitle && bookTitle !== 'Loading title...' && bookTitle !== 'Error Loading Data' && bookTitle !== 'Book Title Unavailable' ? `${bookTitle} - Lessons` : 'Lessons';
  const separatorColor = useThemeColor({}, 'tabIconDefault'); // Using 'tabIconDefault' for 'border'

  // Define styles before they are used in conditional rendering
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
      fontWeight: '600',
      marginBottom: 8,
    },
    lessonDescription: {
      // fontSize will be set dynamically
    },
    loadingText: {
      marginTop: 12,
      // fontSize will be set dynamically
    },
    errorText: {
      // fontSize will be set dynamically
      textAlign: 'center',
    },
    noDataText: {
      // fontSize will be set dynamically
      textAlign: 'center',
      marginTop: 24,
    },
    centeredContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

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
        const apiResponse = await api.getBookById(bookId);
        console.log('[BookLessonsScreen] Received apiResponse for book details:', JSON.stringify(apiResponse, null, 2));

        if (apiResponse && apiResponse.success && apiResponse.data) {
          const bookData = apiResponse.data;
          console.log('[BookLessonsScreen] bookData.title:', JSON.stringify(bookData.title));
          console.log('[BookLessonsScreen] typeof bookData.title:', typeof bookData.title);
          if (typeof bookData.title === 'object' && bookData.title !== null) {
            console.log('[BookLessonsScreen] bookData.title.en:', bookData.title.en);
          }

          let titleToSet = 'Book Title Unavailable';
          if (typeof bookData.title === 'string') {
            titleToSet = bookData.title;
          } else if (typeof bookData.title === 'object' && bookData.title !== null && bookData.title.en) {
            titleToSet = bookData.title.en;
          }
          setBookTitle(titleToSet);
          console.log(`[BookLessonsScreen] Set bookTitle to: ${titleToSet}`);

          if (bookData.lessons && Array.isArray(bookData.lessons)) {
            console.log('[BookLessonsScreen] bookData.lessons (first 5):', JSON.stringify(bookData.lessons.slice(0,5)));
            console.log('[BookLessonsScreen] Array.isArray(bookData.lessons):', Array.isArray(bookData.lessons));
            console.log('[BookLessonsScreen] bookData.lessons.length:', bookData.lessons.length);
            setLessons(bookData.lessons);
            console.log(`[BookLessonsScreen] Set lessons from bookData.lessons. Count: ${bookData.lessons.length}`);
          } else {
            console.log('[BookLessonsScreen] bookData.lessons not found/not an array or bookData is null. Fetching lessons separately.');
            const bookLessons = await api.getBookLessons(bookId);
            console.log('[BookLessonsScreen] Received bookLessons from api.getBookLessons (first 5):', JSON.stringify(bookLessons.slice(0,5)));
            setLessons(Array.isArray(bookLessons) ? bookLessons : []);
            console.log(`[BookLessonsScreen] Set lessons from api.getBookLessons. Count: ${Array.isArray(bookLessons) ? bookLessons.length : 0}`);
          }
        } else {
          // Handle case where apiResponse is not successful or data is missing
          console.error('[BookLessonsScreen] Failed to fetch book details or data is missing in response:', apiResponse);
          setError(`Failed to load details for book ${bookId}.`);
          setBookTitle('Error Loading Data');
          setLessons([]);
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

  return (
    <>
      <Stack.Screen options={{
        title: screenTitle,
        headerBackTitle: "Home"
      }} />
      {loading ? (
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" />
          <Text style={[styles.loadingText, { fontSize }]}>Loading lessons...</Text>
        </View>
      ) : error ? (
        <View style={styles.centeredContainer}>
          <Text style={[styles.errorText, { fontSize }]}>{error}</Text>
        </View>
      ) : (
        <ScrollView style={[styles.scrollContainer, { backgroundColor: itemBackgroundColor /* Use theme background for scroll view */ }]} >
          <View style={styles.container}>
            {/* Always render the title Text component, bookTitle state handles loading/error/actual title */}
            <Text type="title" style={[styles.title, { color: textColor }]}>{bookTitle === 'Loading title...' || bookTitle === 'Error Loading Data' || bookTitle === 'Book Title Unavailable' ? bookTitle : `${bookTitle} - Lessons`}</Text>
            <View style={[styles.separator, { backgroundColor: separatorColor }]} />

            {lessons && lessons.length > 0 ? lessons.map((lesson, index) => (
              <TouchableOpacity
                key={lesson.id}
                onPress={() => handleLessonPress(lesson.id)}
                style={[styles.lessonItem, { backgroundColor: itemBackgroundColor }]} // Dynamic background
              >
                {/* Assuming lesson.title is also a LocalizedString */}
                <Text type="arabic" style={[styles.lessonTitle, { color: textColor, fontSize: fontSize * 1.25 }]}>
                   {typeof lesson.title === 'object' && lesson.title.en ? lesson.title.en :
                   typeof lesson.title === 'string' ? lesson.title : 'Lesson Title Unavailable'}
                 </Text>
                {/* lesson.description removed as it does not exist on Lesson type */}
              </TouchableOpacity>
            )) : (
              <Text style={[styles.noDataText, { color: mutedTextColor, fontSize }]}>No lessons available for this book.</Text>
            )}
          </View>
        </ScrollView>
      )}
    </>
  );
}