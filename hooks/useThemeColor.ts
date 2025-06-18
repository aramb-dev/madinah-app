import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';

/**
 * Hook to get theme-specific colors.
 * @param props - Optional props object (currently unused but can be extended).
 * @param colorName - The name of the color property to retrieve from the theme (e.g., 'text', 'background').
 * @returns The color value for the current theme.
 */
export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  }
  return Colors[theme][colorName];
}