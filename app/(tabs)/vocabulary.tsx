import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  SectionList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { getVocabulary, Vocabulary } from '../../api/vocabulary';
import { useFont } from '@/components/FontContext';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';

export default function VocabularyScreen() {
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<string>('All');
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
      const data = await getVocabulary(
        selectedBook === 'All' ? undefined : selectedBook
      );
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

  const groupedVocabulary = useMemo(() => {
    if (selectedBook !== 'All') {
      return [];
    }
    const grouped = vocabulary.reduce((acc, item) => {
      const lesson = `Lesson ${item.lessonId}`;
      const existingLesson = acc.find((section) => section.title === lesson);
      if (existingLesson) {
        existingLesson.data.push(item);
      } else {
        acc.push({ title: lesson, data: [item] });
      }
      return acc;
    }, [] as { title: string; data: Vocabulary[] }[]);
    return grouped;
  }, [vocabulary, selectedBook]);

  const renderItem = ({ item }: { item: Vocabulary }) => (
    <View style={styles.itemContainer}>
      <Text style={[styles.arabicWord, { fontFamily: selectedFont.fontFamily }]}>
        {item.word}
      </Text>
      <Text style={styles.translation}>{item.translation.en}</Text>
    </View>
  );

  const renderSectionHeader = ({
    section: { title },
  }: {
    section: { title: string };
  }) => <Text style={styles.sectionHeader}>{title}</Text>;

  const handleSelectBook = (bookId: string) => {
    setSelectedBook(bookId);
    bottomSheetModalRef.current?.dismiss();
  };

  const EmptyListComponent = () => (
    <View style={styles.emptyContainer}>
      {selectedBook !== 'All' ? (
        <>
          <Text style={styles.emptyText}>
            No vocabulary found for this filter.
          </Text>
          <TouchableOpacity
            style={styles.clearFilterButton}
            onPress={() => handleSelectBook('All')}
          >
            <Text style={styles.clearFilterButtonText}>Clear Filter</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.emptyText}>No vocabulary found.</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Vocabulary</Text>
        <Pressable onPress={handlePresentModalPress}>
          <Ionicons name="filter-circle-outline" size={24} color="black" />
          {selectedBook !== 'All' && <View style={styles.filterBadge} />}
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <SectionList
          sections={groupedVocabulary}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={(item) => item.id}
          style={{ flex: 1 }}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<EmptyListComponent />}
        />
      )}

      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        style={styles.bottomSheet}
      >
        <BottomSheetView style={styles.modalView}>
          <Text style={styles.modalText}>Filter by Book</Text>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => handleSelectBook('All')}
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
        </BottomSheetView>
      </BottomSheetModal>
    </SafeAreaView>
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
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#f7f7f7',
    paddingVertical: 8,
    paddingHorizontal: 16,
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
  bottomSheet: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalView: {
    padding: 35,
    alignItems: 'center',
    width: '100%',
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
  filterBadge: {
    position: 'absolute',
    right: -2,
    top: -2,
    backgroundColor: 'blue',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  clearFilterButton: {
    marginTop: 16,
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  clearFilterButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});