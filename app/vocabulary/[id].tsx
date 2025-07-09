import { Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
        <Text style={styles.word}>{vocabulary.word}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Translation</Text>
          <Text style={styles.sectionContent}>{vocabulary.translation.en}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Information</Text>
          {vocabulary.type && <Text style={styles.sectionContent}><Text style={styles.infoLabel}>Type:</Text> {vocabulary.type}</Text>}
          {vocabulary.plural && <Text style={styles.sectionContent}><Text style={styles.infoLabel}>Plural:</Text> {vocabulary.plural}</Text>}
          {vocabulary.transliteration && <Text style={styles.sectionContent}><Text style={styles.infoLabel}>Transliteration:</Text> {vocabulary.transliteration}</Text>}
        </View>

        {vocabulary.definition && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Definition</Text>
            <Text style={styles.sectionContent}>{vocabulary.definition}</Text>
          </View>
        )}

        {vocabulary.examples && vocabulary.examples.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Examples</Text>
            {vocabulary.examples.map((example, index) => (
              <View key={index} style={styles.exampleContainer}>
                <Text style={styles.arabicExample}>{example.arabic}</Text>
                <Text style={styles.englishExample}>{example.english}</Text>
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
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 24,
  },
  infoLabel: {
    fontWeight: 'bold',
  },
  exampleContainer: {
    marginBottom: 15,
  },
  arabicExample: {
    fontSize: 18,
    marginBottom: 5,
    textAlign: 'right',
  },
  englishExample: {
    fontSize: 16,
    color: '#555',
  },
});