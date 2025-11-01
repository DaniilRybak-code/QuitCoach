## Arena Feature

This feature encapsulates the competitive arena experience for QuitCoach. It is responsible for generating the opponent ("Nemesis AI") that the user battles against inside the arena view.

### Responsibilities

- Provide deterministic generation of an AI nemesis based on the signed-in user's latest stats.
- Keep nemesis logic separated from the main `App.jsx` file so the arena feature can evolve independently.
- Ensure all arena specific services and helpers remain self-contained inside this feature folder.

### Public API

- `createNemesisProfile` – Generates a nemesis profile derived from the current user profile and stats.

### Folder Structure

```
src/features/arena/
  ├── README.md           # This document
  ├── index.ts           # Public exports for the feature
  └── services/
        └── NemesisService.ts
```

Only import from `src/features/arena` to consume arena functionality.

