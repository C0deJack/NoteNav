import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { useGameSettings } from '../useGameSettings';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('useGameSettings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAsyncStorage.getItem.mockResolvedValue(null);
    mockAsyncStorage.setItem.mockResolvedValue();
  });

  describe('initial state', () => {
    it('has default settings after loading', async () => {
      const { result } = renderHook(() => useGameSettings());

      await waitFor(() => {
        expect(result.current.loaded).toBe(true);
      });

      expect(result.current.settings).toEqual({
        showWhiteKeyLabels: false,
        showBlackKeyLabels: false,
        noteDisplayMode: 'staff',
        showIncorrectFeedback: true,
        enableHapticFeedback: true,
        playSoundInSilentMode: true,
        showTimer: true,
        showCorrectAnimation: true,
        showSecondOctave: false,
      });
    });

    it('has default difficulty of 10 after loading', async () => {
      const { result } = renderHook(() => useGameSettings());

      await waitFor(() => {
        expect(result.current.loaded).toBe(true);
      });

      expect(result.current.lastDifficulty).toBe(10);
    });
  });

  describe('loading settings', () => {
    it('loads settings from AsyncStorage on mount', async () => {
      const storedSettings = {
        showWhiteKeyLabels: true,
        showBlackKeyLabels: true,
      };

      mockAsyncStorage.getItem.mockImplementation((key) => {
        if (key === '@piano_game_settings') {
          return Promise.resolve(JSON.stringify(storedSettings));
        }
        return Promise.resolve(null);
      });

      const { result } = renderHook(() => useGameSettings());

      await waitFor(() => {
        expect(result.current.loaded).toBe(true);
      });

      expect(result.current.settings.showWhiteKeyLabels).toBe(true);
      expect(result.current.settings.showBlackKeyLabels).toBe(true);
      // Other settings should have defaults
      expect(result.current.settings.noteDisplayMode).toBe('staff');
    });

    it('loads difficulty from AsyncStorage on mount', async () => {
      mockAsyncStorage.getItem.mockImplementation((key) => {
        if (key === '@piano_game_difficulty') {
          return Promise.resolve(JSON.stringify(25));
        }
        return Promise.resolve(null);
      });

      const { result } = renderHook(() => useGameSettings());

      await waitFor(() => {
        expect(result.current.loaded).toBe(true);
      });

      expect(result.current.lastDifficulty).toBe(25);
    });

    it('sets loaded to true even on error', async () => {
      mockAsyncStorage.getItem.mockRejectedValue(new Error('Storage error'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const { result } = renderHook(() => useGameSettings());

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

    it('merges stored settings with defaults', async () => {
      // Only store partial settings (as if app was updated with new settings)
      const storedSettings = {
        showWhiteKeyLabels: true,
      };

      mockAsyncStorage.getItem.mockImplementation((key) => {
        if (key === '@piano_game_settings') {
          return Promise.resolve(JSON.stringify(storedSettings));
        }
        return Promise.resolve(null);
      });

      const { result } = renderHook(() => useGameSettings());

      await waitFor(() => {
        expect(result.current.loaded).toBe(true);
      });

      // Stored value
      expect(result.current.settings.showWhiteKeyLabels).toBe(true);
      // Default values for new settings
      expect(result.current.settings.showSecondOctave).toBe(false);
      expect(result.current.settings.showCorrectAnimation).toBe(true);
    });
  });

  describe('updateSettings', () => {
    it('updates settings state', async () => {
      const { result } = renderHook(() => useGameSettings());

      await waitFor(() => {
        expect(result.current.loaded).toBe(true);
      });

      await act(async () => {
        await result.current.updateSettings({ showWhiteKeyLabels: true });
      });

      expect(result.current.settings.showWhiteKeyLabels).toBe(true);
    });

    it('saves settings to AsyncStorage', async () => {
      const { result } = renderHook(() => useGameSettings());

      await waitFor(() => {
        expect(result.current.loaded).toBe(true);
      });

      await act(async () => {
        await result.current.updateSettings({ showWhiteKeyLabels: true });
      });

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        '@piano_game_settings',
        expect.any(String),
      );

      const savedSettings = JSON.parse(
        mockAsyncStorage.setItem.mock.calls[0][1],
      );
      expect(savedSettings.showWhiteKeyLabels).toBe(true);
    });

    it('can update multiple settings at once', async () => {
      const { result } = renderHook(() => useGameSettings());

      await waitFor(() => {
        expect(result.current.loaded).toBe(true);
      });

      await act(async () => {
        await result.current.updateSettings({
          showWhiteKeyLabels: true,
          showBlackKeyLabels: true,
          noteDisplayMode: 'text',
        });
      });

      expect(result.current.settings.showWhiteKeyLabels).toBe(true);
      expect(result.current.settings.showBlackKeyLabels).toBe(true);
      expect(result.current.settings.noteDisplayMode).toBe('text');
    });
  });

  describe('saveLastDifficulty', () => {
    it('updates difficulty state', async () => {
      const { result } = renderHook(() => useGameSettings());

      await waitFor(() => {
        expect(result.current.loaded).toBe(true);
      });

      await act(async () => {
        await result.current.saveLastDifficulty(25);
      });

      expect(result.current.lastDifficulty).toBe(25);
    });

    it('saves difficulty to AsyncStorage', async () => {
      const { result } = renderHook(() => useGameSettings());

      await waitFor(() => {
        expect(result.current.loaded).toBe(true);
      });

      await act(async () => {
        await result.current.saveLastDifficulty(100);
      });

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        '@piano_game_difficulty',
        '100',
      );
    });
  });
});
