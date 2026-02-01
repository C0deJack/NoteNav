import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import type { Difficulty, GameScore } from '@/types/piano';

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
      const updated = [newScore, ...scores];
      setScores(updated);
      try {
        await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Error saving score:', error);
      }
      return newScore;
    },
    [scores],
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
        bestAccuracy: 0,
        totalTimePlayed: 0,
        gamesByDifficulty: {} as Record<Difficulty, number>,
      };
    }

    const totalGames = scores.length;
    const averageAccuracy = Math.round(
      scores.reduce((sum, s) => sum + s.accuracy, 0) / totalGames,
    );
    const bestAccuracy = Math.max(...scores.map((s) => s.accuracy));
    const totalTimePlayed = scores.reduce((sum, s) => sum + s.elapsedMs, 0);

    const gamesByDifficulty = scores.reduce(
      (acc, s) => {
        acc[s.difficulty] = (acc[s.difficulty] || 0) + 1;
        return acc;
      },
      {} as Record<Difficulty, number>,
    );

    return {
      totalGames,
      averageAccuracy,
      bestAccuracy,
      totalTimePlayed,
      gamesByDifficulty,
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
