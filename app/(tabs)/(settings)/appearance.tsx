import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useSettings } from '@/contexts/SettingsContext';
import { SegmentedControl } from '../../../components/SegmentedControl';
import Slider from '@react-native-community/slider'; // This import is correct
import { Stack } from 'expo-router';
import { useTheme } from '@react-navigation/native';

export default function AppearanceScreen() {
  const { theme, setTheme, fontSize, setFontSize } = useSettings();
  const { colors } = useTheme();

  const themeOptions = [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
    { label: 'System', value: 'system' },
  ];

  return (
    <>
      <Stack.Screen options={{ title: 'Appearance' }} />
      <View style={styles.container}>
        <View style={styles.section}>
          <Text style={[styles.heading, { color: colors.text }]}>Theme</Text>
          <SegmentedControl
            options={themeOptions}
            selectedValue={theme}
            onValueChange={(value) => setTheme(value as 'light' | 'dark' | 'system')}
          />
        </View>
        <View style={styles.section}>
          <Text style={[styles.heading, { color: colors.text }]}>Font Size</Text>
          <View style={styles.sliderContainer}>
            <Slider
              style={{ width: '100%' }}
              minimumValue={12}
              maximumValue={24}
              step={1}
              value={fontSize}
              onValueChange={setFontSize}
            />
            <Text style={{ color: colors.text, fontSize: fontSize }}>{fontSize.toFixed(0)}</Text>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sliderContainer: {
    alignItems: 'center',
  },
});