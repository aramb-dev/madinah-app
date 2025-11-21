import { StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { Text, useThemeColor } from '@/components/Themed';
import { useEffect, useState } from 'react';
import { api, Book } from '../../api/client';
import { useRouter } from 'expo-router';
import { useSettings } from '@/contexts/SettingsContext';
import logger from '@/utils/logger';

export default function LessonsScreen() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { fontSize } = useSettings();

  const bookItemBackground = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const mutedColor = useThemeColor({}, 'text');
  const separatorColor = useThemeColor({}, 'background');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const booksData = await api.getBooks();
        setBooks(booksData);
      } catch (err) {
        setError('Failed to load books');
        logger.error('Error fetching books:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={[styles.loadingText, { fontSize }]}>Loading lessons...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={[styles.errorText, { fontSize }]}>{error}</Text>
      </View>
    );
  }

  const handleBookPress = (bookId: string) => {
    router.push(`/lessons/${bookId}`);
  };

  return (
    <ScrollView style={styles.scrollContainer} contentInsetAdjustmentBehavior="automatic">
      <View style={styles.container}>
        <Text style={[styles.title, { color: textColor, fontSize: fontSize * 1.75 }]}>Madinah Arabic Lessons</Text>
        <View style={[styles.separator, { backgroundColor: separatorColor }]} />

        {books.map((book, index) => (
          <TouchableOpacity key={book.id} onPress={() => handleBookPress(book.id)} style={[styles.bookItem, { backgroundColor: bookItemBackground }]}>
            <Text style={[styles.bookTitle, { color: textColor, fontSize: fontSize * 1.25 }]}>{book.title.en}</Text>
            {book.description && (
              <Text style={[styles.bookDescription, { color: mutedColor, fontSize: fontSize * 0.94 }]}>{book.description.en}</Text>
            )}
            <Text style={[styles.lessonCount, { color: mutedColor, fontSize: fontSize * 0.81 }]}>
              {book.lessons?.length || 0} lessons
            </Text>
          </TouchableOpacity>
        ))}

        {books.length === 0 && (
          <Text style={[styles.noDataText, { color: mutedColor, fontSize }]}>No books available.</Text>
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
    paddingTop: 16,
    paddingBottom: 24,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  separator: {
    marginVertical: 24,
    height: 1,
    width: '100%',
  },
  bookItem: {
    width: '100%',
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
  },
  bookTitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  bookDescription: {
    marginBottom: 8,
  },
  lessonCount: {},
  loadingText: {
    marginTop: 12,
  },
  errorText: {
    textAlign: 'center',
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 24,
  },
});
