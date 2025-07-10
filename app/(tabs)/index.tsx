import { StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Text, View, useThemeColor } from '@/components/Themed'; // Import useThemeColor
import { useEffect, useState } from 'react';
import { api, Book } from '@/api/client';
import { useRouter } from 'expo-router'; // Import useRouter

export default function LessonsScreen() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Initialize router

  // Moved useThemeColor hooks to the top level
  const bookItemBackground = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const mutedColor = useThemeColor({}, 'text'); // Assuming this was intended to be 'text' or similar, not 'muted'
  const separatorColor = useThemeColor({}, 'background');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const booksData = await api.getBooks(); // getBooks now returns Book[] directly
        setBooks(booksData); // Set the books directly
      } catch (err) {
        setError('Failed to load books');
        console.error('Error fetching books:', err);
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
        <Text style={styles.loadingText}>Loading lessons...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const handleBookPress = (bookId: string) => {
    router.push(`/lessons/${bookId}`);
  };

  // const bookItemBackground = useThemeColor({}, 'background'); // Example usage for book item background
  // const textColor = useThemeColor({}, 'text');
  // const mutedColor = useThemeColor({}, 'text');
  // const separatorColor = useThemeColor({}, 'background');

  return (
    <ScrollView style={styles.scrollContainer} contentInsetAdjustmentBehavior="automatic">
      <View style={styles.container}>
        <Text style={[styles.title, { color: textColor }]}>Madinah Arabic Lessons</Text>
        <View style={[styles.separator, { backgroundColor: separatorColor }]} />

        {books.map((book, index) => (
          <TouchableOpacity key={book.id} onPress={() => handleBookPress(book.id)} style={[styles.bookItem, { backgroundColor: bookItemBackground }]}>
            <Text style={[styles.bookTitle, { color: textColor }]}>{book.title.en}</Text>
            {book.description && (
              <Text style={[styles.bookDescription, { color: mutedColor }]}>{book.description.en}</Text>
            )}
            <Text style={[styles.lessonCount, { color: mutedColor }]}>
              {book.lessons?.length || 0} lessons
            </Text>
          </TouchableOpacity>
        ))}

        {books.length === 0 && (
          <Text style={[styles.noDataText, { color: mutedColor }]}>No books available.</Text>
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
    paddingTop: 16, // Reduced from 24 to be more consistent
    paddingBottom: 24,
  },
  title: {
    fontSize: 28, // Increased font size
    fontWeight: 'bold',
    marginBottom: 16, // Increased margin
  },
  separator: {
    marginVertical: 24, // Increased margin
    height: 1,
    width: '100%',
  },
  bookItem: {
    width: '100%',
    marginBottom: 16, // Adjusted margin
    padding: 20, // Increased padding
    borderRadius: 12, // Increased border radius
    // backgroundColor is now set dynamically
  },
  bookTitle: {
    fontSize: 20, // Increased font size
    fontWeight: '600', // Adjusted font weight
    marginBottom: 8, // Increased margin
  },
  bookDescription: {
    fontSize: 15, // Increased font size
    marginBottom: 8, // Increased margin
  },
  lessonCount: {
    fontSize: 13, // Increased font size
  },
  loadingText: {
    marginTop: 12, // Adjusted margin
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    // color: 'red', // Color will be handled by theme or can be set explicitly if needed for errors
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 24, // Increased margin
  },
});
