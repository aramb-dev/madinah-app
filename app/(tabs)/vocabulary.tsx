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
  Image,
  Platform,
} from 'react-native';
import { getVocabulary, Vocabulary } from '../../api/vocabulary';
import { useFont } from '@/components/FontContext';
import { Ionicons, Feather } from '@expo/vector-icons';
import { BottomSheetModal, BottomSheetView, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { useSettings } from '@/contexts/SettingsContext';

export default function VocabularyScreen() {
  const { colors } = useTheme();
  const { fontSize } = useSettings();
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 10,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 12,
      paddingHorizontal: 16,
    },
    headerTitle: {
      fontWeight: 'bold',
      color: colors.text,
    },
    loader: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorText: {
      textAlign: 'center',
      color: colors.notification,
      marginTop: 20,
    },
    listContent: {
      paddingBottom: 20,
    },
    sectionHeader: {
      fontWeight: 'bold',
      backgroundColor: colors.card,
      paddingVertical: 8,
      paddingHorizontal: 16,
      color: colors.text,
    },
    itemContainer: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      flexDirection: 'row-reverse',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    textContainer: {
      flex: 1,
      marginRight: 10,
    },
    arabicWord: {
      textAlign: 'right',
      marginBottom: 4,
      color: colors.text,
    },
    translation: {
      color: colors.text,
      textAlign: 'right',
    },
    bottomSheet: {
      shadowColor: colors.text,
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
      backgroundColor: colors.card,
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
      fontWeight: 'bold',
      color: colors.text,
    },
    modalButton: {
      width: '100%',
      padding: 12,
      marginVertical: 5,
      backgroundColor: colors.card,
      borderRadius: 10,
      alignItems: 'center',
    },
    modalButtonActive: {
      backgroundColor: colors.primary,
    },
    modalButtonText: {
      fontWeight: '500',
      color: colors.text,
    },
    modalButtonTextActive: {
      color: colors.card,
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
        backgroundColor: colors.card,
        borderRadius: 10,
        alignItems: 'center',
      },
    segmentedControl: {
      flexDirection: 'row',
      marginBottom: 20,
      backgroundColor: colors.border,
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
      backgroundColor: colors.primary,
    },
    segmentedButtonText: {
      fontWeight: '600',
      color: colors.text,
    },
    segmentedButtonTextActive: {
      color: colors.card,
    },
    infoText: {
      marginTop: 20,
      color: '#666',
      textAlign: 'center',
    },
    disabledText: {
      color: 'gray'
    },
    filterBadge: {
      position: 'absolute',
      right: -2,
      top: -2,
      backgroundColor: colors.primary,
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
      color: colors.text,
      textAlign: 'center',
    },
    clearFilterButton: {
      marginTop: 16,
      backgroundColor: colors.primary,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
    },
    clearFilterButtonText: {
      color: colors.card,
      fontWeight: 'bold',
    },
  });

  const renderItem = ({ item }: { item: Vocabulary }) => (
    <TouchableOpacity onPress={() => handlePressItem(item)} style={styles.itemContainer}>
      <View style={styles.textContainer}>
        <Text style={[styles.arabicWord, { fontFamily: selectedFont.fontFamily, fontSize: fontSize * 1.38 }]}>
          {item.word}
        </Text>
        <Text style={[styles.translation, { fontSize }]}>{item.translation.en}</Text>
      </View>
      <Feather name="chevron-left" size={24} color={colors.text} />
    </TouchableOpacity>
  );

  const renderSectionHeader = ({
    section: { title },
  }: {
    section: { title: string };
  }) => <Text style={[styles.sectionHeader, { fontSize: fontSize * 1.13 }]}>{title}</Text>;  const handleSelectBook = (bookId: string) => {
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
      <Text style={[styles.emptyText, { fontSize }]}>
        No vocabulary found for the selected filter.
      </Text>
      <TouchableOpacity
        style={styles.clearFilterButton}
        onPress={() => {
          setSelectedBook('All');
          setSelectedLesson('All');
        }}
      >
        <Text style={[styles.clearFilterButtonText, { fontSize }]}>Clear Filter</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { fontSize: fontSize * 1.5 }]}>Vocabulary</Text>
        <Pressable onPress={handlePresentModalPress}>
         {Platform.OS === 'android' ? (
   <Image source={require('../../assets/images/filter.png')} style={{ width: 24, height: 24 }} />
 ) : (
   <Ionicons name="filter-circle-outline" size={24} color={colors.text} />
 )}
          {(selectedBook !== 'All' || selectedLesson !== 'All') && <View style={styles.filterBadge} />}
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : error ? (
        <Text style={[styles.errorText, { fontSize }]}>{error}</Text>
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
          <Text style={[styles.segmentedButtonText, filterMode === 'book' && styles.segmentedButtonTextActive, { fontSize }]}>By Book</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segmentedButton, filterMode === 'lesson' && styles.segmentedButtonActive]}
          onPress={() => setFilterMode('lesson')}
          disabled={selectedBook === 'All'}
        >
          <Text style={[styles.segmentedButtonText, filterMode === 'lesson' && styles.segmentedButtonTextActive, selectedBook === 'All' && styles.disabledText, { fontSize }]}>By Lesson</Text>
        </TouchableOpacity>
      </View>

      {/* Conditional Content */}
      {filterMode === 'book' ? (
        <View>
          <TouchableOpacity
            style={[styles.modalButton, selectedBook === 'All' && styles.modalButtonActive]}
            onPress={() => handleSelectBook('All')}
          >
            <Text style={[styles.modalButtonText, selectedBook === 'All' && styles.modalButtonTextActive, { fontSize }]}>All Books</Text>
          </TouchableOpacity>
          {books.map((book) => (
            <TouchableOpacity
              key={book}
              style={[styles.modalButton, selectedBook === book && styles.modalButtonActive]}
              onPress={() => handleSelectBook(book)}
            >
              <Text style={[styles.modalButtonText, selectedBook === book && styles.modalButtonTextActive, { fontSize }]}>{book.replace('book', 'Book ')}</Text>
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
                <Text style={[styles.modalButtonText, selectedLesson === lesson && styles.modalButtonTextActive, { fontSize }]}>
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