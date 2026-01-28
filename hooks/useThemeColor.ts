/**
 * Unified theme hook for React Native.
 *
 * - Call with no arguments to get the full color palette for the current theme:
 *     const colors = useThemeColor();
 * - Call with a color name (and optional overrides) to get a specific color:
 *     const border = useThemeColor('border');
 *     const text = useThemeColor('text', { light: '#000', dark: '#fff' });
 */
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';

type Theme = 'light' | 'dark';
type ColorName = keyof typeof Colors.light & keyof typeof Colors.dark;
type Overrides = { light?: string; dark?: string };

export function useThemeColor(): typeof Colors.light;
export function useThemeColor(colorName: ColorName, overrides?: Overrides): string;
export function useThemeColor(
  colorNameOrNothing?: ColorName | Overrides,
  overrides?: Overrides,
): any {
  const theme: Theme = useColorScheme() ?? 'light';
  // No arguments: return full palette
  if (colorNameOrNothing === undefined) {
    return Colors[theme];
  }
  // If first arg is an object, treat as overrides for 'background'
  if (typeof colorNameOrNothing === 'object') {
    const colorFromProps = colorNameOrNothing[theme];
    return colorFromProps ?? Colors[theme].background;
  }
  // Otherwise, treat as color name
  const colorName = colorNameOrNothing as ColorName;
  const colorFromProps = overrides?.[theme];
  return colorFromProps ?? Colors[theme][colorName];
}
