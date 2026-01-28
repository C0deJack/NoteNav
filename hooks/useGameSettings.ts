import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { GameSettings, Difficulty } from '@/types/piano';
import { DEFAULT_DIFFICULTY } from '@/constants/PianoConfig';

const SETTINGS_KEY = '@piano_game_settings';
const DIFFICULTY_KEY = '@piano_game_difficulty';

const defaultSettings: GameSettings = {
  showNoteLabels: false,
};

export function useGameSettings() {
  const [settings, setSettings] = useState<GameSettings>(defaultSettings);
  const [lastDifficulty, setLastDifficulty] = useState<Difficulty>(DEFAULT_DIFFICULTY);
  const [loaded, setLoaded] = useState(false);

  // Load settings on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        const [storedSettings, storedDifficulty] = await Promise.all([
          AsyncStorage.getItem(SETTINGS_KEY),
          AsyncStorage.getItem(DIFFICULTY_KEY),
        ]);

        if (storedSettings) {
          setSettings(JSON.parse(storedSettings));
        }
        if (storedDifficulty) {
          setLastDifficulty(JSON.parse(storedDifficulty));
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setLoaded(true);
      }
    }

    loadSettings();
  }, []);

  const updateSettings = useCallback(async (newSettings: Partial<GameSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);

    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }, [settings]);

  const saveLastDifficulty = useCallback(async (difficulty: Difficulty) => {
    setLastDifficulty(difficulty);

    try {
      await AsyncStorage.setItem(DIFFICULTY_KEY, JSON.stringify(difficulty));
    } catch (error) {
      console.error('Error saving difficulty:', error);
    }
  }, []);

  return {
    settings,
    lastDifficulty,
    loaded,
    updateSettings,
    saveLastDifficulty,
  };
}
