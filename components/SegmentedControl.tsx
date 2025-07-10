import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { useTheme } from './ThemeContext';

interface Option {
  label: string;
  value: string;
}

interface SegmentedControlProps {
  options: Option[];
  selectedValue: string;
  onValueChange: (value: string) => void;
}

export function SegmentedControl({ options, selectedValue, onValueChange }: SegmentedControlProps) {
  const { effectiveTheme } = useTheme();

  return (
    <View style={[styles.container, { borderColor: effectiveTheme === 'dark' ? 'white' : 'black' }]}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.segment,
            selectedValue === option.value && {
              backgroundColor: effectiveTheme === 'dark' ? 'white' : 'black',
            },
          ]}
          onPress={() => onValueChange(option.value)}
        >
          <ThemedText
            style={{
              color: selectedValue === option.value
                ? (effectiveTheme === 'dark' ? 'black' : 'white')
                : (effectiveTheme === 'dark' ? 'white' : 'black'),
            }}
          >
            {option.label}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  segment: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});