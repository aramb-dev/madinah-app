import React from 'react';
import { Text, View, StyleSheet, Linking, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useSettings } from '@/contexts/SettingsContext';
import { Stack } from 'expo-router';
import { useTheme } from '@react-navigation/native';

export default function SupportScreen() {
  const { fontSize } = useSettings();
  const { colors } = useTheme();

  const handleSendFeedback = () => {
    Linking.openURL('mailto:support@yourapp.com?subject=App Feedback');
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Support & Feedback' }} />
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.sectionTitle, { color: colors.text, fontSize: fontSize * 1.3 }]}>Help & FAQ</Text>
        <View style={styles.faqItem}>
          <Text style={[styles.faqQuestion, { color: colors.text, fontSize: fontSize * 1.1 }]}>How do I change the theme?</Text>
          <Text style={[styles.faqAnswer, { color: colors.text, fontSize: fontSize }]}>You can change the theme in the "Appearance" settings.</Text>
        </View>
        <View style={styles.faqItem}>
          <Text style={[styles.faqQuestion, { color: colors.text, fontSize: fontSize * 1.1 }]}>How do I adjust the font size?</Text>
          <Text style={[styles.faqAnswer, { color: colors.text, fontSize: fontSize }]}>You can adjust the font size in the "Appearance" settings.</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSendFeedback}>
          <Text style={[styles.buttonText, { fontSize: fontSize }]}>Send Feedback</Text>
        </TouchableOpacity>
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
  sectionTitle: {
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 12,
  },
  faqItem: {
    marginBottom: 20,
  },
  faqQuestion: {
    fontWeight: 'bold',
  },
  faqAnswer: {
    marginTop: 6,
    opacity: 0.8,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});