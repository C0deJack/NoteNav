# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NoteNav is a React Native universal app (iOS, Android, Web) built with Expo 54 and React Native 0.81.

## Commands

```bash
npm start           # Start Expo dev server
npm run ios         # Run on iOS simulator
npm run android     # Run on Android emulator
npm run web         # Run on web
npm test            # Run Jest tests in watch mode
npm run lint        # Run Expo linter
```

## Architecture

### Routing (Expo Router)
File-based routing in `/app`:
- `/(tabs)/` - Tab navigator group containing main screens
- `_layout.tsx` files define navigation structure
- Typed routes enabled (`experiments.typedRoutes`)

### Theme System
- Colors defined in `/constants/Colors.ts` (light/dark palettes)
- `useColorScheme()` - detects system preference (platform-specific implementations: `.ts` for native, `.web.ts` for web)
- `useThemeColor()` - retrieves theme-aware colors
- `ThemedText` and `ThemedView` - base components accepting `lightColor`/`darkColor` props

### Import Aliases
Use `@/*` for project root imports:
```typescript
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
```

### Key Directories
- `/app` - Screens and routing
- `/components` - Reusable UI components
- `/hooks` - Custom React hooks
- `/constants` - App-wide constants (colors, etc.)
- `/assets` - Images and fonts

### Testing
Jest with jest-expo preset. Test files colocated in `__tests__/` folders using snapshot testing pattern.
