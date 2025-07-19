import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Text, useThemeColor } from '../../../components/Themed';
import { ThemedText } from '../../../components/ThemedText';
import { useLocalSearchParams, Stack } from 'expo-router';
import { api, Lesson as ApiLesson, Book as ApiBook } from '../../../api/client';
import { useSettings } from '@/contexts/SettingsContext';
import { useFont } from '@/components/FontContext';

// Define a more specific Lesson type for the component's needs
interface LessonContentItem {
  arabic?: string;
  translation?: string;
}

interface Rule {
  name: string;
  arabicText: string;
  explanation: string;
  id?: string;
  type?: string;
}

interface Lesson extends Omit<ApiLesson, 'content' | 'rules'> { // Exclude rules as well if it's handled separately
  content?: LessonContentItem[];
  description?: string;
  introduction?: ApiLesson['introduction']; // Align with ApiLesson's LocalizedString or undefined
  rules?: Rule[]; // Add rules
}

// Helper function to get localized text
const getLocalizedText = (localizedString: ApiLesson['title'] | ApiLesson['introduction'] | undefined, lang: 'en' | 'ar' = 'en'): string => {
  if (!localizedString) return '';
  if (typeof localizedString === 'string') return localizedString;
  // Prioritize requested language, then fallback
  return localizedString[lang] || localizedString.ar || localizedString.en || '';
};

