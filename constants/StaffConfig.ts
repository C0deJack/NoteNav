import type { NoteName } from '@/types/piano';

// Staff dimensions
export const STAFF_CONFIG = {
  width: 344,
  height: 235,
  lineSpacing: 24,
  noteRadius: 18,
  clefWidth: 78,
  leftPadding: 94,
  accidentalOffset: 38,
} as const;

// Note positions on the treble clef staff
// Position 0 = middle line (B), negative = below, positive = above
// Each step is one staff position (line or space)
export const NOTE_STAFF_POSITIONS: Record<NoteName, number> = {
  C: -6, // Middle C - ledger line below treble staff
  'C#': -6,
  D: -5,
  'D#': -5,
  E: -4, // Bottom line of treble staff
  F: -3,
  'F#': -3,
  G: -2,
  'G#': -2,
  A: -1,
  'A#': -1,
  B: 0, // Middle line of treble staff
};

// Treble clef SVG path (simplified)
export const TREBLE_CLEF_PATH =
  'M 12 50 C 12 35 20 25 20 15 C 20 5 12 0 8 5 C 4 10 8 20 12 25 C 16 30 20 35 20 45 C 20 55 16 65 12 70 C 8 75 4 75 4 70 C 4 65 8 60 12 55 C 16 50 20 45 20 35 C 20 25 16 20 12 20 C 8 20 4 25 4 30 C 4 35 8 40 12 45 L 12 80';

// Sharp symbol SVG path
export const SHARP_PATH =
  'M -3 -8 L -3 8 M 3 -8 L 3 8 M -6 -3 L 6 -3 M -6 3 L 6 3';

// Flat symbol SVG path
export const FLAT_PATH = 'M -2 -10 L -2 6 C -2 10 4 10 4 6 C 4 2 -2 2 -2 6';
