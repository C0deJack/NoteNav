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
  },
  dark: {
    text: '#ECEDEE',
    textMuted: '#9BA1A6',
    background: '#151718',
    surface: '#1f2123',
    primary: '#4da6c7',
    border: '#3a3a3a',
    icon: '#9BA1A6',
  },
} as const;

export type ColorName = keyof (typeof Colors)['light'];
export type Theme = keyof typeof Colors;

/**
 * Piano-specific colors (static, don't change with theme).
 * These are intentionally not theme-dependent for consistent game experience.
 */
export const PianoColors = {
  whiteKey: '#FFFFFF',
  whiteKeyPressed: '#E8E8E8',
  blackKey: '#1A1A1A',
  blackKeyPressed: '#333333',
  correctFeedback: '#4CAF50',
  incorrectFeedback: '#F44336',
  noteDisplay: '#2196F3',
  noteDisplayText: '#FFFFFF',
  keyBorder: '#CCCCCC',
} as const;
