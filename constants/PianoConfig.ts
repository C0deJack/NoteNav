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
  // Second octave (uses same sounds, maps to same keyboard keys)
  C2: { name: 'C2', isBlack: false, soundFile: 'c1.wav' },
  'C#2': { name: 'C#2', isBlack: true, soundFile: 'c1s.wav' },
  D2: { name: 'D2', isBlack: false, soundFile: 'd1.wav' },
  'D#2': { name: 'D#2', isBlack: true, soundFile: 'd1s.wav' },
  E2: { name: 'E2', isBlack: false, soundFile: 'e1.wav' },
  F2: { name: 'F2', isBlack: false, soundFile: 'f1.wav' },
  'F#2': { name: 'F#2', isBlack: true, soundFile: 'f1s.wav' },
};

// Display names for sharps (randomly pick sharp or flat notation)
export const SHARP_DISPLAY_NAMES: Record<string, [string, string]> = {
  'C#': ['C#', 'D♭'],
  'D#': ['D#', 'E♭'],
  'F#': ['F#', 'G♭'],
  'G#': ['G#', 'A♭'],
  'A#': ['A#', 'B♭'],
  // Second octave
  'C#2': ['C#', 'D♭'],
  'D#2': ['D#', 'E♭'],
  'F#2': ['F#', 'G♭'],
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
  // Second octave (for staff display, maps to same keyboard keys)
  'C2',
  'C#2',
  'D2',
  'D#2',
  'E2',
  'F2',
  'F#2',
];

export const WHITE_KEYS: NoteName[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
export const BLACK_KEYS: NoteName[] = ['C#', 'D#', 'F#', 'G#', 'A#'];

// Second octave keys (up to F2 on treble clef)
export const WHITE_KEYS_OCTAVE2: NoteName[] = ['C2', 'D2', 'E2', 'F2'];
export const BLACK_KEYS_OCTAVE2: NoteName[] = ['C#2', 'D#2', 'F#2'];

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
  // Second octave (not rendered on keyboard, but needed for type safety)
  C2: -1,
  'C#2': -1,
  D2: -1,
  'D#2': -1,
  E2: -1,
  F2: -1,
  'F#2': -1,
};

export const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: 3, label: 'Easy' },
  { value: 10, label: 'Medium' },
  { value: 25, label: 'Hard' },
  { value: 100, label: 'Expert' },
];

export const ERROR_SOUND_FILE = 'kick.wav';

export const DEFAULT_DIFFICULTY: Difficulty = 10;
