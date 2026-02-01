import { ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import {
  DarkNavigationTheme,
  LightNavigationTheme,
} from '@/constants/NavigationTheme';
import { ThemeProvider, useThemeContext } from '@/contexts/ThemeContext';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { resolvedScheme, loaded: themeLoaded } = useThemeContext();
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  }, []);

  useEffect(() => {
    if (fontsLoaded && themeLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, themeLoaded]);

  if (!fontsLoaded || !themeLoaded) {
    return null;
  }

  return (
    <NavigationThemeProvider
      value={
        resolvedScheme === 'dark' ? DarkNavigationTheme : LightNavigationTheme
      }
    >
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="piano/game"
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="piano/results"
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutNav />
    </ThemeProvider>
  );
}
