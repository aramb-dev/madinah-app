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
import { BottomSheetModal, BottomSheetView, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';

export default function VocabularyScreen() {
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<string>('All');
  const [selectedLesson, setSelectedLesson] = useState<string>('All');
  const [filterMode, setFilterMode] = useState<'book' | 'lesson'>('book');
  const { selectedFont } = useFont();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const router = useRouter();

  const snapPoints = useMemo(() => ['25%', '60%'], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const books = ['book1', 'book2', 'book3'];

  const fetchVocabulary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getVocabulary(
        selectedBook === 'All' ? undefined : selectedBook,
        selectedLesson === 'All' ? undefined : selectedLesson
      );
      setVocabulary(data);
    } catch (e) {
      setError('Failed to fetch vocabulary.');
    } finally {
      setLoading(false);
    }
  }, [selectedBook, selectedLesson]);

  useEffect(() => {
    fetchVocabulary();
  }, [fetchVocabulary]);

  const availableLessons = useMemo(() => {
    if (selectedBook === 'All') return [];
    const lessons = vocabulary
      .filter((item) => item.bookId === selectedBook)
      .map((item) => item.lessonId);
    return ['All', ...Array.from(new Set(lessons)).sort((a, b) => parseInt(a, 10) - parseInt(b, 10)).map(String)];
  }, [vocabulary, selectedBook]);

  const groupedVocabulary = useMemo(() => {
    if (selectedBook !== 'All' && selectedLesson !== 'All') {
      return [{ title: `Book ${selectedBook.replace('book', '')} - Lesson ${selectedLesson}`, data: vocabulary }];
    }
    if (selectedBook !== 'All') {
      const groupedByLesson = vocabulary.reduce((acc, item) => {
        const lessonTitle = `Lesson ${item.lessonId}`;
        let lessonGroup = acc.find(group => group.title === lessonTitle);
        if (!lessonGroup) {
          lessonGroup = { title: lessonTitle, data: [] };
          acc.push(lessonGroup);
        }
        lessonGroup.data.push(item);
        return acc;
      }, [] as { title: string; data: Vocabulary[] }[]);
      return groupedByLesson.sort((a, b) => parseInt(a.title.split(' ')[1]) - parseInt(b.title.split(' ')[1]));
    }

    const groupedByBook = vocabulary.reduce((acc, item) => {
      const bookTitle = `Book ${item.bookId.replace('book', '')}`;
      let bookGroup = acc.find(group => group.title === bookTitle);
      if (!bookGroup) {
        bookGroup = { title: bookTitle, data: [] };
        acc.push(bookGroup);
      }
      bookGroup.data.push(item);
      return acc;
    }, [] as { title: string; data: Vocabulary[] }[]);
    return groupedByBook;
  }, [vocabulary, selectedBook, selectedLesson]);

  const handlePressItem = (item: Vocabulary) => {
    router.push({
      pathname: `/vocabulary/${item.id}` as any,
      params: { vocabulary: JSON.stringify(item) },
    });
  };

  const renderItem = ({ item }: { item: Vocabulary }) => (
    <TouchableOpacity onPress={() => handlePressItem(item)} style={styles.itemContainer}>
      <Text style={[styles.arabicWord, { fontFamily: selectedFont.fontFamily }]}>
        {item.word}
      </Text>
      <Text style={styles.translation}>{item.translation.en}</Text>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({
    section: { title },
  }: {
    section: { title: string };
  }) => <Text style={styles.sectionHeader}>{title}</Text>;

  const handleSelectBook = (bookId: string) => {
    setSelectedBook(bookId);
    setSelectedLesson('All');
    if (bookId === 'All') {
      bottomSheetModalRef.current?.dismiss();
    } else {
      setFilterMode('lesson');
    }
  };

  const handleSelectLesson = (lesson: string) => {
    setSelectedLesson(lesson);
    bottomSheetModalRef.current?.dismiss();
  };

  const EmptyListComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        No vocabulary found for the selected filter.
      </Text>
      <TouchableOpacity
        style={styles.clearFilterButton}
        onPress={() => {
          setSelectedBook('All');
          setSelectedLesson('All');
        }}
      >
        <Text style={styles.clearFilterButtonText}>Clear Filter</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Vocabulary</Text>
        <Pressable onPress={handlePresentModalPress}>
          <Ionicons name="filter-circle-outline" size={24} color="black" />
          {(selectedBook !== 'All' || selectedLesson !== 'All') && <View style={styles.filterBadge} />}
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
          ListEmptyComponent={groupedVocabulary.length === 0 ? <EmptyListComponent /> : null}
        />
      )}

      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        style={styles.bottomSheet}
        onDismiss={() => setFilterMode('book')}
      >
        <BottomSheetView style={styles.bottomSheetContent}>
      {/* Segmented Control */}
      <View style={styles.segmentedControl}>
        <TouchableOpacity
          style={[styles.segmentedButton, filterMode === 'book' && styles.segmentedButtonActive]}
          onPress={() => setFilterMode('book')}
        >
          <Text style={[styles.segmentedButtonText, filterMode === 'book' && styles.segmentedButtonTextActive]}>By Book</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segmentedButton, filterMode === 'lesson' && styles.segmentedButtonActive]}
          onPress={() => setFilterMode('lesson')}
          disabled={selectedBook === 'All'}
        >
          <Text style={[styles.segmentedButtonText, filterMode === 'lesson' && styles.segmentedButtonTextActive, selectedBook === 'All' && styles.disabledText]}>By Lesson</Text>
        </TouchableOpacity>
      </View>

      {/* Conditional Content */}
      {filterMode === 'book' ? (
        <View>
          <TouchableOpacity
            style={[styles.modalButton, selectedBook === 'All' && styles.modalButtonActive]}
            onPress={() => handleSelectBook('All')}
          >
            <Text style={[styles.modalButtonText, selectedBook === 'All' && styles.modalButtonTextActive]}>All Books</Text>
          </TouchableOpacity>
          {books.map((book) => (
            <TouchableOpacity
              key={book}
              style={[styles.modalButton, selectedBook === book && styles.modalButtonActive]}
              onPress={() => handleSelectBook(book)}
            >
              <Text style={[styles.modalButtonText, selectedBook === book && styles.modalButtonTextActive]}>{book.replace('book', 'Book ')}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <BottomSheetScrollView style={{ flex: 1 }}>
          <View style={styles.lessonContainer}>
            {availableLessons.map((lesson) => (
              <TouchableOpacity
                key={lesson}
                style={[styles.lessonButton, selectedLesson === lesson && styles.modalButtonActive]}
                onPress={() => handleSelectLesson(lesson)}
              >
                <Text style={[styles.modalButtonText, selectedLesson === lesson && styles.modalButtonTextActive]}>
                  {lesson === 'All' ? 'All Lessons' : `Lesson ${lesson}`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </BottomSheetScrollView>
      )}
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
  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  modalView: {
    flex: 1,
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
    width: '100%',
    padding: 12,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonActive: {
    backgroundColor: '#007AFF',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalButtonTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  lessonScrollView: {
    flex: 1,
    width: '100%',
  },
  lessonContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      paddingBottom: 40, // Add padding to the bottom
    },
    lessonButton: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      margin: 5,
      backgroundColor: '#f0f0f0',
      borderRadius: 10,
      alignItems: 'center',
    },
  segmentedControl: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    width: '100%',
  },
  segmentedButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  segmentedButtonActive: {
    backgroundColor: '#007AFF',
  },
  segmentedButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  segmentedButtonTextActive: {
    color: '#fff',
  },
  infoText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  disabledText: {
    color: '#aaa'
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