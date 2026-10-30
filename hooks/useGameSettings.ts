import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import {
  DEFAULT_CLEF,
  DEFAULT_DIFFICULTY_LEVEL,
  DEFAULT_NOTE_COUNT,
} from '@/constants/PianoConfig';
import type {
  Clef,
  DifficultyLevel,
  GameSettings,
  NoteCount,
} from '@/types/piano';

const SETTINGS_KEY = '@piano_game_settings';
const DIFFICULTY_LEVEL_KEY = '@piano_game_difficulty_level';
const NOTE_COUNT_KEY = '@piano_game_note_count';
const CLEF_KEY = '@piano_game_clef';

const defaultSettings: GameSettings = {
  showWhiteKeyLabels: false,
  showBlackKeyLabels: false,
  noteDisplayMode: 'staff',
  showIncorrectFeedback: true,
  playIncorrectSound: true,
  hapticOnCorrect: true,
  hapticOnIncorrect: true,
  playSoundInSilentMode: true,
  showTimer: true,
  showCorrectAnimation: true,
  showSecondOctave: false,
};

/**
 * Settings saved before haptics were split into correct/incorrect had a
 * single enableHapticFeedback; carry that choice over to both.
 */
function migrateSettings(
  stored: Record<string, unknown>,
): Partial<GameSettings> {
  const { enableHapticFeedback, ...rest } = stored;
  if (typeof enableHapticFeedback === 'boolean') {
    return {
      hapticOnCorrect: enableHapticFeedback,
      hapticOnIncorrect: enableHapticFeedback,
      ...rest,
    };
  }
  return rest;
}

export function useGameSettings() {
  const [settings, setSettings] = useState<GameSettings>(defaultSettings);
  const [lastDifficultyLevel, setLastDifficultyLevel] =
    useState<DifficultyLevel>(DEFAULT_DIFFICULTY_LEVEL);
  const [lastNoteCount, setLastNoteCount] =
    useState<NoteCount>(DEFAULT_NOTE_COUNT);
  const [lastClef, setLastClef] = useState<Clef>(DEFAULT_CLEF);
  const [loaded, setLoaded] = useState(false);

  // Load settings on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        const [storedSettings, storedLevel, storedCount, storedClef] =
          await Promise.all([
            AsyncStorage.getItem(SETTINGS_KEY),
            AsyncStorage.getItem(DIFFICULTY_LEVEL_KEY),
            AsyncStorage.getItem(NOTE_COUNT_KEY),
            AsyncStorage.getItem(CLEF_KEY),
          ]);

        if (storedSettings) {
          setSettings({
            ...defaultSettings,
            ...migrateSettings(JSON.parse(storedSettings)),
          });
        }
        if (storedLevel) {
          setLastDifficultyLevel(JSON.parse(storedLevel));
        }
        if (storedCount) {
          setLastNoteCount(JSON.parse(storedCount));
        }
        if (storedClef) {
          setLastClef(JSON.parse(storedClef));
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

  const saveLastClef = useCallback(async (clef: Clef) => {
    setLastClef(clef);

    try {
      await AsyncStorage.setItem(CLEF_KEY, JSON.stringify(clef));
    } catch (error) {
      console.error('Error saving clef:', error);
    }
  }, []);

  return {
    settings,
    lastClef,
    lastDifficultyLevel,
    lastNoteCount,
    loaded,
    updateSettings,
    saveLastDifficultyLevel,
    saveLastNoteCount,
    saveLastClef,
  };
}
