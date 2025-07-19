import React from 'react';
import { View, StyleSheet, Linking, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Text } from '../../../components/Themed';
import { useSettings } from '@/contexts/SettingsContext';
import { useColorScheme } from '@/components/useColorScheme';
import { Stack } from 'expo-router';
import { useTheme } from '@react-navigation/native';

// Platform-specific colors for consistency
const getBackgroundColors = (isDark: boolean) => ({
  primary: isDark ? '#1c1c1e' : '#f2f2f7',
  secondary: isDark ? '#2c2c2e' : '#ffffff',
  border: isDark ? '#38383a' : '#c6c6c8',
  text: isDark ? '#ffffff' : '#000000',
  secondaryText: isDark ? '#8e8e93' : '#6d6d70',
  accent: '#007AFF',
});

export default function SupportScreen() {
  const { fontSize } = useSettings();
  const { colors } = useTheme();
  const colorScheme = useColorScheme();

  // Use platform-appropriate colors
  const platformColors = getBackgroundColors(colorScheme === 'dark');

  const handleSendFeedback = () => {
    Linking.openURL('mailto:support@yourapp.com?subject=App Feedback');
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Support & Feedback' }} />
      <View style={[styles.container, { backgroundColor: platformColors.primary }]}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* FAQ Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderContainer}>
              <Text style={[
                styles.sectionHeader,
                {
                  color: platformColors.secondaryText,
                  fontSize: fontSize * 0.9,
                }
              ]}>
                FREQUENTLY ASKED QUESTIONS
              </Text>
            </View>
            <View style={[
              styles.sectionCard,
              {
                backgroundColor: platformColors.secondary,
                borderColor: platformColors.border,
              }
            ]}>
              <View style={styles.faqItem}>
                <Text style={[
                  styles.faqQuestion,
                  {
                    color: platformColors.text,
                    fontSize: fontSize * 1.0,
                  }
                ]}>
                  How do I change the theme?
                </Text>
                <Text style={[
                  styles.faqAnswer,
                  {
                    color: platformColors.secondaryText,
                    fontSize: fontSize * 0.9,
                  }
                ]}>
                  You can change the theme in the "Appearance" settings.
                </Text>
              </View>

              <View style={[
                styles.faqItem,
                {
                  borderTopWidth: StyleSheet.hairlineWidth,
                  borderTopColor: platformColors.border,
                }
              ]}>
                <Text style={[
                  styles.faqQuestion,
                  {
                    color: platformColors.text,
                    fontSize: fontSize * 1.0,
                  }
                ]}>
                  How do I adjust the font size?
                </Text>
                <Text style={[
                  styles.faqAnswer,
                  {
                    color: platformColors.secondaryText,
                    fontSize: fontSize * 0.9,
                  }
                ]}>
                  You can adjust the font size in the "Appearance" settings.
                </Text>
              </View>
            </View>
          </View>

          {/* Contact Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderContainer}>
              <Text style={[
                styles.sectionHeader,
                {
                  color: platformColors.secondaryText,
                  fontSize: fontSize * 0.9,
                }
              ]}>
                CONTACT US
              </Text>
            </View>
            <View style={[
              styles.sectionCard,
              {
                backgroundColor: platformColors.secondary,
                borderColor: platformColors.border,
              }
            ]}>
              <TouchableOpacity style={styles.contactItem} onPress={handleSendFeedback}>
                <Text style={[
                  styles.contactText,
                  {
                    color: platformColors.accent,
                    fontSize: fontSize * 1.0,
                  }
                ]}>
                  Send Feedback
                </Text>
              </TouchableOpacity>
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
  faqItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  faqQuestion: {
    fontWeight: '600',
    marginBottom: 8,
  },
  faqAnswer: {
    lineHeight: 20,
  },
  contactItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  contactText: {
    fontWeight: '500',
  },
});