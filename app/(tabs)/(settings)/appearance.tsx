import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text } from '../../../components/Themed';
import { ThemedText } from '../../../components/ThemedText';
import { useSettings } from '@/contexts/SettingsContext';
import { useFont, AVAILABLE_FONTS, FontOption } from '@/components/FontContext';
import { SegmentedControl } from '../../../components/SegmentedControl';
import Slider from '@react-native-community/slider';
import { Stack } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { useColorScheme } from '@/components/useColorScheme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';

// Platform-specific colors for consistency
const getBackgroundColors = (isDark: boolean) => ({
  primary: isDark ? '#1c1c1e' : '#f2f2f7',
  secondary: isDark ? '#2c2c2e' : '#ffffff',
  border: isDark ? '#38383a' : '#c6c6c8',
  text: isDark ? '#ffffff' : '#000000',
  secondaryText: isDark ? '#8e8e93' : '#6d6d70',
  accent: '#007AFF',
});

export default function AppearanceScreen() {
  const { theme, setTheme, fontSize, setFontSize } = useSettings();
  const { colors } = useTheme();
  const colorScheme = useColorScheme();
  const { selectedFont, setSelectedFont, isLoading } = useFont();

  // Use platform-appropriate colors
  const platformColors = getBackgroundColors(colorScheme === 'dark');

  const handleFontSelect = (font: FontOption) => {
    setSelectedFont(font);
  };

  const themeOptions = [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
    { label: 'System', value: 'system' },
  ];

  if (isLoading) {
    return (
      <>
        <Stack.Screen options={{ title: 'Appearance' }} />
        <View style={[styles.container, { backgroundColor: platformColors.primary }]}>
          <Text style={[styles.loadingText, { color: platformColors.text, fontSize: fontSize * 1.1 }]}>
            Loading...
          </Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Appearance' }} />
      <View style={[styles.container, { backgroundColor: platformColors.primary }]}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Theme Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderContainer}>
              <Text style={[
                styles.sectionHeader,
                {
                  color: platformColors.secondaryText,
                  fontSize: fontSize * 0.9,
                }
              ]}>
                THEME
              </Text>
            </View>
            <View style={[
              styles.sectionCard,
              {
                backgroundColor: platformColors.secondary,
                borderColor: platformColors.border,
              }
            ]}>
              <View style={styles.controlItem}>
                <SegmentedControl
                  options={themeOptions}
                  selectedValue={theme}
                  onValueChange={(value) => setTheme(value as 'light' | 'dark' | 'system')}
                />
              </View>
            </View>
          </View>

          {/* Font Size Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderContainer}>
              <Text style={[
                styles.sectionHeader,
                {
                  color: platformColors.secondaryText,
                  fontSize: fontSize * 0.9,
                }
              ]}>
                FONT SIZE
              </Text>
            </View>
            <View style={[
              styles.sectionCard,
              {
                backgroundColor: platformColors.secondary,
                borderColor: platformColors.border,
              }
            ]}>
              <View style={styles.controlItem}>
                <View style={styles.sliderContainer}>
                  <Slider
                    style={styles.slider}
                    minimumValue={12}
                    maximumValue={24}
                    step={1}
                    value={fontSize}
                    onValueChange={setFontSize}
                    minimumTrackTintColor={platformColors.accent}
                    maximumTrackTintColor={platformColors.border}
                    thumbTintColor={platformColors.accent}
                  />
                  <Text style={[
                    styles.fontSizeValue,
                    {
                      color: platformColors.text,
                      fontSize: fontSize * 0.9,
                    }
                  ]}>
                    {fontSize.toFixed(0)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Arabic Font Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderContainer}>
              <Text style={[
                styles.sectionHeader,
                {
                  color: platformColors.secondaryText,
                  fontSize: fontSize * 0.9,
                }
              ]}>
                ARABIC FONT
              </Text>
            </View>
            <View style={[
              styles.sectionCard,
              {
                backgroundColor: platformColors.secondary,
                borderColor: platformColors.border,
              }
            ]}>
              {AVAILABLE_FONTS.map((font, index) => (
                <Pressable
                  key={font.id}
                  style={[
                    styles.fontOption,
                    {
                      borderBottomColor: platformColors.border,
                      borderBottomWidth: index === AVAILABLE_FONTS.length - 1 ? 0 : StyleSheet.hairlineWidth,
                    }
                  ]}
                  onPress={() => handleFontSelect(font)}
                >
                  <View style={styles.fontOptionContent}>
                    <View style={styles.fontInfo}>
                      <Text style={[
                        styles.fontName,
                        {
                          color: platformColors.text,
                          fontSize: fontSize * 0.95,
                        }
                      ]}>
                        {font.name}
                      </Text>
                      <ThemedText
                        style={[
                          styles.fontPreview,
                          {
                            fontFamily: font.fontFamily,
                            fontSize: fontSize * 1.1,
                          }
                        ]}
                      >
                        العربية - مدينة العربية
                      </ThemedText>
                    </View>
                    <View style={styles.radioContainer}>
                      {selectedFont.id === font.id ? (
                        <FontAwesome
                          name="dot-circle-o"
                          size={20}
                          color={platformColors.accent}
                        />
                      ) : (
                        <FontAwesome
                          name="circle-o"
                          size={20}
                          color={platformColors.secondaryText}
                        />
                      )}
                    </View>
                  </View>
                </Pressable>
              ))}
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
  controlItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  slider: {
    flex: 1,
    height: 40,
    marginRight: 16,
  },
  fontSizeValue: {
    fontWeight: '600',
    minWidth: 30,
    textAlign: 'center',
  },
  fontOption: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  fontOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fontInfo: {
    flex: 1,
  },
  fontName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  fontPreview: {
    lineHeight: 24,
    textAlign: 'left',
  },
  radioContainer: {
    marginLeft: 12,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 40,
  },
});