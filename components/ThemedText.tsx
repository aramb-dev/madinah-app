import React from 'react';
import { Text as DefaultText, StyleSheet } from 'react-native';
import { TextProps, useThemeColor } from './Themed'; // Import from existing Themed.tsx
import { useFont } from './FontContext';
import { useSettings } from '@/contexts/SettingsContext';

// Define a type for the props, extending the existing TextProps
// and adding a 'type' prop for different text styles
export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'subtitle' | 'link' | 'arabic'; // Add 'arabic' type
};

export function ThemedText(props: ThemedTextProps) {
  const { style, lightColor, darkColor, type = 'default', ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const { selectedFont } = useFont();
  const { fontSize } = useSettings();

  let textStyle;
  switch (type) {
    case 'title':
      textStyle = [styles.title, { fontSize: fontSize * 2 }];
      break;
    case 'subtitle':
      textStyle = [styles.subtitle, { fontSize: fontSize * 1.25 }];
      break;
    case 'link':
      textStyle = [styles.link, { fontSize }];
      break;
    case 'arabic': // Style for Arabic text
      textStyle = [styles.arabic, { fontFamily: selectedFont.fontFamily, fontSize: fontSize * 1.25 }];
      break;
    default:
      textStyle = [styles.default, { fontSize }];
      break;
  }

  return <DefaultText style={[{ color }, textStyle, style]} {...otherProps} />;
}

const styles = StyleSheet.create({
  default: {
    lineHeight: 24,
  },
  title: {
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    color: '#0a7ea4', // Consider using theme color for links
  },
  arabic: {
    // fontFamily will be set dynamically
    lineHeight: 30, // Adjust line height for Arabic text
  },
});