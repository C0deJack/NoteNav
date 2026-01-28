import type { Difficulty, Note, NoteName } from '@/types/piano';

export const NOTES: Record<NoteName, Omit<Note, 'displayName'>> = {
  C: { name: 'C', isBlack: false, soundFile: 'c1.wav' },
  'C#': { name: 'C#', isBlack: true, soundFile: 'c1s.wav' },
  D: { name: 'D', isBlack: false, soundFile: 'd1.wav' },
  'D#': { name: 'D#', isBlack: true, soundFile: 'd1s.wav' },
  E: { name: 'E', isBlack: false, soundFile: 'e1.wav' },
  F: { name: 'F', isBlack: false, soundFile: 'f1.wav' },
  'F#': { name: 'F#', isBlack: true, soundFile: 'f1s.wav' },
  G: { name: 'G', isBlack: false, soundFile: 'g1.wav' },
  'G#': { name: 'G#', isBlack: true, soundFile: 'g1s.wav' },
  A: { name: 'A', isBlack: false, soundFile: 'a1.wav' },
  'A#': { name: 'A#', isBlack: true, soundFile: 'a1s.wav' },
  B: { name: 'B', isBlack: false, soundFile: 'b1.wav' },
};

// Display names for sharps (randomly pick sharp or flat notation)
export const SHARP_DISPLAY_NAMES: Record<string, [string, string]> = {
  'C#': ['C#', 'D♭'],
  'D#': ['D#', 'E♭'],
  'F#': ['F#', 'G♭'],
  'G#': ['G#', 'A♭'],
  'A#': ['A#', 'B♭'],
};

// Order of keys on keyboard (left to right)
export const KEY_ORDER: NoteName[] = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
];

export const WHITE_KEYS: NoteName[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
export const BLACK_KEYS: NoteName[] = ['C#', 'D#', 'F#', 'G#', 'A#'];

// Black key positions relative to white keys (as percentage offset from left edge of preceding white key)
export const BLACK_KEY_POSITIONS: Record<NoteName, number> = {
  'C#': 0, // After C
  'D#': 1, // After D
  'F#': 3, // After F
  'G#': 4, // After G
  'A#': 5, // After A
  // These aren't black keys but TypeScript needs them
  C: -1,
  D: -1,
  E: -1,
  F: -1,
  G: -1,
  A: -1,
  B: -1,
};

export const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: 3, label: 'Easy' },
  { value: 10, label: 'Medium' },
  { value: 25, label: 'Hard' },
  { value: 100, label: 'Expert' },
];

export const ERROR_SOUND_FILE = 'kick.wav';

export const DEFAULT_DIFFICULTY: Difficulty = 10;
