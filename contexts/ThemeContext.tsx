import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';

export type ColorSchemePreference = 'light' | 'dark' | 'auto' | 'custom';

export type CustomColorKey =
  | 'highlight'
  | 'primary'
  | 'secondary'
  | 'dark'
  | 'light';

export type CustomColors = Partial<Record<CustomColorKey, string>>;

interface ThemeContextValue {
  preference: ColorSchemePreference;
  setPreference: (preference: ColorSchemePreference) => void;
  resolvedScheme: 'light' | 'dark';
  isCustomMode: boolean;
  customColors: CustomColors;
  setCustomColor: (key: CustomColorKey, color: string) => void;
  resetCustomColors: () => void;
  loaded: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const THEME_STORAGE_KEY = '@app_color_scheme';
const CUSTOM_COLORS_KEY = '@app_custom_colors';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] =
    useState<ColorSchemePreference>('auto');
  const [customColors, setCustomColors] = useState<CustomColors>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadPreferences() {
      try {
        const [storedTheme, storedColors] = await Promise.all([
          AsyncStorage.getItem(THEME_STORAGE_KEY),
          AsyncStorage.getItem(CUSTOM_COLORS_KEY),
        ]);
        if (storedTheme) {
          setPreferenceState(storedTheme as ColorSchemePreference);
        }
        if (storedColors) {
          setCustomColors(JSON.parse(storedColors));
        }
      } catch (error) {
        console.error('Error loading theme preferences:', error);
      } finally {
        setLoaded(true);
      }
    }

    loadPreferences();
  }, []);

  const setPreference = useCallback(
    async (newPreference: ColorSchemePreference) => {
      setPreferenceState(newPreference);
      try {
        await AsyncStorage.setItem(THEME_STORAGE_KEY, newPreference);
      } catch (error) {
        console.error('Error saving theme preference:', error);
      }
    },
    [],
  );

  const setCustomColor = useCallback(
    async (key: CustomColorKey, color: string) => {
      const updated = { ...customColors, [key]: color };
      setCustomColors(updated);
      try {
        await AsyncStorage.setItem(CUSTOM_COLORS_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Error saving custom color:', error);
      }
    },
    [customColors],
  );

  const resetCustomColors = useCallback(async () => {
    setCustomColors({});
    try {
      await AsyncStorage.removeItem(CUSTOM_COLORS_KEY);
    } catch (error) {
      console.error('Error resetting custom colors:', error);
    }
  }, []);

  const isCustomMode = preference === 'custom';

  const resolvedScheme: 'light' | 'dark' =
    preference === 'auto' || preference === 'custom'
      ? systemScheme === 'dark'
        ? 'dark'
        : 'light'
      : preference;

  return (
    <ThemeContext.Provider
      value={{
        preference,
        setPreference,
        resolvedScheme,
        isCustomMode,
        customColors,
        setCustomColor,
        resetCustomColors,
        loaded,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}
