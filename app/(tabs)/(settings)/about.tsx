import { Text, View, StyleSheet, Linking, ScrollView } from 'react-native';
import { useSettings } from '@/contexts/SettingsContext';
import app from '../../../app.json';
import { Stack } from 'expo-router';
import { useTheme } from '@react-navigation/native';

export default function AboutScreen() {
  const { fontSize } = useSettings();
  const { colors } = useTheme();

  return (
    <>
      <Stack.Screen options={{ title: 'About' }} />
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.version, { color: colors.text, fontSize: fontSize * 1.2 }]}>Version {app.expo.version}</Text>

        <Text style={[styles.sectionTitle, { color: colors.text, fontSize: fontSize * 1.3 }]}>Privacy Policy</Text>
        <Text style={[styles.link, { fontSize: fontSize }]} onPress={() => Linking.openURL('https://your-privacy-policy-url.com')}>
          Read our Privacy Policy
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text, fontSize: fontSize * 1.3 }]}>Credits</Text>
        <Text style={[styles.creditText, { color: colors.text, fontSize: fontSize }]}>- React Native</Text>
        <Text style={[styles.creditText, { color: colors.text, fontSize: fontSize }]}>- Expo</Text>
        <Text style={[styles.creditText, { color: colors.text, fontSize: fontSize }]}>- TypeScript</Text>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 12,
  },
  version: {
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.8,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
  },
  link: {
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
  creditText: {
    marginBottom: 6,
    opacity: 0.8,
  },
});