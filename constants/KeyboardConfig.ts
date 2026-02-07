/**
 * Piano keyboard layout configuration
 */
export const KEYBOARD_CONFIG = {
  /** Maximum keyboard width with second octave enabled */
  maxWidthWithSecondOctave: 800,
  /** Maximum keyboard width without second octave */
  maxWidthSingleOctave: 600,
  /** Maximum keyboard height in landscape mode */
  maxHeightLandscape: 180,
  /** Maximum keyboard height in portrait mode */
  maxHeightPortrait: 300,
  /** Horizontal padding around keyboard */
  horizontalPadding: 32,
  /** Black key width as percentage of white key width */
  blackKeyWidthRatio: 0.6,
  /** Black key height as percentage of keyboard height */
  blackKeyHeightRatio: 0.6,
  /** Keyboard height as percentage of width */
  heightToWidthRatio: 0.35,
} as const;

/**
 * Staff display configuration
 */
export const STAFF_ANIMATION_CONFIG = {
  /** X offset for note position on staff */
  noteXOffset: 100,
} as const;
