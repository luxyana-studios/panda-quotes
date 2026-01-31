# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Panda Quotes is a mindfulness app that displays philosophical quotes from a "Red Panda Philosopher." Built with Expo (v54) and React 19.

## Development Commands

```bash
npm install          # Install dependencies
npm start            # Start Expo dev server
npm run ios          # iOS simulator
npm run android      # Android emulator
npm run web          # Web browser
npm run lint         # ESLint
```

## Architecture

### Screen Flow State Machine

The app uses a simple state machine in `app/index.tsx` with three screens:

```
StartScreen → TakeInScreen → ContemplateScreen
     ↑              │                │
     └──────────────┴────────────────┘
```

- **StartScreen**: Breathing prompt, "I'm ready" button
- **TakeInScreen**: Shows quote, options to "sit with this" or "ask another question"
- **ContemplateScreen**: Reflection phase with quote, "move on" returns to start

Screen transitions are managed via `useState<'start' | 'takeIn' | 'contemplate'>`.

### Quote Management

`hooks/useQuoteManager.ts` handles quote cycling:
- Maintains `usedIndices` to avoid repeats until all quotes are shown
- Randomizes selection from unused quotes
- Resets when all quotes have been displayed
- Quotes stored in `constants/quotes.ts`

### Animation Pattern

All screens use React Native Reanimated with consistent timing:
- Text elements fade in sequentially using `withDelay` + `withTiming`
- Buttons appear after text animations complete
- Timing constants defined at top of each screen component

### Import Paths

Use path alias `@/*` which maps to project root:
- `@/components/...`, `@/hooks/...`, `@/constants/...`, `@/styles/...`

### Key Configuration

- React Native New Architecture enabled
- React Compiler experimental enabled
- TypeScript strict mode
- Deep linking scheme: `pandaquotes://`

## Git Commits

- NEVER add Co-Authored-By or any AI attribution to commit messages
