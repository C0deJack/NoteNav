import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { DIFFICULTY_LEVELS } from '@/constants/PianoConfig';
import type {
  DifficultyLevel,
  DifficultyStats,
  GameScore,
} from '@/types/piano';
import {
  calculateNotesPerMinute,
  calculateScoreFromGame,
} from '@/utils/scoring';

const PROGRESS_KEY = '@game_progress';

export function useProgress() {
  const [scores, setScores] = useState<GameScore[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadProgress() {
      try {
        const stored = await AsyncStorage.getItem(PROGRESS_KEY);
        if (stored) {
          setScores(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading progress:', error);
      } finally {
        setLoaded(true);
      }
    }

    loadProgress();
  }, []);

  const addScore = useCallback(
    async (score: Omit<GameScore, 'id' | 'timestamp'>) => {
      const newScore: GameScore = {
        ...score,
        id: Date.now().toString(),
        timestamp: Date.now(),
      };
      try {
        // Read current scores from storage to avoid stale state issues
        const stored = await AsyncStorage.getItem(PROGRESS_KEY);
        const currentScores: GameScore[] = stored ? JSON.parse(stored) : [];
        const updated = [newScore, ...currentScores];
        await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(updated));
        setScores(updated);
      } catch (error) {
        console.error('Error saving score:', error);
      }
      return newScore;
    },
    [],
  );

  const resetProgress = useCallback(async () => {
    setScores([]);
    try {
      await AsyncStorage.removeItem(PROGRESS_KEY);
    } catch (error) {
      console.error('Error resetting progress:', error);
    }
  }, []);

  const calculateStatsForScores = useCallback(
    (scoreList: GameScore[]): DifficultyStats => {
      if (scoreList.length === 0) {
        return {
          totalGames: 0,
          averageAccuracy: 0,
          bestSpeed: 0,
          averageScore: 0,
          bestScore: 0,
          totalTimePlayed: 0,
        };
      }

      const totalGames = scoreList.length;
      const averageAccuracy = Math.round(
        scoreList.reduce((sum, s) => sum + s.accuracy, 0) / totalGames,
      );

      const speeds = scoreList.map((s) =>
        calculateNotesPerMinute(s.noteCount, s.elapsedMs),
      );
      const bestSpeed = Math.round(Math.max(...speeds));

      const progressionScores = scoreList.map((s) => calculateScoreFromGame(s));
      const averageScore = Math.round(
        progressionScores.reduce((sum, s) => sum + s, 0) / totalGames,
      );
      const bestScore = Math.max(...progressionScores);

      const totalTimePlayed = scoreList.reduce(
        (sum, s) => sum + s.elapsedMs,
        0,
      );

      return {
        totalGames,
        averageAccuracy,
        bestSpeed,
        averageScore,
        bestScore,
        totalTimePlayed,
      };
    },
    [],
  );

  const getStats = useCallback(() => {
    return calculateStatsForScores(scores);
  }, [scores, calculateStatsForScores]);

  const getStatsByDifficultyLevel = useCallback(() => {
    const statsByLevel = {} as Record<DifficultyLevel, DifficultyStats>;

    for (const { value: level } of DIFFICULTY_LEVELS) {
      const levelScores = scores.filter((s) => s.difficultyLevel === level);
      statsByLevel[level] = calculateStatsForScores(levelScores);
    }

    return statsByLevel;
  }, [scores, calculateStatsForScores]);

  return {
    scores,
    loaded,
    addScore,
    resetProgress,
    getStats,
    getStatsByDifficultyLevel,
  };
}
