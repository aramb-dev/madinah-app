import React from 'react';
import { View, StyleSheet, ScrollView, Linking, TouchableOpacity, Alert } from 'react-native';
import { Text } from '../../../components/Themed';
import { useSettings } from '@/contexts/SettingsContext';
import { useColorScheme } from '@/components/useColorScheme';
import { Stack } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Platform-specific colors for consistency
const getBackgroundColors = (isDark: boolean) => ({
  primary: isDark ? '#1c1c1e' : '#f2f2f7',
  secondary: isDark ? '#2c2c2e' : '#ffffff',
  border: isDark ? '#38383a' : '#c6c6c8',
  text: isDark ? '#ffffff' : '#000000',
  secondaryText: isDark ? '#8e8e93' : '#6d6d70',
  accent: '#007AFF',
});

export default function RateScreen() {
  const { fontSize } = useSettings();
  const { colors } = useTheme();
  const colorScheme = useColorScheme();

  // Use platform-appropriate colors
  const platformColors = getBackgroundColors(colorScheme === 'dark');

  const handleRateApp = () => {
    // This would typically open the App Store rating page
    Alert.alert(
      'Rate This App',
      'Thank you for your feedback! This would normally redirect to the App Store.',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const handleFeedback = () => {
    const email = 'feedback@madinahbookresources.com';
    const subject = 'App Feedback';
    const body = 'I would like to provide feedback about the Madinah Book Resources app:';

    Linking.openURL(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Rate This App' }} />
      <View style={[styles.container, { backgroundColor: platformColors.primary }]}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* App Rating Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderContainer}>
              <Text style={[
                styles.sectionHeader,
                {
                  color: platformColors.secondaryText,
                  fontSize: fontSize * 0.9,
                }
              ]}>
                RATE & REVIEW
              </Text>
            </View>
            <View style={[
              styles.sectionCard,
              {
                backgroundColor: platformColors.secondary,
                borderColor: platformColors.border,
              }
            ]}>
              <TouchableOpacity style={styles.actionItem} onPress={handleRateApp}>
                <View style={styles.actionContent}>
                  <View style={styles.actionIcon}>
                    <Ionicons name="star" size={24} color={platformColors.accent} />
                  </View>
                  <View style={styles.actionTextContainer}>
                    <Text style={[
                      styles.actionTitle,
                      {
                        color: platformColors.text,
                        fontSize: fontSize * 1.0,
                      }
                    ]}>
                      Rate on App Store
                    </Text>
                    <Text style={[
                      styles.actionDescription,
                      {
                        color: platformColors.secondaryText,
                        fontSize: fontSize * 0.9,
                      }
                    ]}>
                      Share your experience with other users
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Feedback Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderContainer}>
              <Text style={[
                styles.sectionHeader,
                {
                  color: platformColors.secondaryText,
                  fontSize: fontSize * 0.9,
                }
              ]}>
                FEEDBACK
              </Text>
            </View>
            <View style={[
              styles.sectionCard,
              {
                backgroundColor: platformColors.secondary,
                borderColor: platformColors.border,
              }
            ]}>
              <TouchableOpacity style={styles.actionItem} onPress={handleFeedback}>
                <View style={styles.actionContent}>
                  <View style={styles.actionIcon}>
                    <Ionicons name="mail" size={24} color={platformColors.accent} />
                  </View>
                  <View style={styles.actionTextContainer}>
                    <Text style={[
                      styles.actionTitle,
                      {
                        color: platformColors.text,
                        fontSize: fontSize * 1.0,
                      }
                    ]}>
                      Send Feedback
                    </Text>
                    <Text style={[
                      styles.actionDescription,
                      {
                        color: platformColors.secondaryText,
                        fontSize: fontSize * 0.9,
                      }
                    ]}>
                      Help us improve the app
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Appreciation Message */}
          <View style={styles.section}>
            <View style={[
              styles.sectionCard,
              {
                backgroundColor: platformColors.secondary,
                borderColor: platformColors.border,
              }
            ]}>
              <View style={styles.messageItem}>
                <Text style={[
                  styles.messageText,
                  {
                    color: platformColors.text,
                    fontSize: fontSize * 1.0,
                  }
                ]}>
                  Thank you for using Madinah Book Resources! Your feedback helps us create a better learning experience for everyone.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeaderContainer: {
    paddingHorizontal: 4,
    paddingBottom: 6,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '400',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  actionItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    marginRight: 16,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontWeight: '500',
    marginBottom: 4,
  },
  actionDescription: {
    lineHeight: 18,
  },
  messageItem: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  messageText: {
    textAlign: 'center',
    lineHeight: 24,
  },
});