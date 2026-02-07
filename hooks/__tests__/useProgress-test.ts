import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { useProgress } from '../useProgress';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('useProgress', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAsyncStorage.getItem.mockResolvedValue(null);
    mockAsyncStorage.setItem.mockResolvedValue();
    mockAsyncStorage.removeItem.mockResolvedValue();
  });

  describe('initial state', () => {
    it('has empty scores after loading', async () => {
      const { result } = renderHook(() => useProgress());

      await waitFor(() => {
        expect(result.current.loaded).toBe(true);
      });

      expect(result.current.scores).toEqual([]);
    });
  });

  describe('loading progress', () => {
    it('loads scores from AsyncStorage on mount', async () => {
      const storedScores = [
        {
          id: '1',
          difficulty: 10,
          accuracy: 85,
          elapsedMs: 30000,
          timestamp: Date.now(),
        },
      ];

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(storedScores));

      const { result } = renderHook(() => useProgress());

      await waitFor(() => {
        expect(result.current.loaded).toBe(true);
      });

      expect(result.current.scores).toHaveLength(1);
      expect(result.current.scores[0].accuracy).toBe(85);
    });

    it('sets loaded to true even on error', async () => {
      mockAsyncStorage.getItem.mockRejectedValue(new Error('Storage error'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const { result } = renderHook(() => useProgress());

      // Flush promises to let the rejected promise settle
      await act(async () => {
        await Promise.resolve();
      });

      await waitFor(() => {
        expect(result.current.loaded).toBe(true);
      });

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('addScore', () => {
    it('adds a new score with id and timestamp', async () => {
      const { result } = renderHook(() => useProgress());

      await waitFor(() => {
        expect(result.current.loaded).toBe(true);
      });

      let newScore: Awaited<ReturnType<typeof result.current.addScore>>;

      await act(async () => {
        newScore = await result.current.addScore({
          difficulty: 10,
          accuracy: 90,
          elapsedMs: 25000,
        });
      });

      expect(newScore!.id).toBeDefined();
      expect(newScore!.timestamp).toBeDefined();
      expect(newScore!.accuracy).toBe(90);
      expect(result.current.scores).toHaveLength(1);
    });

    it('prepends new score to existing scores', async () => {
      const existingScores = [
        {
          id: '1',
          difficulty: 10,
          accuracy: 80,
          elapsedMs: 30000,
          timestamp: Date.now() - 1000,
        },
      ];

      mockAsyncStorage.getItem.mockResolvedValue(
        JSON.stringify(existingScores),
      );

      const { result } = renderHook(() => useProgress());

      await waitFor(() => {
        expect(result.current.loaded).toBe(true);
      });

      await act(async () => {
        await result.current.addScore({
          difficulty: 25,
          accuracy: 95,
          elapsedMs: 20000,
        });
      });

      expect(result.current.scores).toHaveLength(2);
      expect(result.current.scores[0].accuracy).toBe(95); // New score first
      expect(result.current.scores[1].accuracy).toBe(80); // Old score second
    });

    it('saves scores to AsyncStorage', async () => {
      const { result } = renderHook(() => useProgress());

      await waitFor(() => {
        expect(result.current.loaded).toBe(true);
      });

      await act(async () => {
        await result.current.addScore({
          difficulty: 10,
          accuracy: 90,
          elapsedMs: 25000,
        });
      });

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        '@game_progress',
        expect.any(String),
      );
    });
  });

  describe('resetProgress', () => {
    it('clears all scores', async () => {
      const existingScores = [
        {
          id: '1',
          difficulty: 10,
          accuracy: 80,
          elapsedMs: 30000,
          timestamp: Date.now(),
        },
      ];

      mockAsyncStorage.getItem.mockResolvedValue(
        JSON.stringify(existingScores),
      );

      const { result } = renderHook(() => useProgress());

      await waitFor(() => {
        expect(result.current.scores).toHaveLength(1);
      });

      await act(async () => {
        await result.current.resetProgress();
      });

      expect(result.current.scores).toEqual([]);
    });

    it('removes data from AsyncStorage', async () => {
      const { result } = renderHook(() => useProgress());

      await waitFor(() => {
        expect(result.current.loaded).toBe(true);
      });

      await act(async () => {
        await result.current.resetProgress();
      });

      expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith(
        '@game_progress',
      );
    });
  });

  describe('getStats', () => {
    it('returns zeros when no scores', async () => {
      const { result } = renderHook(() => useProgress());

      await waitFor(() => {
        expect(result.current.loaded).toBe(true);
      });

      const stats = result.current.getStats();

      expect(stats).toEqual({
        totalGames: 0,
        averageAccuracy: 0,
        bestAccuracy: 0,
        totalTimePlayed: 0,
        gamesByDifficulty: {},
      });
    });

    it('calculates total games correctly', async () => {
      const storedScores = [
        {
          id: '1',
          difficulty: 10,
          accuracy: 80,
          elapsedMs: 30000,
          timestamp: Date.now(),
        },
        {
          id: '2',
          difficulty: 25,
          accuracy: 90,
          elapsedMs: 25000,
          timestamp: Date.now(),
        },
        {
          id: '3',
          difficulty: 10,
          accuracy: 85,
          elapsedMs: 28000,
          timestamp: Date.now(),
        },
      ];

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(storedScores));

      const { result } = renderHook(() => useProgress());

      await waitFor(() => {
        expect(result.current.loaded).toBe(true);
      });

      const stats = result.current.getStats();

      expect(stats.totalGames).toBe(3);
    });

    it('calculates average accuracy correctly', async () => {
      const storedScores = [
        {
          id: '1',
          difficulty: 10,
          accuracy: 80,
          elapsedMs: 30000,
          timestamp: Date.now(),
        },
        {
          id: '2',
          difficulty: 10,
          accuracy: 90,
          elapsedMs: 25000,
          timestamp: Date.now(),
        },
        {
          id: '3',
          difficulty: 10,
          accuracy: 100,
          elapsedMs: 20000,
          timestamp: Date.now(),
        },
      ];

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(storedScores));

      const { result } = renderHook(() => useProgress());

      await waitFor(() => {
        expect(result.current.loaded).toBe(true);
      });

      const stats = result.current.getStats();

      expect(stats.averageAccuracy).toBe(90); // (80 + 90 + 100) / 3 = 90
    });

    it('calculates best accuracy correctly', async () => {
      const storedScores = [
        {
          id: '1',
          difficulty: 10,
          accuracy: 80,
          elapsedMs: 30000,
          timestamp: Date.now(),
        },
        {
          id: '2',
          difficulty: 10,
          accuracy: 95,
          elapsedMs: 25000,
          timestamp: Date.now(),
        },
        {
          id: '3',
          difficulty: 10,
          accuracy: 85,
          elapsedMs: 20000,
          timestamp: Date.now(),
        },
      ];

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(storedScores));

      const { result } = renderHook(() => useProgress());

      await waitFor(() => {
        expect(result.current.loaded).toBe(true);
      });

      const stats = result.current.getStats();

      expect(stats.bestAccuracy).toBe(95);
    });

    it('calculates total time played correctly', async () => {
      const storedScores = [
        {
          id: '1',
          difficulty: 10,
          accuracy: 80,
          elapsedMs: 30000,
          timestamp: Date.now(),
        },
        {
          id: '2',
          difficulty: 10,
          accuracy: 90,
          elapsedMs: 25000,
          timestamp: Date.now(),
        },
      ];

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(storedScores));

      const { result } = renderHook(() => useProgress());

      await waitFor(() => {
        expect(result.current.loaded).toBe(true);
      });

      const stats = result.current.getStats();

      expect(stats.totalTimePlayed).toBe(55000); // 30000 + 25000
    });

    it('counts games by difficulty correctly', async () => {
      const storedScores = [
        {
          id: '1',
          difficulty: 10,
          accuracy: 80,
          elapsedMs: 30000,
          timestamp: Date.now(),
        },
        {
          id: '2',
          difficulty: 25,
          accuracy: 90,
          elapsedMs: 25000,
          timestamp: Date.now(),
        },
        {
          id: '3',
          difficulty: 10,
          accuracy: 85,
          elapsedMs: 28000,
          timestamp: Date.now(),
        },
        {
          id: '4',
          difficulty: 100,
          accuracy: 70,
          elapsedMs: 60000,
          timestamp: Date.now(),
        },
      ];

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(storedScores));

      const { result } = renderHook(() => useProgress());

      await waitFor(() => {
        expect(result.current.loaded).toBe(true);
      });

      const stats = result.current.getStats();

      expect(stats.gamesByDifficulty).toEqual({
        10: 2,
        25: 1,
        100: 1,
      });
    });
  });
});
