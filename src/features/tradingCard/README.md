# Trading Card Feature

This module manages the user's trading card display, stats visualization, and card progression system.

## Overview

The trading card feature displays the user as a collectible card with:
- Dynamic avatar
- Real-time stats (addiction level, mental strength, motivation, trigger defense)
- Rarity system based on streak length
- Archetype-based theming
- Stat progression and leveling

## Components

### TradingCard (In App.jsx - To be extracted)
Main trading card component that displays user stats in a card format.

**Features:**
- Avatar display
- Stat bars with color coding
- Rarity border effects
- Archetype icons
- Comparison mode (for arena battles)

## Rarity System

Cards increase in rarity based on clean streak:
- **Common** (Gray): 0-6 days
- **Uncommon** (Silver): 7-13 days
- **Rare** (Gold): 14-29 days
- **Epic** (Purple): 30-89 days
- **Legendary** (Orange): 90+ days

## Stats Displayed

1. **Addiction Freedom**: 100 - addictionLevel
2. **Mental Strength**: User's mental resilience
3. **Motivation**: Drive to stay clean
4. **Trigger Defense**: Ability to resist triggers

## Future Implementation

This feature is currently embedded in App.jsx and will be extracted to:
- `components/TradingCard.tsx`: Main card component
- `components/StatBar.tsx`: Individual stat display
- `hooks/useCardStats.ts`: Stats calculation logic
- `models/CardModels.ts`: Card data types
- `services/CardService.ts`: Card progression logic

