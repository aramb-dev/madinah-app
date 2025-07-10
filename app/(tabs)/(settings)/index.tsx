import React from 'react';
import { View, Text, StyleSheet, SectionList, Pressable, ScrollView, Platform, useColorScheme } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { useSettings } from '@/contexts/SettingsContext';
import * as app from '../../../app.json';

// Platform-specific colors for consistency
const getBackgroundColors = (isDark: boolean) => ({
  primary: isDark ? '#1c1c1e' : '#f2f2f7',
  secondary: isDark ? '#2c2c2e' : '#ffffff',
  border: isDark ? '#38383a' : '#c6c6c8',
  text: isDark ? '#ffffff' : '#000000',
  secondaryText: isDark ? '#8e8e93' : '#6d6d70',
  accent: '#007AFF',
});

const settingsSections = [
  {
    title: 'CONTENT & LEARNING',
    data: [
      { name: 'Appearance', href: '/(tabs)/(settings)/appearance', icon: 'color-palette-outline' },
      { name: 'Notifications', href: '/(tabs)/(settings)/notifications', icon: 'notifications-outline' },
      { name: 'Learning Settings', href: '/(tabs)/(settings)/learning', icon: 'school-outline' },
    ],
  },
  {
    title: 'SUPPORT & INFO',
    data: [
      { name: 'Support & Feedback', href: '/(tabs)/(settings)/support', icon: 'help-circle-outline' },
      { name: 'Rate This App', href: '/(tabs)/(settings)/rate', icon: 'star-outline' },
      { name: 'About', href: '/(tabs)/(settings)/about', icon: 'information-circle-outline' },
      { name: 'Changelog', href: '/(tabs)/(settings)/changelog', icon: 'document-text-outline' },
    ],
  },
];

const Settings = () => {
  const { colors } = useTheme();
  const { fontSize } = useSettings();
  const colorScheme = useColorScheme();

  // Use platform-appropriate colors
  const platformColors = getBackgroundColors(colorScheme === 'dark');

  return (
    <View style={[styles.container, { backgroundColor: platformColors.primary }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {settingsSections.map((section, sectionIndex) => (
          <View key={section.title} style={styles.section}>
            <View style={[
              styles.sectionHeaderContainer,
              { marginTop: sectionIndex === 0 ? 0 : 24 }
            ]}>
              <Text style={[
                styles.sectionHeader,
                {
                  color: platformColors.secondaryText,
                  fontSize: fontSize * 0.9,
                }
              ]}>
                {section.title}
              </Text>
            </View>

            <View style={[
              styles.sectionCard,
              {
                backgroundColor: platformColors.secondary,
                borderColor: platformColors.border,
              }
            ]}>
              {section.data.map((item, index) => (
                <Link key={item.name} href={item.href as any} asChild>
                  <Pressable
                    android_ripple={{ color: platformColors.accent + '15' }}
                    style={({ pressed }) => [
                      styles.item,
                      {
                        borderBottomColor: platformColors.border,
                        borderBottomWidth: index === section.data.length - 1 ? 0 : StyleSheet.hairlineWidth,
                        backgroundColor: pressed ? platformColors.accent + '08' : 'transparent'
                      }
                    ]}
                  >
                    <View style={styles.itemContent}>
                      <View style={styles.iconContainer}>
                        <Ionicons
                          name={item.icon as keyof typeof Ionicons.glyphMap}
                          size={22}
                          color={platformColors.accent}
                        />
                      </View>
                      <View style={styles.itemTextContainer}>
                        <Text style={[
                          styles.itemText,
                          {
                            color: platformColors.text,
                            fontSize: fontSize * 1.0
                          }
                        ]}>
                          {item.name}
                        </Text>
                      </View>
                      <Ionicons
                        name="chevron-forward"
                        size={16}
                        color={platformColors.secondaryText}
                        style={styles.chevron}
                      />
                    </View>
                  </Pressable>
                </Link>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.footerContainer}>
          <View style={[
            styles.versionCard,
            {
              backgroundColor: platformColors.secondary,
              borderColor: platformColors.border,
            }
          ]}>
            <Ionicons
              name="information-circle-outline"
              size={18}
              color={platformColors.secondaryText}
              style={styles.versionIcon}
            />
            <Text style={[
              styles.version,
              {
                color: platformColors.secondaryText,
                fontSize: fontSize * 0.85
              }
            ]}>
              Version {app.expo.version}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeaderContainer: {
    marginBottom: 12,
  },
  sectionHeader: {
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    opacity: 0.7,
    marginLeft: 4,
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
  item: {
    paddingVertical: 24,
    paddingHorizontal: 32,
    minHeight: 72,
    marginVertical: 4,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemText: {
    fontWeight: '500',
    lineHeight: 20,
  },
  chevron: {
    opacity: 0.3,
    marginLeft: 12,
  },
  footerContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  versionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  versionIcon: {
    marginRight: 8,
    opacity: 0.6,
  },
  version: {
    fontWeight: '500',
    opacity: 0.7,
  },
});

export default Settings;