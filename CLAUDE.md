# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Panda Quotes is a React Native application built with Expo (v54) and React 19. The app uses Expo Router for file-based navigation and is configured to run on iOS, Android, and Web platforms.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm start
# or
expo start

# Platform-specific commands
npm run ios        # Start on iOS simulator
npm run android    # Start on Android emulator
npm run web        # Start web version

# Code quality
npm run lint       # Run ESLint
```

## Architecture

### Routing System
- Uses Expo Router (v6) with file-based routing
- Routes are defined in the `app/` directory
- `app/_layout.tsx` is the root layout using Stack navigation
- `app/index.tsx` is the main entry point/home screen
- Typed routes are enabled via `experiments.typedRoutes` in app.json

### Import Paths
- Path alias `@/*` configured in tsconfig.json maps to the project root
- Use `@/components/...`, `@/app/...`, etc. for imports

### Key Configuration
- **New Architecture**: React Native New Architecture is enabled (`newArchEnabled: true`)
- **React Compiler**: Experimental React Compiler is enabled
- **TypeScript**: Strict mode enabled
- **Scheme**: Deep linking scheme is `pandaquotes://`
- **Owner**: EAS project owned by `luxyana-studios`

### Platform Support
- iOS: Supports iPad
- Android: Edge-to-edge enabled, predictive back gesture disabled
- Web: Static output configured

### Notable Dependencies
- React Navigation v7 (bottom tabs)
- React Native Reanimated v4
- React Native Gesture Handler
- Expo Haptics, Image, Linking, and other Expo modules
