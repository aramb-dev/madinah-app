import { View, StyleSheet, Linking, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from '../../../components/Themed';
import { ThemedText } from '../../../components/ThemedText';
import { useSettings } from '@/contexts/SettingsContext';
import { useColorScheme } from '@/components/useColorScheme';
import app from '../../../app.json';
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

export default function AboutScreen() {
  const { fontSize } = useSettings();
  const { colors } = useTheme();
  const colorScheme = useColorScheme();

  // Use platform-appropriate colors
  const platformColors = getBackgroundColors(colorScheme === 'dark');

  return (
    <>
      <Stack.Screen options={{ title: 'About' }} />
      <View style={[styles.container, { backgroundColor: platformColors.primary }]}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* App Icon and Title Section */}
          <View style={styles.appHeaderSection}>
            <View style={[
              styles.iconPlaceholder,
              {
                backgroundColor: platformColors.border,
                borderColor: platformColors.border,
              }
            ]}>
              <Ionicons
                name="apps"
                size={60}
                color={platformColors.secondaryText}
              />
            </View>
            <ThemedText style={[
              styles.appTitleArabic,
              {
                color: platformColors.text,
                fontSize: fontSize * 1.3,
              }
            ]}>
              المصادر المعينة على فهم كتب المدينة
            </ThemedText>
            <Text style={[
              styles.appTitleEnglish,
              {
                color: platformColors.secondaryText,
                fontSize: fontSize * 1.1,
              }
            ]}>
              Madinah Book Resources
            </Text>
          </View>

          {/* Version Section */}
          <View style={styles.section}>
            <View style={[
              styles.sectionCard,
              {
                backgroundColor: platformColors.secondary,
                borderColor: platformColors.border,
              }
            ]}>
              <View style={styles.versionItem}>
                <Text style={[
                  styles.versionText,
                  {
                    color: platformColors.text,
                    fontSize: fontSize * 1.1,
                  }
                ]}>
                  Version {app.expo.version}
                </Text>
              </View>
            </View>
          </View>

          {/* Privacy Policy Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderContainer}>
              <Text style={[
                styles.sectionHeader,
                {
                  color: platformColors.secondaryText,
                  fontSize: fontSize * 0.9,
                }
              ]}>
                PRIVACY
              </Text>
            </View>
            <View style={[
              styles.sectionCard,
              {
                backgroundColor: platformColors.secondary,
                borderColor: platformColors.border,
              }
            ]}>
              <TouchableOpacity
                style={styles.linkItem}
                onPress={() => Linking.openURL('https://your-privacy-policy-url.com')}
              >
                <Text style={[
                  styles.linkText,
                  {
                    color: platformColors.accent,
                    fontSize: fontSize * 1.0,
                  }
                ]}>
                  Privacy Policy
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Credits Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderContainer}>
              <Text style={[
                styles.sectionHeader,
                {
                  color: platformColors.secondaryText,
                  fontSize: fontSize * 0.9,
                }
              ]}>
                BUILT WITH
              </Text>
            </View>
            <View style={[
              styles.sectionCard,
              {
                backgroundColor: platformColors.secondary,
                borderColor: platformColors.border,
              }
            ]}>
              <View style={styles.creditItem}>
                <Text style={[
                  styles.creditText,
                  {
                    color: platformColors.text,
                    fontSize: fontSize * 1.0,
                  }
                ]}>
                  React Native
                </Text>
              </View>
              <View style={[
                styles.creditItem,
                {
                  borderTopWidth: StyleSheet.hairlineWidth,
                  borderTopColor: platformColors.border,
                }
              ]}>
                <Text style={[
                  styles.creditText,
                  {
                    color: platformColors.text,
                    fontSize: fontSize * 1.0,
                  }
                ]}>
                  Expo
                </Text>
              </View>
              <View style={[
                styles.creditItem,
                {
                  borderTopWidth: StyleSheet.hairlineWidth,
                  borderTopColor: platformColors.border,
                }
              ]}>
                <Text style={[
                  styles.creditText,
                  {
                    color: platformColors.text,
                    fontSize: fontSize * 1.0,
                  }
                ]}>
                  TypeScript
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
  appHeaderSection: {
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 24,
  },
  iconPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  appTitleArabic: {
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 32,
  },
  appTitleEnglish: {
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
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
  versionItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  versionText: {
    fontWeight: '600',
  },
  linkItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  linkText: {
    fontWeight: '500',
  },
  creditItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  creditText: {
    fontWeight: '500',
  },
});