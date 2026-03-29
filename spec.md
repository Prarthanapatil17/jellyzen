# JellyZen

## Current State
New project. Empty Motoko backend and no frontend implemented.

## Requested Changes (Diff)

### Add
- Ocean-themed meditation app with jellyfish companion named "Aura"
- Guided meditation sessions (browse and start)
- Chat interface with Aura the jellyfish (conversational AI-style responses)
- Gamified progress: XP system, levels, daily streaks, achievements/badges
- Collectible sea creatures gallery with unlock progress
- Navigation: Meditations, Journey (progress), Collectibles, Chat

### Modify
- N/A (new project)

### Remove
- N/A

## Implementation Plan

### Backend (Motoko)
- User profile: XP, level, streak, last session date
- Meditation sessions catalog (title, duration, description, category)
- Chat message history (user + Aura messages)
- Collectibles: full list of sea creatures, which are unlocked
- Achievements: list with unlock conditions
- Functions: getProfile, updateXP, recordSession, getChat, sendMessage, getCollectibles, getAchievements

### Frontend
- Deep ocean dark theme with bioluminescent accents (cyan, purple, pink glows)
- Glassmorphism cards, animated jellyfish
- Home/Hero section with floating jellyfish and quick start CTA
- Meditations page: card carousel of sessions
- Journey page: XP bar, streak counter, achievement badges
- Collectibles page: sea creature grid with unlock progress
- Chat page: full chat UI with Aura jellyfish avatar
- Floating chat button accessible from anywhere
