/**
 * Unified theme hook for the app.
 *
 * Provides:
 * - colors: The full color palette for the current theme
 * - colorScheme: 'light' | 'dark'
 * - isDark: Boolean convenience for dark mode checks
 *
 * Usage:
 *   const { colors, isDark } = useTheme();
 *   <View style={{ backgroundColor: colors.background }}>
 *     <Text style={{ color: colors.text }}>Hello</Text>
 *   </View>
 */
import { useColorScheme } from 'react-native';

import { type ColorName, Colors, type Theme } from '@/constants/Colors';

export interface ThemeContext {
  colors: (typeof Colors)['light'];
  colorScheme: Theme;
  isDark: boolean;
}

export function useTheme(): ThemeContext {
  const systemScheme = useColorScheme();
  const colorScheme: Theme = systemScheme === 'dark' ? 'dark' : 'light';

  return {
    colors: Colors[colorScheme],
    colorScheme,
    isDark: colorScheme === 'dark',
  };
}

/**
 * Get a single color value. Use useTheme() for multiple colors.
 * Kept for backwards compatibility with existing components.
 */
export function useThemeColor(colorName: ColorName): string {
  const { colors } = useTheme();
  return colors[colorName];
}

export type { ColorName, Theme };
