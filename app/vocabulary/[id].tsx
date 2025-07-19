import { Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text } from '../../components/Themed';
import { ThemedText } from '../../components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettings } from '@/contexts/SettingsContext';
import { useFont } from '@/components/FontContext';

// Temporary interface until the main one is updated
interface Vocabulary {
  id: string;
  bookId: string;
  lessonId: string;
  word: string;
  translation: {
    en: string;
  };
  type?: string;
  plural?: string;
  transliteration?: string;
  definition?: string;
  examples?: {
    arabic: string;
    english: string;
  }[];
}

export default function WordDetailScreen() {
  const { vocabulary: vocabularyString } = useLocalSearchParams<{ vocabulary: string }>();
  const { fontSize } = useSettings();
  const { selectedFont } = useFont();

  if (!vocabularyString) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Vocabulary data not found.</Text>
      </SafeAreaView>
    );
  }

  const vocabulary: Vocabulary = JSON.parse(vocabularyString);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerBackTitle: 'Vocabulary',
          title: vocabulary.word,
        }}
      />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={[styles.word, { fontSize: fontSize * 2 }]}>{vocabulary.word}</Text>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: fontSize * 1.25 }]}>Translation</Text>
          <Text style={[styles.sectionContent, { fontSize }]}>{vocabulary.translation.en}</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: fontSize * 1.25 }]}>Information</Text>
          {vocabulary.type && <Text style={[styles.sectionContent, { fontSize }]}><Text style={[styles.infoLabel, { fontSize }]}>Type:</Text> {vocabulary.type}</Text>}
          {vocabulary.plural && <Text style={[styles.sectionContent, { fontSize }]}><Text style={[styles.infoLabel, { fontSize }]}>Plural:</Text> <ThemedText type="arabic" style={{ fontSize }}>{vocabulary.plural}</ThemedText></Text>}
          {vocabulary.transliteration && <Text style={[styles.sectionContent, { fontSize }]}><Text style={[styles.infoLabel, { fontSize }]}>Transliteration:</Text> {vocabulary.transliteration}</Text>}
        </View>

        {vocabulary.definition && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { fontSize: fontSize * 1.25 }]}>Definition</Text>
            <Text style={[styles.sectionContent, { fontSize }]}>{vocabulary.definition}</Text>
          </View>
        )}

        {vocabulary.examples && vocabulary.examples.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { fontSize: fontSize * 1.25 }]}>Examples</Text>
            {vocabulary.examples.map((example, index) => (
              <View key={index} style={styles.exampleContainer}>
                <ThemedText type="arabic" style={[styles.arabicExample, { fontSize: fontSize * 1.13 }]}>{example.arabic}</ThemedText>
                <Text style={[styles.englishExample, { fontSize }]}>{example.english}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 20,
  },
  word: {
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  sectionContent: {
    lineHeight: 24,
  },
  infoLabel: {
    fontWeight: 'bold',
  },
  exampleContainer: {
    marginBottom: 15,
  },
  arabicExample: {
    marginBottom: 5,
    textAlign: 'right',
  },
  englishExample: {
    color: '#555',
  },
});