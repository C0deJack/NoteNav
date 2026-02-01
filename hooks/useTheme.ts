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
import { type ColorName, getColors, type Theme } from '@/constants/Colors';
import { useThemeContext } from '@/contexts/ThemeContext';

export interface ThemeContextValue {
  colors: ReturnType<typeof getColors>;
  colorScheme: Theme;
  isDark: boolean;
}

export function useTheme(): ThemeContextValue {
  const { resolvedScheme, customColors, isCustomMode } = useThemeContext();

  return {
    colors: getColors(resolvedScheme, isCustomMode ? customColors : {}),
    colorScheme: resolvedScheme,
    isDark: resolvedScheme === 'dark',
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
