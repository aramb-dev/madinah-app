import React from 'react';
import { View, StyleSheet, Switch, ScrollView } from 'react-native';
import { Text } from '../../../components/Themed';
import { useLearningContext } from '@/components/LearningContext';
import { SegmentedControl } from '@/components/SegmentedControl';
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

export default function LearningScreen() {
  const {
    autoPlayAudio,
    pronunciationSpeed,
    showTransliteration,
    setAutoPlayAudio,
    setPronunciationSpeed,
    setShowTransliteration,
  } = useLearningContext();
  const { fontSize } = useSettings();
  const { colors } = useTheme();
  const colorScheme = useColorScheme();

  // Use platform-appropriate colors
  const platformColors = getBackgroundColors(colorScheme === 'dark');

  return (
    <>
      <Stack.Screen options={{ title: 'Learning Settings' }} />
      <View style={[styles.container, { backgroundColor: platformColors.primary }]}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Audio Settings */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderContainer}>
              <Text style={[
                styles.sectionHeader,
                {
                  color: platformColors.secondaryText,
                  fontSize: fontSize * 0.9,
                }
              ]}>
                AUDIO SETTINGS
              </Text>
            </View>
            <View style={[
              styles.sectionCard,
              {
                backgroundColor: platformColors.secondary,
                borderColor: platformColors.border,
              }
            ]}>
              <View style={styles.settingItem}>
                <Text style={[
                  styles.settingText,
                  {
                    color: platformColors.text,
                    fontSize: fontSize * 1.0,
                  }
                ]}>
                  Auto-play Audio
                </Text>
                <Switch
                  value={autoPlayAudio}
                  onValueChange={setAutoPlayAudio}
                  trackColor={{
                    false: platformColors.border,
                    true: platformColors.accent,
                  }}
                  thumbColor={platformColors.secondary}
                />
              </View>

              <View style={[
                styles.settingItem,
                {
                  borderTopWidth: StyleSheet.hairlineWidth,
                  borderTopColor: platformColors.border,
                }
              ]}>
                <View style={styles.settingContent}>
                  <Text style={[
                    styles.settingText,
                    {
                      color: platformColors.text,
                      fontSize: fontSize * 1.0,
                      marginBottom: 8,
                    }
                  ]}>
                    Pronunciation Speed
                  </Text>
                  <SegmentedControl
                    options={[{ label: 'Normal', value: 'normal' }, { label: 'Slow', value: 'slow' }]}
                    selectedValue={pronunciationSpeed}
                    onValueChange={(value) =>
                      setPronunciationSpeed(value as 'normal' | 'slow')
                    }
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Display Settings */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderContainer}>
              <Text style={[
                styles.sectionHeader,
                {
                  color: platformColors.secondaryText,
                  fontSize: fontSize * 0.9,
                }
              ]}>
                DISPLAY SETTINGS
              </Text>
            </View>
            <View style={[
              styles.sectionCard,
              {
                backgroundColor: platformColors.secondary,
                borderColor: platformColors.border,
              }
            ]}>
              <View style={styles.settingItem}>
                <Text style={[
                  styles.settingText,
                  {
                    color: platformColors.text,
                    fontSize: fontSize * 1.0,
                  }
                ]}>
                  Show Transliteration
                </Text>
                <Switch
                  value={showTransliteration}
                  onValueChange={setShowTransliteration}
                  trackColor={{
                    false: platformColors.border,
                    true: platformColors.accent,
                  }}
                  thumbColor={platformColors.secondary}
                />
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
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  settingContent: {
    flex: 1,
  },
  settingText: {
    fontWeight: '500',
  },
});