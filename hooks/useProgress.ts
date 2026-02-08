import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import type { DifficultyLevel, GameScore } from '@/types/piano';
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

  const getStats = useCallback(() => {
    if (scores.length === 0) {
      return {
        totalGames: 0,
        averageAccuracy: 0,
        bestSpeed: 0,
        averageScore: 0,
        bestScore: 0,
        totalTimePlayed: 0,
        gamesByDifficultyLevel: {} as Record<DifficultyLevel, number>,
      };
    }

    const totalGames = scores.length;
    const averageAccuracy = Math.round(
      scores.reduce((sum, s) => sum + s.accuracy, 0) / totalGames,
    );

    // Calculate speed stats (notes per minute)
    const speeds = scores.map((s) =>
      calculateNotesPerMinute(s.noteCount, s.elapsedMs),
    );
    const bestSpeed = Math.round(Math.max(...speeds));

    // Calculate progression scores
    const progressionScores = scores.map((s) => calculateScoreFromGame(s));
    const averageScore = Math.round(
      progressionScores.reduce((sum, s) => sum + s, 0) / totalGames,
    );
    const bestScore = Math.max(...progressionScores);

    const totalTimePlayed = scores.reduce((sum, s) => sum + s.elapsedMs, 0);

    const gamesByDifficultyLevel = scores.reduce(
      (acc, s) => {
        acc[s.difficultyLevel] = (acc[s.difficultyLevel] || 0) + 1;
        return acc;
      },
      {} as Record<DifficultyLevel, number>,
    );

    return {
      totalGames,
      averageAccuracy,
      bestSpeed,
      averageScore,
      bestScore,
      totalTimePlayed,
      gamesByDifficultyLevel,
    };
  }, [scores]);

  return {
    scores,
    loaded,
    addScore,
    resetProgress,
    getStats,
  };
}
