# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NoteNav is a React Native universal app (iOS, Android, Web) built with Expo 54 and React Native 0.81. The app features a piano note recognition game where users identify displayed notes by tapping the correct piano key.

**Minimum supported screen size:** 375×812px (iPhone X/11/12 mini)

## Commands

```bash
npm start           # Start Expo dev server
npm run ios         # Run on iOS simulator
npm run android     # Run on Android emulator
npm run web         # Run on web
npm test            # Run Jest tests in watch mode
npm run lint        # Run Biome linter
npm run lint:fix    # Auto-fix lint issues
npm run format      # Format code with Biome
```

## Architecture

### Routing (Expo Router)
File-based routing in `/app`:
- `/(tabs)/` - Tab navigator group (Home, Explore, Piano)
- `/piano/game.tsx` - Active gameplay screen (landscape locked)
- `/piano/results.tsx` - Results after game completion
- `_layout.tsx` files define navigation structure

### Theme System

**Single hook pattern:** All theming goes through `useTheme()` from `/hooks/useTheme.ts`.

```typescript
import { useTheme } from '@/hooks/useTheme';

function MyComponent() {
  const { colors, isDark, colorScheme } = useTheme();

  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.text }}>Hello</Text>
      <Button color={colors.primary} />
    </View>
  );
}
```

**Color palette** (defined in `/constants/Colors.ts`):
- `text` - Primary text color
- `textMuted` - Secondary/dimmed text
- `background` - Screen/container backgrounds
- `surface` - Cards, modals, elevated surfaces
- `primary` - Brand/accent color for interactive elements
- `border` - Borders, dividers, separators
- `icon` - Default icon color

**Themed base components:**
- `ThemedView` - View with theme background
- `ThemedText` - Text with theme color, supports `type` prop: `default`, `title`, `subtitle`, `defaultSemiBold`, `link`, `muted`

**Navigation theming:**
- `/constants/NavigationTheme.ts` - React Navigation themes connected to app colors
- Root layout uses `ThemeProvider` with custom themes

**Piano colors** (`PianoColors` in Colors.ts) - Static colors for piano keys/feedback, intentionally not theme-dependent for consistent game experience.

### Piano Game Feature

**Flow:** Menu → Select difficulty → Play (landscape) → Results → Play Again / Menu

**Key files:**
- `/components/piano/` - Piano UI components (PianoKeyboard, PianoKey, NoteDisplay, GameTimer, DifficultySelector, QuitGameModal)
- `/hooks/usePianoGame.ts` - Game state management
- `/hooks/usePianoAudio.ts` - Audio playback with expo-audio
- `/hooks/useGameSettings.ts` - Persisted settings (AsyncStorage)
- `/constants/PianoConfig.ts` - Note mappings, difficulties
- `/types/piano.ts` - TypeScript interfaces
- `/assets/sounds/` - Piano note WAV files

**Screen orientation:** Game and results screens lock to landscape using `expo-screen-orientation`. Must add `supportedOrientations` prop to any Modal components used in landscape screens.

**Audio:** Pre-loaded on mount via expo-audio using `createAudioPlayer`. 12 note sounds + error sound (kick.wav).

### Import Aliases
Use `@/*` for project root imports:
```typescript
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';
```

### Key Directories
- `/app` - Screens and routing
- `/components` - Reusable UI components
- `/components/piano` - Piano-specific components
- `/hooks` - Custom React hooks
- `/constants` - App-wide constants (colors, navigation themes, piano config)
- `/types` - TypeScript type definitions
- `/assets` - Images, fonts, and sounds

### Testing
Jest with jest-expo preset. Test files colocated in `__tests__/` folders.
