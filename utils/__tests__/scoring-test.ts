import {
  calculateAverageTimePerNote,
  calculateNotesPerMinute,
  calculateProgressionScore,
  calculateScoreFromGame,
  calculateSpeedScore,
  formatNotesPerMinute,
  SCORE_WEIGHTS,
  SPEED_CONFIG,
} from '../scoring';

describe('SCORE_WEIGHTS', () => {
  it('has accuracy and speed weights that sum to 1', () => {
    expect(SCORE_WEIGHTS.ACCURACY + SCORE_WEIGHTS.SPEED).toBe(1);
  });

  it('has accuracy weight of 0.6', () => {
    expect(SCORE_WEIGHTS.ACCURACY).toBe(0.6);
  });

  it('has speed weight of 0.4', () => {
    expect(SCORE_WEIGHTS.SPEED).toBe(0.4);
  });
});

describe('SPEED_CONFIG', () => {
  it('has expected baseline npm', () => {
    expect(SPEED_CONFIG.BASELINE_NPM).toBe(30);
  });

  it('has expected excellent npm', () => {
    expect(SPEED_CONFIG.EXCELLENT_NPM).toBe(60);
  });

  it('has min score of 10', () => {
    expect(SPEED_CONFIG.MIN_SCORE).toBe(10);
  });

  it('has max score of 100', () => {
    expect(SPEED_CONFIG.MAX_SCORE).toBe(100);
  });
});

describe('calculateNotesPerMinute', () => {
  it('calculates correct npm for 60 notes in 60 seconds', () => {
    expect(calculateNotesPerMinute(60, 60000)).toBe(60);
  });

  it('calculates correct npm for 30 notes in 60 seconds', () => {
    expect(calculateNotesPerMinute(30, 60000)).toBe(30);
  });

  it('calculates correct npm for 10 notes in 30 seconds', () => {
    expect(calculateNotesPerMinute(10, 30000)).toBe(20);
  });

  it('returns 0 for 0 elapsed time', () => {
    expect(calculateNotesPerMinute(10, 0)).toBe(0);
  });

  it('returns 0 for negative elapsed time', () => {
    expect(calculateNotesPerMinute(10, -1000)).toBe(0);
  });
});

describe('calculateSpeedScore', () => {
  it('returns 50 for baseline npm (30)', () => {
    expect(calculateSpeedScore(30)).toBe(50);
  });

  it('returns 100 for excellent npm (60)', () => {
    expect(calculateSpeedScore(60)).toBe(100);
  });

  it('returns score between 50 and 100 for npm between baseline and excellent', () => {
    const score = calculateSpeedScore(45);
    expect(score).toBeGreaterThan(50);
    expect(score).toBeLessThan(100);
    expect(score).toBe(75); // Midpoint
  });

  it('returns min score for 0 npm', () => {
    expect(calculateSpeedScore(0)).toBe(SPEED_CONFIG.MIN_SCORE);
  });

  it('returns min score for negative npm', () => {
    expect(calculateSpeedScore(-10)).toBe(SPEED_CONFIG.MIN_SCORE);
  });

  it('caps at max score for very high npm', () => {
    expect(calculateSpeedScore(120)).toBe(SPEED_CONFIG.MAX_SCORE);
  });

  it('returns score below 50 for npm below baseline', () => {
    const score = calculateSpeedScore(15);
    expect(score).toBeLessThan(50);
    expect(score).toBeGreaterThanOrEqual(SPEED_CONFIG.MIN_SCORE);
  });
});

describe('calculateProgressionScore', () => {
  it('calculates weighted score correctly', () => {
    // 100% accuracy, 60 npm (100 speed score)
    // Score = 100 * 0.6 + 100 * 0.4 = 60 + 40 = 100
    const score = calculateProgressionScore(100, 60, 60000);
    expect(score).toBe(100);
  });

  it('weights accuracy more than speed', () => {
    // High accuracy (100%), low speed (10 npm = low score)
    const highAccuracyScore = calculateProgressionScore(100, 10, 60000);
    // Low accuracy (30%), high speed (60 npm = 100 score)
    const highSpeedScore = calculateProgressionScore(30, 60, 60000);

    // With 0.6 accuracy weight:
    // highAccuracyScore = 100 * 0.6 + lowSpeedScore * 0.4
    // highSpeedScore = 30 * 0.6 + 100 * 0.4 = 18 + 40 = 58
    expect(highAccuracyScore).toBeGreaterThan(highSpeedScore);
  });

  it('returns 0 for 0 accuracy and 0 speed', () => {
    const score = calculateProgressionScore(0, 0, 0);
    // 0 * 0.6 + MIN_SCORE * 0.4 = 4
    expect(score).toBe(
      Math.round(SPEED_CONFIG.MIN_SCORE * SCORE_WEIGHTS.SPEED),
    );
  });

  it('returns rounded score', () => {
    const score = calculateProgressionScore(75, 45, 60000);
    expect(Number.isInteger(score)).toBe(true);
  });
});

describe('calculateScoreFromGame', () => {
  it('calculates score from GameScore object', () => {
    const gameScore = {
      id: '1',
      difficultyLevel: 'easy' as const,
      noteCount: 10 as const,
      accuracy: 90,
      elapsedMs: 30000, // 30 seconds = 20 npm
      timestamp: Date.now(),
    };

    const score = calculateScoreFromGame(gameScore);
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('uses noteCount for speed calculation', () => {
    const shortGame = {
      id: '1',
      difficultyLevel: 'easy' as const,
      noteCount: 3 as const,
      accuracy: 100,
      elapsedMs: 6000, // 6 seconds for 3 notes = 30 npm
      timestamp: Date.now(),
    };

    const longGame = {
      id: '2',
      difficultyLevel: 'hard' as const,
      noteCount: 25 as const,
      accuracy: 100,
      elapsedMs: 50000, // 50 seconds for 25 notes = 30 npm
      timestamp: Date.now(),
    };

    // Same npm, same accuracy = same score
    expect(calculateScoreFromGame(shortGame)).toBe(
      calculateScoreFromGame(longGame),
    );
  });
});

describe('calculateAverageTimePerNote', () => {
  it('calculates correct average time', () => {
    expect(calculateAverageTimePerNote(10, 10000)).toBe(1000);
  });

  it('returns 0 for 0 notes', () => {
    expect(calculateAverageTimePerNote(0, 10000)).toBe(0);
  });

  it('handles fractional results', () => {
    expect(calculateAverageTimePerNote(3, 10000)).toBeCloseTo(3333.33, 0);
  });
});

describe('formatNotesPerMinute', () => {
  it('formats npm with "npm" suffix', () => {
    expect(formatNotesPerMinute(30)).toBe('30 npm');
  });

  it('rounds to nearest integer', () => {
    expect(formatNotesPerMinute(30.7)).toBe('31 npm');
    expect(formatNotesPerMinute(30.2)).toBe('30 npm');
  });
});
