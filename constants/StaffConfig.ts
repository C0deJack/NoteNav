import type { Clef, NoteName } from '@/types/piano';
import { getOctave } from '@/utils/notes';

// Staff dimensions
export const STAFF_CONFIG = {
  width: 520,
  height: 235,
  lineSpacing: 24,
  noteRadius: 18,
  clefWidth: 78,
  leftPadding: 30,
  accidentalOffset: 38,
} as const;

const LETTER_STEPS: Record<string, number> = {
  C: 0,
  D: 1,
  E: 2,
  F: 3,
  G: 4,
  A: 5,
  B: 6,
};

/** Diatonic steps above C0, so each line or space is one step */
function diatonicStep(note: NoteName): number {
  return getOctave(note) * 7 + LETTER_STEPS[note.charAt(0)];
}

/** The note on the middle line of each staff */
const MIDDLE_LINE_NOTE: Record<Clef, NoteName> = {
  treble: 'B4',
  bass: 'D3',
};

/**
 * Position of a note on the staff.
 * Position 0 = middle line, negative = below, positive = above.
 * Each step is one staff position (line or space), so lines are even.
 * Sharps share their natural's position (C#4 sits on C4).
 * e.g. treble: C4 = -6 (ledger below), F5 = 4 (top line)
 *      bass:   G2 = -4 (bottom line), C4 = 6 (ledger above)
 */
export function getStaffPosition(note: NoteName, clef: Clef): number {
  return diatonicStep(note) - diatonicStep(MIDDLE_LINE_NOTE[clef]);
}

/**
 * Letter labels for each staff position, shown when the info button is held.
 * Covers the five lines, the spaces between, one space above and below, and
 * middle C's ledger line.
 */
export const STAFF_LABELS: Record<Clef, Record<number, string>> = {
  treble: {
    '-6': 'C',
    '-5': 'D',
    '-4': 'E',
    '-3': 'F',
    '-2': 'G',
    '-1': 'A',
    '0': 'B',
    '1': 'C',
    '2': 'D',
    '3': 'E',
    '4': 'F',
  },
  bass: {
    '-4': 'G',
    '-3': 'A',
    '-2': 'B',
    '-1': 'C',
    '0': 'D',
    '1': 'E',
    '2': 'F',
    '3': 'G',
    '4': 'A',
    '5': 'B',
    '6': 'C',
  },
};

// Treble clef SVG path (simplified)
export const TREBLE_CLEF_PATH =
  'M 12 50 C 12 35 20 25 20 15 C 20 5 12 0 8 5 C 4 10 8 20 12 25 C 16 30 20 35 20 45 C 20 55 16 65 12 70 C 8 75 4 75 4 70 C 4 65 8 60 12 55 C 16 50 20 45 20 35 C 20 25 16 20 12 20 C 8 20 4 25 4 30 C 4 35 8 40 12 45 L 12 80';

// Sharp symbol SVG path
export const SHARP_PATH =
  'M -3 -8 L -3 8 M 3 -8 L 3 8 M -6 -3 L 6 -3 M -6 3 L 6 3';

// Flat symbol SVG path
export const FLAT_PATH = 'M -2 -10 L -2 6 C -2 10 4 10 4 6 C 4 2 -2 2 -2 6';
