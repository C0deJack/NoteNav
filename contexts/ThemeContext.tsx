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

export type ColorSchemePreference = 'light' | 'dark' | 'auto';

interface ThemeContextValue {
  preference: ColorSchemePreference;
  setPreference: (preference: ColorSchemePreference) => void;
  resolvedScheme: 'light' | 'dark';
  loaded: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const THEME_STORAGE_KEY = '@app_color_scheme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] =
    useState<ColorSchemePreference>('auto');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadPreference() {
      try {
        const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (stored) {
          setPreferenceState(stored as ColorSchemePreference);
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
      } finally {
        setLoaded(true);
      }
    }

    loadPreference();
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

  const resolvedScheme: 'light' | 'dark' =
    preference === 'auto'
      ? systemScheme === 'dark'
        ? 'dark'
        : 'light'
      : preference;

  return (
    <ThemeContext.Provider
      value={{ preference, setPreference, resolvedScheme, loaded }}
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
