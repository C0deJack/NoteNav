/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#4da6c7';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    border: '#ddd',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    border: '#3a3a3a',
  },
};

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
};
