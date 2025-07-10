import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert, Platform } from 'react-native';
import { useSettings } from '@/contexts/SettingsContext';
import { Stack } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function RateScreen() {
  const { fontSize } = useSettings();
  const { colors } = useTheme();

  const handleRateApp = () => {
    const appId = 'YOUR_APP_ID'; // Replace with your actual app ID
    const appStoreUrl = Platform.OS === 'ios'
      ? `https://apps.apple.com/app/id${appId}?action=write-review`
      : `market://details?id=com.yourapp.package`; // Replace with your package name

    Alert.alert(
      'Rate This App',
      'Would you like to rate our app in the App Store?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Rate Now',
          onPress: () => Linking.openURL(appStoreUrl).catch(() => {
            Alert.alert('Error', 'Could not open the App Store');
          })
        },
      ]
    );
  };

  const handleShareApp = () => {
    // You can implement sharing functionality here
    Alert.alert('Share App', 'Sharing functionality coming soon!');
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Rate This App' }} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.content}>
          <Ionicons
            name="star"
            size={64}
            color="#FFD700"
            style={styles.starIcon}
          />

          <Text style={[styles.title, { color: colors.text, fontSize: fontSize * 1.4 }]}>
            Enjoying the app?
          </Text>

          <Text style={[styles.description, { color: colors.text, fontSize: fontSize }]}>
            Your feedback helps us improve and reach more learners. Please consider rating us on the App Store!
          </Text>

          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleRateApp}
          >
            <Ionicons name="star-outline" size={20} color="white" style={styles.buttonIcon} />
            <Text style={[styles.buttonText, { fontSize: fontSize }]}>Rate on App Store</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton, { borderColor: colors.border }]}
            onPress={handleShareApp}
          >
            <Ionicons name="share-outline" size={20} color={colors.primary} style={styles.buttonIcon} />
            <Text style={[styles.buttonText, styles.secondaryButtonText, { color: colors.primary, fontSize: fontSize }]}>
              Share with Friends
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 12,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  starIcon: {
    marginBottom: 24,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    opacity: 0.8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    width: '100%',
    maxWidth: 280,
  },
  primaryButton: {
    backgroundColor: '#007BFF',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    fontWeight: '600',
    color: 'white',
  },
  secondaryButtonText: {
    color: '#007BFF',
  },
});
