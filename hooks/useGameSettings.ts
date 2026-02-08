import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import {
  DEFAULT_DIFFICULTY_LEVEL,
  DEFAULT_NOTE_COUNT,
} from '@/constants/PianoConfig';
import type { DifficultyLevel, GameSettings, NoteCount } from '@/types/piano';

const SETTINGS_KEY = '@piano_game_settings';
const DIFFICULTY_LEVEL_KEY = '@piano_game_difficulty_level';
const NOTE_COUNT_KEY = '@piano_game_note_count';

const defaultSettings: GameSettings = {
  showWhiteKeyLabels: false,
  showBlackKeyLabels: false,
  noteDisplayMode: 'staff',
  showIncorrectFeedback: true,
  enableHapticFeedback: true,
  playSoundInSilentMode: true,
  showTimer: true,
  showCorrectAnimation: true,
  showSecondOctave: false,
};

export function useGameSettings() {
  const [settings, setSettings] = useState<GameSettings>(defaultSettings);
  const [lastDifficultyLevel, setLastDifficultyLevel] =
    useState<DifficultyLevel>(DEFAULT_DIFFICULTY_LEVEL);
  const [lastNoteCount, setLastNoteCount] =
    useState<NoteCount>(DEFAULT_NOTE_COUNT);
  const [loaded, setLoaded] = useState(false);

  // Load settings on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        const [storedSettings, storedLevel, storedCount] = await Promise.all([
          AsyncStorage.getItem(SETTINGS_KEY),
          AsyncStorage.getItem(DIFFICULTY_LEVEL_KEY),
          AsyncStorage.getItem(NOTE_COUNT_KEY),
        ]);

        if (storedSettings) {
          setSettings({ ...defaultSettings, ...JSON.parse(storedSettings) });
        }
        if (storedLevel) {
          setLastDifficultyLevel(JSON.parse(storedLevel));
        }
        if (storedCount) {
          setLastNoteCount(JSON.parse(storedCount));
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setLoaded(true);
      }
    }

    loadSettings();
  }, []);

  const updateSettings = useCallback(
    async (newSettings: Partial<GameSettings>) => {
      const updated = { ...settings, ...newSettings };
      setSettings(updated);

      try {
        await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Error saving settings:', error);
      }
    },
    [settings],
  );

  const saveLastDifficultyLevel = useCallback(
    async (level: DifficultyLevel) => {
      setLastDifficultyLevel(level);

      try {
        await AsyncStorage.setItem(DIFFICULTY_LEVEL_KEY, JSON.stringify(level));
      } catch (error) {
        console.error('Error saving difficulty level:', error);
      }
    },
    [],
  );

  const saveLastNoteCount = useCallback(async (count: NoteCount) => {
    setLastNoteCount(count);

    try {
      await AsyncStorage.setItem(NOTE_COUNT_KEY, JSON.stringify(count));
    } catch (error) {
      console.error('Error saving note count:', error);
    }
  }, []);

  return {
    settings,
    lastDifficultyLevel,
    lastNoteCount,
    loaded,
    updateSettings,
    saveLastDifficultyLevel,
    saveLastNoteCount,
  };
}
