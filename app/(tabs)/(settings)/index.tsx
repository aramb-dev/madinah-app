import React from 'react';
import { View, Text, StyleSheet, SectionList, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { useSettings } from '@/contexts/SettingsContext';
import * as app from '../../../app.json';

const settingsSections = [
  {
    title: 'General',
    data: [
      { name: 'Appearance', href: '/(tabs)/(settings)/appearance', icon: 'color-palette-outline' },
      { name: 'Notifications', href: '/(tabs)/(settings)/notifications', icon: 'notifications-outline' },
      { name: 'Learning', href: '/(tabs)/(settings)/learning', icon: 'school-outline' },
    ],
  },
  {
    title: 'Support',
    data: [
      { name: 'About', href: '/(tabs)/(settings)/about', icon: 'information-circle-outline' },
      { name: 'Changelog', href: '/(tabs)/(settings)/changelog', icon: 'document-text-outline' },
      { name: 'Help & Support', href: '/(tabs)/(settings)/support', icon: 'help-circle-outline' },
    ],
  },
];

const Settings = () => {
  const { colors } = useTheme();
  const { fontSize } = useSettings();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SectionList
        sections={settingsSections}
        keyExtractor={(item, index) => item.name + index}
        renderItem={({ item }) => (
          <Link href={item.href as any} asChild>
            <Pressable style={[styles.item, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.itemContent}>
                <View style={styles.itemLeft}>
                  <Ionicons
                    name={item.icon as any}
                    size={24}
                    color={colors.primary}
                    style={styles.itemIcon}
                  />
                  <Text style={[styles.itemText, { color: colors.text, fontSize: fontSize * 1.0 }]}>
                    {item.name}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={colors.text}
                />
              </View>
            </Pressable>
          </Link>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={[styles.sectionHeader, { color: colors.text, fontSize: fontSize * 0.9 }]}>{title}</Text>
        )}
        contentContainerStyle={styles.sectionListContent}
      />
      <Text style={[styles.version, { color: colors.text, fontSize: fontSize * 0.8 }]}>
        Version: {app.expo.version}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionListContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  sectionHeader: {
    paddingTop: 16,
    paddingBottom: 8,
    fontWeight: 'bold',
  },
  item: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    marginRight: 16,
  },
  itemText: {
    // fontSize is now set dynamically
  },
  version: {
    textAlign: 'center',
    padding: 16,
  },
});

export default Settings;