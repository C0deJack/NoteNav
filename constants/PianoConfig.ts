import {
  ALL_NOTES,
  type Clef,
  type DifficultyLevel,
  type Note,
  type NoteCount,
  type NoteName,
  type PitchClass,
} from '@/types/piano';
import { getPitchClass } from '@/utils/notes';

/** Unicode sharp symbol (♯) */
export const SHARP_SYMBOL = '\u266F';

/** Unicode flat symbol (♭) */
export const FLAT_SYMBOL = '\u266D';

/** Sample file for each pitch class */
const SOUND_FILES: Record<PitchClass, string> = {
  C: 'c1.wav',
  'C#': 'c1s.wav',
  D: 'd1.wav',
  'D#': 'd1s.wav',
  E: 'e1.wav',
  F: 'f1.wav',
  'F#': 'f1s.wav',
  G: 'g1.wav',
  'G#': 'g1s.wav',
  A: 'a1.wav',
  'A#': 'a1s.wav',
  B: 'b1.wav',
};

// TODO: Add correct sound files for octave 5 notes (c2.wav, c2s.wav, etc.)
// Octave 5 currently uses the same sounds as octave 4. Notes below C4 are
// pitch-shifted by usePianoAudio until they get their own samples.
export const NOTES = Object.fromEntries(
  ALL_NOTES.map((name) => [
    name,
    {
      name,
      isBlack: name.includes('#'),
      soundFile: SOUND_FILES[getPitchClass(name)],
    },
  ]),
) as Record<NoteName, Omit<Note, 'displayName'>>;

// Display names for sharps (randomly pick sharp or flat notation)
export const SHARP_DISPLAY_NAMES: Partial<
  Record<PitchClass, [string, string]>
> = {
  'C#': ['C#', `D${FLAT_SYMBOL}`],
  'D#': ['D#', `E${FLAT_SYMBOL}`],
  'F#': ['F#', `G${FLAT_SYMBOL}`],
  'G#': ['G#', `A${FLAT_SYMBOL}`],
  'A#': ['A#', `B${FLAT_SYMBOL}`],
};

export const WHITE_KEYS: NoteName[] = [
  'C4',
  'D4',
  'E4',
  'F4',
  'G4',
  'A4',
  'B4',
];
export const BLACK_KEYS: NoteName[] = ['C#4', 'D#4', 'F#4', 'G#4', 'A#4'];

// Second octave keys (up to F5 on treble clef)
export const WHITE_KEYS_OCTAVE2: NoteName[] = ['C5', 'D5', 'E5', 'F5'];
export const BLACK_KEYS_OCTAVE2: NoteName[] = ['C#5', 'D#5'];

/** All notes between two notes, inclusive */
function noteRange(from: NoteName, to: NoteName): NoteName[] {
  return ALL_NOTES.slice(ALL_NOTES.indexOf(from), ALL_NOTES.indexOf(to) + 1);
}

const naturalsOnly = (notes: NoteName[]) =>
  notes.filter((n) => !n.includes('#'));

/**
 * Note pools for each clef and difficulty level.
 * Treble - Easy: C4 to G4, Medium: C4 to F5 (top line)
 * Bass - Easy: F3 to C4, Medium: G2 (bottom line) to C4
 * Hard and Expert use the Easy and Medium ranges with sharps/flats added.
 */
export const DIFFICULTY_NOTE_POOLS: Record<
  Clef,
  Record<DifficultyLevel, NoteName[]>
> = {
  treble: {
    easy: naturalsOnly(noteRange('C4', 'G4')),
    medium: naturalsOnly(noteRange('C4', 'F5')),
    hard: noteRange('C4', 'G4'),
    expert: noteRange('C4', 'F5'),
  },
  bass: {
    easy: naturalsOnly(noteRange('F3', 'C4')),
    medium: naturalsOnly(noteRange('G2', 'C4')),
    hard: noteRange('F3', 'C4'),
    expert: noteRange('G2', 'C4'),
  },
};

/** Difficulty level options */
export const DIFFICULTY_LEVELS: { value: DifficultyLevel; label: string }[] = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
  { value: 'expert', label: 'Expert' },
];

/** Note count options */
export const NOTE_COUNTS: { value: NoteCount; label: string }[] = [
  { value: 3, label: '3 notes' },
  { value: 10, label: '10 notes' },
  { value: 25, label: '25 notes' },
  { value: 100, label: '100 notes' },
];

export const ERROR_SOUND_FILE = 'kick.wav';

export const DEFAULT_CLEF: Clef = 'treble';
export const DEFAULT_DIFFICULTY_LEVEL: DifficultyLevel = 'easy';
export const DEFAULT_NOTE_COUNT: NoteCount = 10;
