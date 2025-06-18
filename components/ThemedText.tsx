import React from 'react';
import { Text as DefaultText, StyleSheet } from 'react-native';
import { TextProps, useThemeColor } from './Themed'; // Import from existing Themed.tsx

// Define a type for the props, extending the existing TextProps
// and adding a 'type' prop for different text styles
export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'subtitle' | 'link' | 'arabic'; // Add 'arabic' type
};

export function ThemedText(props: ThemedTextProps) {
  const { style, lightColor, darkColor, type = 'default', ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  let textStyle;
  switch (type) {
    case 'title':
      textStyle = styles.title;
      break;
    case 'subtitle':
      textStyle = styles.subtitle;
      break;
    case 'link':
      textStyle = styles.link;
      break;
    case 'arabic': // Style for Arabic text
      textStyle = styles.arabic;
      break;
    default:
      textStyle = styles.default;
      break;
  }

  return <DefaultText style={[{ color }, textStyle, style]} {...otherProps} />;
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4', // Consider using theme color for links
  },
  arabic: {
    fontSize: 20, // Adjust size as needed
    fontFamily: 'Amiri-Regular', // Specify the Arabic font
    lineHeight: 30, // Adjust line height for Arabic text
  },
});