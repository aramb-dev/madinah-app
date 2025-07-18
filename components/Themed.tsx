import React from 'react';
import { Text as DefaultText, StyleSheet, TextProps as DefaultTextProps, View as DefaultView, ViewProps as DefaultViewProps } from 'react-native';
import { useSettings } from '../contexts/SettingsContext';
import Colors from '../constants/Colors';

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const { effectiveTheme } = useSettings();
  const colorFromProps = props[effectiveTheme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[effectiveTheme][colorName];
  }
}

export type TextProps = ThemeProps & DefaultTextProps & {
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'arabic';
};

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, type = 'default', ...otherProps } = props;
  const { effectiveTheme, fontSize } = useSettings();
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  const styles = StyleSheet.create({
    default: {
      fontSize: fontSize,
      color: color,
    },
    defaultSemiBold: {
        fontSize: fontSize,
        color: color,
        fontWeight: '600',
    },
    title: {
      fontSize: fontSize * 1.75,
      fontWeight: 'bold',
      color: color,
    },
    subtitle: {
        fontSize: fontSize * 1.25,
        fontWeight: 'bold',
        color: color,
    },
    link: {
      fontSize: fontSize,
      color: Colors.light.tint,
    },
    arabic: {
      fontSize: fontSize * 1.5,
      color: color,
      fontFamily: 'Amiri-Regular',
    }
  });

  return <DefaultText style={[styles[type], style]} {...otherProps} />;
}

export type ViewProps = ThemeProps & DefaultViewProps;

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}
