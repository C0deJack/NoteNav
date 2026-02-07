import { DIFFICULTIES } from '@/constants/PianoConfig';
import type { Difficulty } from '@/types/piano';

/**
 * Gets the human-readable label for a difficulty level
 */
export function getDifficultyLabel(difficulty: Difficulty): string {
  return DIFFICULTIES.find((d) => d.value === difficulty)?.label ?? 'Unknown';
}
