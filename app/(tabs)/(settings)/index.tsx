import React, { useContext } from 'react';
import { View, Text, StyleSheet, SectionList, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../components/ThemeContext';
import { useFontSize } from '../../../components/FontSizeContext';
import * as app from '../../../app.json';
import Colors from '../../../constants/Colors';

const Settings = () => {
  const { effectiveTheme } = useTheme();
  const theme = Colors[effectiveTheme];
  const { fontSize } = useFontSize();

  const settingsSections = [
    {
      title: 'Appearance',
      data: [
        { name: 'Appearance', href: './appearance', icon: 'color-palette-outline' },
        { name: 'Notifications', href: './notifications', icon: 'notifications-outline' },
      ],
    },
    {
      title: 'Learning Settings',
      data: [{ name: 'Learning', href: './learning', icon: 'school-outline' }],
    },
    {
      title: 'Support & Feedback',
      data: [
        { name: 'Support', href: './support', icon: 'help-circle-outline' },
        { name: 'Changelog', href: './changelog', icon: 'document-text-outline' },
      ],
    },
    {
      title: 'About',
      data: [{ name: 'About', href: './about', icon: 'information-circle-outline' }],
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SectionList
        sections={settingsSections}
        keyExtractor={(item, index) => item.name + index}
        renderItem={({ item }) => (
          <Link href={item.href as any} asChild>
            <Pressable style={[styles.item, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={styles.itemContent}>
                <View style={styles.itemLeft}>
                  <Ionicons
                    name={item.icon as any}
                    size={24}
                    color={theme.tint}
                    style={styles.itemIcon}
                  />
                  <Text style={[styles.itemText, { color: theme.text, fontSize: fontSize * 1.0 }]}>
                    {item.name}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.tabIconDefault}
                />
              </View>
            </Pressable>
          </Link>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={[styles.sectionHeader, { color: theme.text, fontSize: fontSize * 0.9 }]}>{title}</Text>
        )}
      />
      <Text style={[styles.version, { color: theme.text, fontSize: fontSize * 0.8 }]}>
        Version: {app.expo.version}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    paddingTop: 20,
    fontWeight: '600',
    opacity: 0.8,
    textTransform: 'uppercase',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  item: {
    marginHorizontal: 16,
    marginVertical: 2,
    borderRadius: 12,
    borderWidth: 0.5,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemIcon: {
    marginRight: 12,
  },
  itemText: {
    fontWeight: '500',
    flex: 1,
  },
  version: {
    textAlign: 'center',
    padding: 20,
    opacity: 0.5,
    fontSize: 12,
  },
});

export default Settings;