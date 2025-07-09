import { Text, View, StyleSheet, Linking, ScrollView } from 'react-native';
import { useTheme } from '../../components/ThemeContext';
import { useFontSize } from '../../components/FontSizeContext';
import app from '../../app.json';

export default function AboutScreen() {
  const { effectiveTheme } = useTheme();
  const { fontSize } = useFontSize();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: effectiveTheme === 'dark' ? '#1a1a1a' : '#fff',
      padding: 20,
    },
    title: {
      fontSize: fontSize * 1.5,
      fontWeight: 'bold',
      color: effectiveTheme === 'dark' ? '#fff' : '#000',
      marginBottom: 10,
      textAlign: 'center',
    },
    version: {
      fontSize: fontSize * 1.2,
      color: effectiveTheme === 'dark' ? '#ccc' : '#666',
      textAlign: 'center',
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: fontSize * 1.3,
      fontWeight: 'bold',
      color: effectiveTheme === 'dark' ? '#fff' : '#000',
      marginTop: 20,
      marginBottom: 10,
    },
    link: {
      fontSize: fontSize,
      color: '#007BFF',
      textDecorationLine: 'underline',
    },
    creditText: {
      fontSize: fontSize,
      color: effectiveTheme === 'dark' ? '#ccc' : '#333',
      marginBottom: 5,
    },
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{app.expo.name}</Text>
      <Text style={styles.version}>Version {app.expo.version}</Text>

      <Text style={styles.sectionTitle}>Privacy Policy</Text>
      <Text style={styles.link} onPress={() => Linking.openURL('https://your-privacy-policy-url.com')}>
        Read our Privacy Policy
      </Text>

      <Text style={styles.sectionTitle}>Credits</Text>
      <Text style={styles.creditText}>- React Native</Text>
      <Text style={styles.creditText}>- Expo</Text>
      <Text style={styles.creditText}>- TypeScript</Text>
    </ScrollView>
  );
}