import { StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useEffect, useState } from 'react';
// Define ChangelogEntry interface locally as it will be based on git log output
export interface ChangelogEntry {
  hash: string;
  author: string;
  date: string;
  message: string;
}

// Placeholder function to simulate fetching and parsing git log
// In a real scenario, this would involve running `git log` and parsing its output.
// This might require a native module or a backend endpoint if running directly on the device is not feasible.
async function fetchGitLog(): Promise<ChangelogEntry[]> {
  console.log('fetchGitLog called. In a real app, this would execute `git log`.');
  // Simulate a delay and return mock data for now
  await new Promise(resolve => setTimeout(resolve, 1000));
  // This is example data. The actual implementation will need to parse git log output.
  return [
    {
      hash: 'a1b2c3d4',
      author: 'ExpoDev Agent',
      date: '2023-10-27',
      message: 'feat: Implement amazing new feature',
    },
    {
      hash: 'e5f6g7h8',
      author: 'ExpoDev Agent',
      date: '2023-10-26',
      message: 'fix: Corrected a critical bug',
    },
  ];
}

export default function ChangelogScreen() {
  const [changelog, setChangelog] = useState<ChangelogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadChangelog = async () => {
      try {
        setLoading(true);
        const data = await fetchGitLog(); // Use the new function to get git log data
        setChangelog(data);
      } catch (err) {
        setError('Failed to load changelog from git log');
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
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Changelog</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        
        {changelog.map((entry, index) => (
          <View key={entry.hash || index} style={styles.changelogEntry}>
            <View style={styles.versionHeader}>
              <Text style={styles.versionText}>{entry.message.split('\n')[0]}</Text> 
              <Text style={styles.dateText}>{entry.date}</Text>
            </View>
            <Text style={styles.authorText}>By: {entry.author}</Text>
            {entry.message.includes('\n') && (
              <Text style={styles.commitBodyText}>
                {entry.message.substring(entry.message.indexOf('\n') + 1)}
              </Text>
            )}
            <Text style={styles.hashText}>Commit: {entry.hash}</Text>
          </View>
        ))}
        
        {changelog.length === 0 && (
          <Text style={styles.noDataText}>No changelog entries available.</Text>
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
    fontSize: 16, // Adjusted for commit messages
    fontWeight: 'bold',
    flexShrink: 1, // Allow text to shrink if too long
    marginRight: 8, // Add some space between title and date
  },
  dateText: {
    fontSize: 12, // Adjusted for commit messages
    opacity: 0.7,
  },
  authorText: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 5,
  },
  commitBodyText: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
    fontStyle: 'italic',
    color: '#555',
  },
  hashText: {
    fontSize: 10,
    opacity: 0.5,
    marginTop: 5,
    fontFamily: 'monospace', // Use monospace for hash
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