import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { getVocabulary, Vocabulary } from '../../api/vocabulary';
import { useFont } from '@/components/FontContext';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';

function VocabularyScreen() {
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<string | undefined>();
  const { selectedFont } = useFont();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const books = ['book1', 'book2', 'book3'];

  const fetchVocabulary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getVocabulary(selectedBook);
      setVocabulary(data);
    } catch (e) {
      setError('Failed to fetch vocabulary.');
    } finally {
      setLoading(false);
    }
  }, [selectedBook]);

  useEffect(() => {
    fetchVocabulary();
  }, [fetchVocabulary]);

  const renderItem = ({ item }: { item: Vocabulary }) => (
    <View style={styles.itemContainer}>
      <Text style={[styles.arabicWord, { fontFamily: selectedFont.fontFamily }]}>
        {item.word}
      </Text>
      <Text style={styles.translation}>{item.translation.en}</Text>
    </View>
  );

  const handleSelectBook = (bookId: string | undefined) => {
    setSelectedBook(bookId);
    bottomSheetModalRef.current?.dismiss();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Vocabulary</Text>
        <TouchableOpacity onPress={handlePresentModalPress}>
          <Ionicons name="filter-circle-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={vocabulary}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={{ flex: 1 }}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.errorText}>No vocabulary found.</Text>}
        />
      )}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.modalText}>Filter by Book</Text>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => handleSelectBook(undefined)}
          >
            <Text style={styles.modalButtonText}>All</Text>
          </TouchableOpacity>
          {books.map((book) => (
            <TouchableOpacity
              key={book}
              style={styles.modalButton}
              onPress={() => handleSelectBook(book)}
            >
              <Text style={styles.modalButtonText}>{book.replace('book', 'Book ')}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </BottomSheetModal>
    </SafeAreaView>
  );
}

export default function VocabularyScreenWrapper() {
  return (
    <BottomSheetModalProvider>
      <VocabularyScreen />
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    marginTop: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  itemContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  arabicWord: {
    fontSize: 22,
    textAlign: 'right',
    marginBottom: 8,
  },
  translation: {
    fontSize: 16,
    color: '#555',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalButton: {
    width: 200,
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
  },
});