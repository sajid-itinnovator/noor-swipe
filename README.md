# Noor Swipe - Arabic Learning App

A gamified spaced-repetition app for learning Quranic Arabic vocabulary.

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

## User Guide

### Profiles
- **Adult**: Standard mode. Shows Arabic text, phonics, and meaning.
- **Junior**: Simplified mode for non-readers. Hides Arabic text, emphasizes listening and visual association (icons).

### How to Play
- **Swipe Right**: Correct match / "I know this".
- **Swipe Left**: Incorrect match / "I don't know this".
- **Spaced Repetition**: Words move through Levels 0-5. Higher levels appear less frequently.

## Data Format

The app uses `vocabulary.json` for word data. Format:

```json
[
  {
    "id": 1,
    "arabic": "Word",
    "phonetic": "Phonetic",
    "meaning_en": "Meaning",
    "audio": "path/to/audio.mp3",
    "category": "Category"
  }
]
```

### Audio Files
Audio files should be placed in `public/audio/` and named `[id]_ar.mp3` (e.g., `1_ar.mp3`).

## Deployment

### Vercel / Netlify
1. Build the project:
   ```bash
   npm run build
   ```
2. Deploy the `dist` folder.
3. Ensure all assets in `public` are correctly referenced.

## Troubleshooting

- **Audio not playing**: Ensure `public/audio` exists and files are named correctly. Check browser permissions.
- **Progress not saving**: Persistence uses `localStorage`. Ensure browser storage is enabled.
- **App crashing**: Check the console. `ErrorBoundary` should catch most UI crashes.
