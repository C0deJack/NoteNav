import type { CustomColors } from '@/contexts/ThemeContext';

export const defaultBrandColors = {
  light: {
    highlight: '#bf4e30',
    primary: '#397367',
    secondary: '#f5f5f5',
    dark: '#1A1A1A',
    light: '#ffffff',
  },
  dark: {
    highlight: '#bf4e30',
    primary: '#397367',
    secondary: '#42858C',
    dark: '#1A1A1A',
    light: '#D7D9DA',
  },
};

function createColors(
  scheme: 'light' | 'dark',
  customColors: CustomColors = {},
) {
  const brand = {
    ...defaultBrandColors[scheme],
    ...customColors,
  };

  if (scheme === 'light') {
    return {
      text: '#11181C',
      textMuted: '#687076',
      background: brand.secondary,
      surface: 'rgb(194, 194, 194)',
      primary: brand.highlight,
      border: '#4e4e4e',
      icon: '#687076',
      whiteKey: '#FFFFFF',
      blackKey: '#1A1A1A',
      correctFeedback: brand.primary,
      incorrectFeedback: brand.highlight,
      noteDisplay: brand.highlight,
      noteDisplayText: brand.light,
      blackKeyBorder: '#444444',
      whiteKeyBorder: '#292929',
      staffBackground: '#FFFFFF',
      staffLine: '#11181C',
      staffNote: brand.highlight,
      staffAccidental: brand.highlight,
    };
  }

  return {
    text: '#d7d9da',
    textMuted: '#9BA1A6',
    background: brand.dark,
    surface: '#1f2123',
    primary: brand.highlight,
    border: '#3a3a3a',
    icon: '#9BA1A6',
    whiteKey: '#999999',
    blackKey: '#1A1A1A',
    correctFeedback: brand.primary,
    incorrectFeedback: brand.highlight,
    noteDisplay: brand.highlight,
    noteDisplayText: brand.light,
    blackKeyBorder: '#444444',
    whiteKeyBorder: '#CCCCCC',
    staffBackground: '#1A1A1A',
    staffLine: '#d7d9da',
    staffNote: brand.highlight,
    staffAccidental: brand.highlight,
  };
}

export const Colors = {
  light: createColors('light'),
  dark: createColors('dark'),
} as const;

export function getColors(
  scheme: 'light' | 'dark',
  customColors: CustomColors = {},
) {
  return createColors(scheme, customColors);
}

export type ColorName = keyof (typeof Colors)['light'];
export type Theme = keyof typeof Colors;
