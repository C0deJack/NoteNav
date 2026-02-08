import type { GameScore } from '@/types/piano';

/**
 * Scoring weight configuration.
 * Adjust these values to change the balance between accuracy and speed.
 * Both weights should sum to 1.0 for a normalized score out of 100.
 */
export const SCORE_WEIGHTS = {
  /** Weight given to accuracy (0-1). Higher = accuracy matters more. */
  ACCURACY: 0.6,
  /** Weight given to speed (0-1). Higher = speed matters more. */
  SPEED: 0.4,
} as const;

/**
 * Speed scoring configuration.
 * Used to normalize notes-per-minute to a 0-100 scale.
 */
export const SPEED_CONFIG = {
  /** Notes per minute considered "baseline" (scores ~50) */
  BASELINE_NPM: 30,
  /** Notes per minute considered "excellent" (scores ~100) */
  EXCELLENT_NPM: 60,
  /** Minimum speed score (even for very slow play) */
  MIN_SCORE: 10,
  /** Maximum speed score cap */
  MAX_SCORE: 100,
} as const;

/**
 * Calculates notes per minute from game results.
 */
export function calculateNotesPerMinute(
  noteCount: number,
  elapsedMs: number,
): number {
  if (elapsedMs <= 0) return 0;
  const minutes = elapsedMs / 60000;
  return noteCount / minutes;
}

/**
 * Converts notes per minute to a normalized speed score (0-100).
 * Uses a linear scale between baseline and excellent speeds.
 */
export function calculateSpeedScore(notesPerMinute: number): number {
  const { BASELINE_NPM, EXCELLENT_NPM, MIN_SCORE, MAX_SCORE } = SPEED_CONFIG;

  if (notesPerMinute <= 0) return MIN_SCORE;

  // Linear interpolation between baseline (50) and excellent (100)
  const range = EXCELLENT_NPM - BASELINE_NPM;
  const aboveBaseline = notesPerMinute - BASELINE_NPM;
  const normalizedSpeed = 50 + (aboveBaseline / range) * 50;

  // Clamp to valid range
  return Math.round(Math.max(MIN_SCORE, Math.min(MAX_SCORE, normalizedSpeed)));
}

/**
 * Calculates a combined progression score based on accuracy and speed.
 * Returns a score from 0-100.
 */
export function calculateProgressionScore(
  accuracy: number,
  noteCount: number,
  elapsedMs: number,
): number {
  const notesPerMinute = calculateNotesPerMinute(noteCount, elapsedMs);
  const speedScore = calculateSpeedScore(notesPerMinute);

  const weightedScore =
    accuracy * SCORE_WEIGHTS.ACCURACY + speedScore * SCORE_WEIGHTS.SPEED;

  return Math.round(weightedScore);
}

/**
 * Calculates the progression score for a GameScore object.
 */
export function calculateScoreFromGame(score: GameScore): number {
  return calculateProgressionScore(
    score.accuracy,
    score.difficulty,
    score.elapsedMs,
  );
}

/**
 * Calculates average time per note in milliseconds.
 * Lower is better (faster).
 */
export function calculateAverageTimePerNote(
  noteCount: number,
  elapsedMs: number,
): number {
  if (noteCount <= 0) return 0;
  return elapsedMs / noteCount;
}

/**
 * Formats notes per minute for display.
 */
export function formatNotesPerMinute(npm: number): string {
  return `${Math.round(npm)} npm`;
}
