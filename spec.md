# JellyZen – Major Feature Upgrade

## Current State
App has: Home with jellyfish hero, Meditations page (6 sessions with timer modal), Journey page (XP/levels/streaks/badges), Collectibles page (20 sea creatures), Chat page with Aura the jellyfish.
Issues: No real sounds, levels/games feel shallow, no journal, no thought-shredder, static background, features not fully functional.

## Requested Changes (Diff)

### Add
- **Animated dynamic background**: Time-of-day modes — Day (bright ocean blues), Sunset (warm coral/amber ocean), Twilight/Night (midnight sky deep navy). Animated ocean waves/particles/bubbles always moving. User can toggle or auto-cycle.
- **Meditation sounds**: Real Web Audio API generated ambient sounds — ocean waves (white noise filtered), rain, deep hum, binaural-style tones, whale sounds (synthesized). Each meditation session has a sound. Sound controls with volume slider. Sounds play during timer.
- **Journal feature**: Full journal page/modal accessible from main nav. Write dated entries, save to localStorage. List of past entries. Edit/delete.
- **Thought Shredder / Vent Bubble**: A bubble (animated SVG circle) where user types. On submit the bubble wobbles and POPS with particle explosion animation — entries are NOT saved, just released. Cathartic "let it go" UX. Accessible from nav and chat.
- **Improved gamification**: Meaningful XP system — earn XP for completing meditations, journaling, using thought shredder, chat streaks. Levels 1-20 with ocean creature themes and real unlock rewards (new sounds, new backgrounds, new creature lore). Daily challenges. Visual progress ring.
- **Mini breathing game**: Interactive 4-7-8 breathing guide with animated jellyfish that expands/contracts. Or box breathing with visual.

### Modify
- **Color palette**: Migrate to Midnight Sky palette — #7589A2, #4E6188, #909BBB, #C0C6DE, #566288, #CAD1D9, #3A405B — with ocean gradient overlays from reference images (deep purple-blue to light aqua).
- **Navigation**: Add Journal and Thought Shredder as nav items or prominent FAB buttons.
- **Meditations page**: Each session now has a working sound, visual breathing guide, real timer that works.
- **Journey/levels page**: Real level progression with milestone unlocks, creature companion evolution.
- **Chat with Aura**: Better responses, mood-aware, links to journal/shredder.

### Remove
- Placeholder/non-functional buttons and features
- Static background

## Implementation Plan
1. Rewrite `index.css` with Midnight Sky OKLCH tokens and ocean gradient theme
2. Create `AnimatedBackground` component with Day/Sunset/Night modes, animated CSS layers
3. Create `useAudio` hook using Web Audio API for ambient sound generation (oscillators, noise buffers)
4. Rewrite `Meditations.tsx` with working timer, sound playback controls, breathing animation
5. Create `Journal.tsx` page with localStorage persistence, entry list, add/edit/delete
6. Create `ThoughtShredder.tsx` component — vent bubble with pop animation using CSS keyframes + particles
7. Rewrite `Journey.tsx` with meaningful XP levels 1-20, daily challenges, visual progress
8. Create `BreathingGame.tsx` — interactive 4-7-8 / box breathing with animated jellyfish
9. Update `App.tsx` — add Journal and Shredder routes, background wrapper, time-of-day toggle
10. Update `Chat.tsx` — mood detection, quick-link to journal/shredder from Aura
