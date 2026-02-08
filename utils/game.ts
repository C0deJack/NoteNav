import { DIFFICULTIES } from '@/constants/PianoConfig';
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
