import {
  DIFFICULTIES,
  FLAT_SYMBOL,
  SHARP_SYMBOL,
} from '@/constants/PianoConfig';
import type { Difficulty, NoteName } from '@/types/piano';

/**
 * Gets the human-readable label for a difficulty level
 */
export function getDifficultyLabel(difficulty: Difficulty): string {
  return DIFFICULTIES.find((d) => d.value === difficulty)?.label ?? 'Unknown';
}

/**
 * Strips the octave suffix from a note name to get the base note.
 * e.g., 'C2' -> 'C', 'C#2' -> 'C#', 'D' -> 'D'
 */
export function getBaseNoteName(note: NoteName | string): string {
  return note.replace('2', '');
}

// Re-export symbols for convenience
export { FLAT_SYMBOL, SHARP_SYMBOL };

/**
 * Formats a note for display by converting accidental characters to musical symbols.
 * '#' -> '♯' (sharp) and 'b' -> '♭' (flat)
 * e.g., 'C#' -> 'C♯', 'Db' -> 'D♭'
 */
export function formatNoteAccidentals(note: string): string {
  return note.replace('#', SHARP_SYMBOL).replace('b', FLAT_SYMBOL);
}
