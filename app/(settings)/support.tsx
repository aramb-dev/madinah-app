import React, { useContext } from 'react';
import { Text, View, StyleSheet, Linking, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useTheme } from '../../components/ThemeContext';
import { useFontSize } from '../../components/FontSizeContext';
import { Stack } from 'expo-router';

export default function SupportScreen() {
  const { effectiveTheme } = useTheme();
  const { fontSize } = useFontSize();

  const handleSendFeedback = () => {
    Linking.openURL('mailto:support@yourapp.com?subject=App Feedback');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: effectiveTheme === 'dark' ? '#1a1a1a' : '#fff',
      padding: 20,
    },
    sectionTitle: {
      fontSize: fontSize * 1.3,
      fontWeight: 'bold',
      color: effectiveTheme === 'dark' ? '#fff' : '#000',
      marginTop: 20,
      marginBottom: 10,
    },
    faqItem: {
      marginBottom: 15,
    },
    faqQuestion: {
      fontSize: fontSize * 1.1,
      fontWeight: 'bold',
      color: effectiveTheme === 'dark' ? '#fff' : '#000',
    },
    faqAnswer: {
      fontSize: fontSize,
      color: effectiveTheme === 'dark' ? '#ccc' : '#333',
      marginTop: 5,
    },
    button: {
      backgroundColor: '#007BFF',
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 10,
    },
    buttonText: {
      color: '#fff',
      fontSize: fontSize,
      fontWeight: 'bold',
    },
  });

  return (
    <>
      <Stack.Screen options={{ title: 'Support & Feedback' }} />
      <ScrollView style={styles.container}>
        <Text style={styles.sectionTitle}>Help & FAQ</Text>
        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>How do I change the theme?</Text>
          <Text style={styles.faqAnswer}>You can change the theme in the "Appearance" settings.</Text>
        </View>
        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>How do I adjust the font size?</Text>
          <Text style={styles.faqAnswer}>You can adjust the font size in the "Appearance" settings.</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSendFeedback}>
          <Text style={styles.buttonText}>Send Feedback</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}