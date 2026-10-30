import {
  DIFFICULTY_LEVELS,
  FLAT_SYMBOL,
  SHARP_SYMBOL,
} from '@/constants/PianoConfig';
import type { Clef, DifficultyLevel } from '@/types/piano';

/**
 * Gets the human-readable label for a difficulty level
 */
export function getDifficultyLabel(level: DifficultyLevel): string {
  return DIFFICULTY_LEVELS.find((d) => d.value === level)?.label ?? 'Unknown';
}

/**
 * Gets the human-readable label for a clef
 */
export function getClefLabel(clef: Clef): string {
  return clef === 'bass' ? 'Bass' : 'Treble';
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
