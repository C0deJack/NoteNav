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
- Colors defined in `/constants/Colors.ts` (light/dark palettes with `tint`, `border`, etc.)
- `useColorScheme()` - detects system preference
- `useThemeColor()` - retrieves theme-aware colors (e.g., `useThemeColor({}, 'border')`)
- `ThemedText` and `ThemedView` - base themed components
- `PianoColors` - static colors for piano keys and feedback

### Piano Game Feature

**Flow:** Menu → Select difficulty → Play (landscape) → Results → Play Again / Menu

**Key files:**
- `/components/piano/` - Piano UI components (PianoKeyboard, PianoKey, NoteDisplay, GameTimer, DifficultySelector, QuitGameModal)
- `/hooks/usePianoGame.ts` - Game state management
- `/hooks/usePianoAudio.ts` - Audio playback with expo-av
- `/hooks/useGameSettings.ts` - Persisted settings (AsyncStorage)
- `/constants/PianoConfig.ts` - Note mappings, difficulties
- `/types/piano.ts` - TypeScript interfaces
- `/assets/sounds/` - Piano note WAV files

**Screen orientation:** Game and results screens lock to landscape using `expo-screen-orientation`. Must add `supportedOrientations` prop to any Modal components used in landscape screens.

**Audio:** Pre-loaded on mount via expo-av. 12 note sounds + error sound (kick.wav).

### Import Aliases
Use `@/*` for project root imports:
```typescript
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
```

### Key Directories
- `/app` - Screens and routing
- `/components` - Reusable UI components
- `/components/piano` - Piano-specific components
- `/hooks` - Custom React hooks
- `/constants` - App-wide constants (colors, piano config)
- `/types` - TypeScript type definitions
- `/assets` - Images, fonts, and sounds

### Testing
Jest with jest-expo preset. Test files colocated in `__tests__/` folders.
