/**
 * Unified color palette for light and dark themes.
 *
 * Usage: Access via useTheme() hook which provides colors and colorScheme.
 *
 * Color naming convention:
 * - text: Primary text color
 * - textMuted: Secondary/dimmed text
 * - background: Screen/container backgrounds
 * - surface: Cards, modals, elevated surfaces
 * - primary: Brand/accent color for interactive elements
 * - border: Borders, dividers, separators
 * - icon: Default icon color
 */

export const Colors = {
  light: {
    text: '#11181C',
    textMuted: '#687076',
    background: '#fff',
    surface: '#f5f5f5',
    primary: '#0a7ea4',
    border: '#ddd',
    icon: '#687076',
    whiteKey: '#FFFFFF',
    blackKey: '#1A1A1A',
    correctFeedback: '#4CAF50',
    incorrectFeedback: '#F44336',
    noteDisplay: '#2196F3',
    noteDisplayText: '#FFFFFF',
    blackKeyBorder: '#444444',
    whiteKeyBorder: '#CCCCCC',
  },
  dark: {
    text: '#d7d9da',
    textMuted: '#9BA1A6',
    background: '#292a2b',
    surface: '#1f2123',
    primary: '#317993',
    border: '#3a3a3a',
    icon: '#9BA1A6',
    whiteKey: '#999999',
    blackKey: '#1A1A1A',
    correctFeedback: '#4CAF50',
    incorrectFeedback: '#F44336',
    noteDisplay: '#4da6c7',
    noteDisplayText: '#FFFFFF',
    blackKeyBorder: '#444444',
    whiteKeyBorder: '#CCCCCC',
  },
} as const;

export type ColorName = keyof (typeof Colors)['light'];
export type Theme = keyof typeof Colors;
