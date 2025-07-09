import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/components/ThemeContext';
import { useFontSize } from '@/components/FontSizeContext';
import { ThemedText } from '@/components/ThemedText';
import { SegmentedControl } from '../../../components/SegmentedControl';
import Slider from '@react-native-community/slider'; // This import is correct
import { Stack } from 'expo-router';

export default function AppearanceScreen() {
  const { themePreference, setThemePreference } = useTheme();
  const { fontSize, setFontSize } = useFontSize();

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
          <ThemedText style={styles.heading}>Theme</ThemedText>
          <SegmentedControl
            options={themeOptions}
            selectedValue={themePreference}
            onValueChange={(value) => setThemePreference(value as any)}
          />
        </View>
        <View style={styles.section}>
          <ThemedText style={styles.heading}>Font Size</ThemedText>
          <View style={styles.sliderContainer}>
            <Slider
              style={{ width: '100%' }}
              minimumValue={12}
              maximumValue={24}
              step={1}
              value={fontSize}
              onSlidingComplete={setFontSize}
            />
            <ThemedText>{fontSize.toFixed(0)}</ThemedText>
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