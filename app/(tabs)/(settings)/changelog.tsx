import { Stack } from 'expo-router';
import { StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useEffect, useState } from 'react';
import { ChangelogEntry } from '@/api/client'; // Assuming ChangelogEntry is still relevant or will be defined locally
import changelogData from '@/assets/changelog.json'; // Import local changelog data

export default function ChangelogScreen() {
  const [changelog, setChangelog] = useState<ChangelogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadChangelog = () => {
      try {
        setLoading(true);
        // Assuming changelogData is an array of ChangelogEntry
        setChangelog(changelogData as ChangelogEntry[]);
      } catch (err) {
        setError('Failed to load changelog from local file');
        console.error('Error loading changelog:', err);
      } finally {
        setLoading(false);
      }
    };

    loadChangelog();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading changelog...</Text>
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

  return (
    <>
      <Stack.Screen options={{ title: 'Changelog' }} />
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

        {changelog.map((entry, index) => (
          <View key={index} style={styles.changelogEntry}>
            <View style={styles.versionHeader}>
              <Text style={styles.versionText}>Version {entry.version}</Text>
              <Text style={styles.dateText}>{entry.date}</Text>
            </View>

            <View style={styles.changesContainer}>
              {entry.changes.map((change, changeIndex) => (
                <Text key={changeIndex} style={styles.changeText}>
                  • {change}
                </Text>
              ))}
            </View>
          </View>
        ))}

        {changelog.length === 0 && (
          <Text style={styles.noDataText}>No changelog entries available.</Text>
        )}
      </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: '100%',
  },
  changelogEntry: {
    width: '100%',
    marginBottom: 25,
    padding: 15,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  versionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  versionText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 14,
    opacity: 0.7,
  },
  changesContainer: {
    paddingLeft: 10,
  },
  changeText: {
    fontSize: 14,
    marginBottom: 5,
    lineHeight: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
    marginTop: 20,
  },
});