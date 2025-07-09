import React, { useContext } from 'react';
import { View, Text, StyleSheet, SectionList, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { useTheme } from '../../../components/ThemeContext';
import { useFontSize } from '../../../components/FontSizeContext';
import * as app from '../../../app.json';
import Colors from '../../../constants/Colors';

const सेटिंग्स = () => {
  const { effectiveTheme } = useTheme();
  const theme = Colors[effectiveTheme];
  const { fontSize } = useFontSize();

  const settingsSections = [
    {
      title: 'Appearance',
      data: [
        { name: 'Appearance', href: '/appearance' },
        { name: 'Notifications', href: '/notifications' },
      ],
    },
    {
      title: 'Learning Settings',
      data: [{ name: 'Learning', href: '/learning' }],
    },
    {
      title: 'Support & Feedback',
      data: [
        { name: 'Support', href: '/support' },
        { name: 'Changelog', href: '/changelog' },
      ],
    },
    {
      title: 'About',
      data: [{ name: 'About', href: '/about' }],
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SectionList
        sections={settingsSections}
        keyExtractor={(item, index) => item.name + index}
        renderItem={({ item }) => (
          <Link href={item.href as any} asChild>
            <Pressable style={[styles.item, { backgroundColor: theme.card }]}>
              <Text style={[styles.itemText, { color: theme.text, fontSize: fontSize * 1.2 }]}>{item.name}</Text>
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
    paddingTop: 20,
  },
  sectionHeader: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    fontWeight: 'bold',
    opacity: 0.7,
  },
  item: {
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  itemText: {
    fontWeight: 'bold',
  },
  version: {
    textAlign: 'center',
    padding: 20,
    opacity: 0.5,
  },
});

export default सेटिंग्स;