export default function LessonDetailScreen() {
  const { bookId, lessonId } = useLocalSearchParams<{ bookId: string; lessonId: string }>();
  const { fontSize } = useSettings();
  const { selectedFont } = useFont();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookDetails, setBookDetails] = useState<ApiBook | null>(null);

  // Moved useThemeColor calls to the top level
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const mutedTextColor = useThemeColor({}, 'muted');
  const cardBackgroundColor = useThemeColor({}, 'card');
  const separatorColor = useThemeColor({}, 'border');

  // Dynamic screen title
  // Dynamic screen title
  let screenTitle = 'Lesson Details'; // Default title
  if (bookId && lessonId) {
    const bookName = bookDetails?.title ? getLocalizedText(bookDetails.title) : `Book ${bookId}`;
    const lessonName = lesson?.title ? getLocalizedText(lesson.title) : `Lesson ${lessonId}`;
    screenTitle = `${bookName} - ${lessonName}`;
  } else if (lesson?.title) {
    screenTitle = getLocalizedText(lesson.title);
  } else if (bookDetails?.title) {
    screenTitle = getLocalizedText(bookDetails.title);
  }

  useEffect(() => {
    if (!bookId || !lessonId) return;

    const fetchData = async () => { // Renamed to reflect fetching both book and lesson
      try {
        setLoading(true);

        // Fetch book details
        if (bookId) {
          const bookResponse = await api.getBookById(bookId);
          if (bookResponse && bookResponse.success && bookResponse.data) {
            setBookDetails(bookResponse.data);
          } else {
            console.error(`[LessonDetailScreen] Failed to fetch book details for bookId: ${bookId}`, bookResponse);
            // Optionally set an error state specific to book fetching if needed
          }
        }

        // Fetch lesson details
        if (bookId && lessonId) { // Ensure lessonId is also present before fetching lesson
          const lessonApiResponse = await api.getBookLesson(bookId, lessonId);
          console.log('[LessonDetailScreen] Received apiResponse for lesson details:', JSON.stringify(lessonApiResponse, null, 2));

          if (lessonApiResponse && lessonApiResponse.success && lessonApiResponse.data) {
            const lessonData = lessonApiResponse.data;
            const adaptedLesson: Lesson = {
              ...lessonData,
              content: lessonData.content
                ? typeof lessonData.content === 'string'
                  ? JSON.parse(lessonData.content)
                  : Array.isArray(lessonData.content) ? lessonData.content : []
                : [],
              description: lessonData.description || '',
              rules: lessonData.rules || [],
            };
            setLesson(adaptedLesson);
            console.log('[LessonDetailScreen] Adapted lesson set:', JSON.stringify(adaptedLesson, null, 2));
          } else {
            console.error('[LessonDetailScreen] Failed to fetch lesson details or data is missing in response:', lessonApiResponse);
            setError(`Failed to load details for lesson ${lessonId} from book ${bookId}.`);
            setLesson(null);
          }
        }
      } catch (err) {
        console.error('[LessonDetailScreen] Error in fetchData:', err);
        setError(`Failed to load data for book ${bookId} / lesson ${lessonId}.`);
        setLesson(null); // Also clear lesson if book fetch fails or general error
        setBookDetails(null); // Clear book details on error
      } finally {
        setLoading(false);
        console.log('[LessonDetailScreen] fetchData finished.');
      }
    };

    fetchData();
  }, [bookId, lessonId]);

  // Original fetchLessonDetails logic is now part of fetchData
  /*
    const fetchLessonDetails = async () => {
      try {
        setLoading(true);
        const apiResponse = await api.getBookLesson(bookId, lessonId);
        console.log('[LessonDetailScreen] Received apiResponse for lesson details:', JSON.stringify(apiResponse, null, 2));

        if (apiResponse && apiResponse.success && apiResponse.data) {
          const lessonData = apiResponse.data;
          // Adapt the API response to the component's Lesson type
          const adaptedLesson: Lesson = {
            ...lessonData,
            // Process content: if it's a string, parse it; otherwise, use as is or default to empty array
            content: lessonData.content
              ? typeof lessonData.content === 'string'
                ? JSON.parse(lessonData.content)
                : Array.isArray(lessonData.content) ? lessonData.content : []
              : [],
            description: lessonData.description || '', // Ensure description is always a string
            rules: lessonData.rules || [], // Ensure rules are copied over
          };
          setLesson(adaptedLesson);
          console.log('[LessonDetailScreen] Adapted lesson set:', JSON.stringify(adaptedLesson, null, 2));
        } else {
          console.error('[LessonDetailScreen] Failed to fetch lesson details or data is missing in response:', apiResponse);
          setError(`Failed to load details for lesson ${lessonId} from book ${bookId}.`);
          setLesson(null);
        }
      } catch (err) {
        console.error('[LessonDetailScreen] Error in fetchLessonDetails:', err);
        setError(`Failed to load lesson ${lessonId} from book ${bookId}.`);
        setLesson(null);
      } finally {
        setLoading(false);
        console.log('[LessonDetailScreen] fetchLessonDetails finished.');
      }
    };

    fetchData(); // Call the combined fetch function
  }, [bookId, lessonId]);
  */

  return (
    <>
      <Stack.Screen options={{
        title: screenTitle,
        headerBackTitle: "Lessons"
      }} />
      <ScrollView style={[styles.scrollContainer, { backgroundColor }]} contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.container}>
          {loading && (
            <View style={[styles.container, styles.centeredContent]}>
              <ActivityIndicator size="large" />
              <Text style={[styles.loadingText, { fontSize }]}>Loading lesson content...</Text>
            </View>
          )}
          {error && !loading && (
            <View style={[styles.container, styles.centeredContent]}>
              <Text style={[styles.errorText, { fontSize }]}>{error || 'Lesson not found.'}</Text>
            </View>
          )}
          {!loading && !error && lesson && (
            <>
              <View style={styles.titleContainer}>
                <ThemedText type="arabic" style={[styles.titleArabic, { color: textColor }]}>{getLocalizedText(lesson.title, 'ar') || 'عنوان الدرس غير متوفر'}</ThemedText>
                <Text type="title" style={[styles.titleEnglish, { color: textColor }]}>{getLocalizedText(lesson.title, 'en') || 'Lesson Title Unavailable'}</Text>
              </View>
              {lesson.introduction && (
                <View style={[styles.introductionContainer, { backgroundColor: cardBackgroundColor }]}>
                  <Text type="subtitle" style={[styles.introductionTitle, { color: textColor, fontSize: fontSize * 1.25 }]}>Introduction:</Text>

                  {/* Arabic introduction - handle both API structures */}
                  {((lesson.introduction as any).arabic || (lesson.introduction as any).ar) && (
                    <View style={styles.arabicTextContainer}>
                      <ThemedText type="arabic" style={[styles.arabicIntroText, { color: textColor }]}>
                        {(lesson.introduction as any).arabic || (lesson.introduction as any).ar}
                      </ThemedText>
                    </View>
                  )}

                  {/* English introduction - handle both API structures */}
                  {((lesson.introduction as any).english || (lesson.introduction as any).en) && (
                    <Text style={[styles.introductionText, { color: mutedTextColor, fontSize }]}>
                      {(lesson.introduction as any).english || (lesson.introduction as any).en}
                    </Text>
                  )}
                </View>
              )}
              {(lesson.description || '').trim() !== '' && (
                <Text style={[styles.description, { color: mutedTextColor, fontSize }]}>{lesson.description}</Text>
              )}

              {lesson.rules && Array.isArray(lesson.rules) && lesson.rules.length > 0 && (
                <View style={styles.rulesContainer}>
                  <Text type="subtitle" style={[styles.rulesTitle, { color: textColor, fontSize: fontSize * 1.25 }]}>Rules:</Text>
                  {lesson.rules!.map((rule, index) => (
                    <View key={rule.id || `rule-${index}`} style={[styles.ruleItem, { backgroundColor: cardBackgroundColor }]}>
                      <Text type="subtitle" style={[styles.ruleName, { color: textColor, fontSize: fontSize * 1.13 }]}>{rule.name}</Text>
                      <View style={styles.arabicTextContainer}>
                        <ThemedText type="arabic" style={[styles.arabicText, { color: textColor }]}>{rule.arabicText}</ThemedText>
                      </View>
                      <Text style={[styles.ruleExplanation, { color: mutedTextColor, fontSize }]}>{rule.explanation}</Text>
                    </View>
                  ))}
                </View>
              )}

              {(lesson.rules && Array.isArray(lesson.rules) && lesson.rules.length > 0 || lesson.content && Array.isArray(lesson.content) && lesson.content.length > 0) &&
                <View style={[styles.separator, { backgroundColor: separatorColor }]} />
              }

              {lesson.content && Array.isArray(lesson.content) && lesson.content.length > 0 && (
                lesson.content!.map((item: LessonContentItem, index: number) => (
                  <View key={index} style={[styles.contentItem, { backgroundColor: cardBackgroundColor }]}>
                    {item.arabic && (
                      <View style={styles.arabicTextContainer}>
                        <ThemedText type="arabic" style={[styles.arabicText, { color: textColor }]}>
                          {item.arabic}
                        </ThemedText>
                      </View>
                    )}
                    {item.translation && (
                      <Text style={[styles.translationText, { color: mutedTextColor, fontSize: fontSize * 0.94 }]}>
                        {item.translation}
                      </Text>
                    )}
                  </View>
                ))
              )}

              {!(lesson.rules && Array.isArray(lesson.rules) && lesson.rules.length > 0) && !(lesson.content && Array.isArray(lesson.content) && lesson.content.length > 0) && (
                <Text style={[styles.noDataText, { color: mutedTextColor, fontSize }]}>No content available for this lesson.</Text>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </>
  );
}

// The existing StyleSheet.create call and styles remain unchanged below this line
// ... styles ...

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingTop: 16,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  centeredContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
    width: '100%',
  },
  titleArabic: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
    marginTop: 4,
    width: '100%',
    writingDirection: 'rtl',
    lineHeight: 50,  // Reduced but still sufficient for diacritics
    paddingTop: 8,
    includeFontPadding: true,
  },
  titleEnglish: {
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%',
  },
  description: {
    marginBottom: 16,
    textAlign: 'center',
  },
  introductionContainer: {
    marginTop: 8,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    width: '100%',
  },
  introductionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  introductionText: {
    lineHeight: 22,
    textAlign: 'left',
    paddingHorizontal: 4,
    marginTop: 4,
  },
  arabicTextContainer: {
    width: '100%',
    paddingVertical: 8,
    paddingTop: 12,  // Still enough padding for diacritics
    minHeight: 50,  // Reduced but still sufficient
  },
  arabicIntroText: {
    fontSize: 22,
    lineHeight: 45,  // Reduced but still sufficient
    textAlign: 'right',
    writingDirection: 'rtl',
    paddingHorizontal: 4,
    paddingTop: 8,
    includeFontPadding: true,
  },
  rulesContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
  rulesTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  ruleItem: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  ruleName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  ruleExplanation: {
    // fontSize will be set dynamically
  },
  separator: {
    marginVertical: 16,
    height: 1,
    width: '100%',
  },
  contentItem: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    width: '100%',
  },
  arabicText: {
    lineHeight: 45,  // Reduced but still sufficient
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 8,
    paddingHorizontal: 4,
    paddingTop: 8,
    flexWrap: 'wrap',
    width: '100%',
    includeFontPadding: true,
  },
  translationText: {
    fontStyle: 'italic',
  },
  loadingText: {
    marginTop: 12,
    textAlign: 'center',
  },
  errorText: {
    textAlign: 'center',
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 24,
  },
});