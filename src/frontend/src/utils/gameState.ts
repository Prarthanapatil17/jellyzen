export interface GameState {
  xp: number;
  streak: number;
  lastLoginDate: string;
  completedMeditations: number;
  journalCount: number;
  shredderCount: number;
  chatCount: number;
  breathingCount: number;
  completedChallenges: string[];
  challengeDate: string;
}

const DEFAULT_STATE: GameState = {
  xp: 0,
  streak: 1,
  lastLoginDate: new Date().toISOString().split("T")[0],
  completedMeditations: 0,
  journalCount: 0,
  shredderCount: 0,
  chatCount: 0,
  breathingCount: 0,
  completedChallenges: [],
  challengeDate: new Date().toISOString().split("T")[0],
};

export function getGameState(): GameState {
  try {
    const raw = localStorage.getItem("jellyzen_state");
    if (!raw) return { ...DEFAULT_STATE };
    const state = { ...DEFAULT_STATE, ...JSON.parse(raw) } as GameState;
    return state;
  } catch {
    return { ...DEFAULT_STATE };
  }
}

export function saveGameState(state: GameState): void {
  localStorage.setItem("jellyzen_state", JSON.stringify(state));
}

export function addXP(amount: number): number {
  const state = getGameState();
  state.xp += amount;
  saveGameState(state);
  return state.xp;
}

export function checkAndUpdateStreak(): GameState {
  const state = getGameState();
  const today = new Date().toISOString().split("T")[0];
  if (state.lastLoginDate === today) return state;
  const last = new Date(state.lastLoginDate);
  const now = new Date(today);
  const diffDays = Math.round((now.getTime() - last.getTime()) / 86400000);
  if (diffDays === 1) {
    state.streak += 1;
    state.xp += 10;
  } else if (diffDays > 1) {
    state.streak = 1;
  }
  state.lastLoginDate = today;
  // reset daily challenge completions if new day
  if (state.challengeDate !== today) {
    state.completedChallenges = [];
    state.challengeDate = today;
    state.completedMeditations = 0;
    state.journalCount = 0;
    state.shredderCount = 0;
    state.chatCount = 0;
    state.breathingCount = 0;
  }
  saveGameState(state);
  return state;
}

export function trackAction(
  action: "meditation" | "journal" | "shredder" | "chat" | "breathing",
): GameState {
  const state = getGameState();
  const today = new Date().toISOString().split("T")[0];
  if (state.challengeDate !== today) {
    state.completedChallenges = [];
    state.challengeDate = today;
    state.completedMeditations = 0;
    state.journalCount = 0;
    state.shredderCount = 0;
    state.chatCount = 0;
    state.breathingCount = 0;
  }
  switch (action) {
    case "meditation":
      state.completedMeditations += 1;
      state.xp += 50;
      break;
    case "journal":
      state.journalCount += 1;
      state.xp += 30;
      break;
    case "shredder":
      state.shredderCount += 1;
      state.xp += 20;
      break;
    case "chat":
      state.chatCount += 1;
      break;
    case "breathing":
      state.breathingCount += 1;
      state.xp += 40;
      break;
  }
  saveGameState(state);
  return state;
}

export function completeChallengeById(id: string): number {
  const state = getGameState();
  if (state.completedChallenges.includes(id)) return state.xp;
  state.completedChallenges.push(id);
  state.xp += 75;
  saveGameState(state);
  return state.xp;
}

export const LEVEL_THRESHOLDS = [
  0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200, 4000, 4900, 5900, 7000,
  8200, 9500, 10900, 12400, 14000, 15700,
];

export const LEVEL_NAMES = [
  "Tide Wanderer",
  "Sea Explorer",
  "Reef Guardian",
  "Deep Diver",
  "Ocean Keeper",
  "Wave Rider",
  "Coral Tender",
  "Bioluminescent",
  "Current Master",
  "Abyss Walker",
  "Whale Speaker",
  "Sea Shaman",
  "Abyssal Sage",
  "Leviathan's Ward",
  "Deep Oracle",
  "Tidal Shaman",
  "Ocean Sovereign",
  "Neptune's Chosen",
  "Sea Eternal",
  "Ancient Mariner",
];

export function getLevelFromXP(xp: number): number {
  let level = 0;
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      level = i;
      break;
    }
  }
  return Math.min(level, LEVEL_NAMES.length - 1);
}

export function getXPForNextLevel(xp: number): {
  current: number;
  needed: number;
  levelXP: number;
} {
  const level = getLevelFromXP(xp);
  const currentLevelXP = LEVEL_THRESHOLDS[level];
  const nextLevelXP =
    LEVEL_THRESHOLDS[Math.min(level + 1, LEVEL_THRESHOLDS.length - 1)];
  return {
    current: xp - currentLevelXP,
    needed: nextLevelXP - currentLevelXP,
    levelXP: currentLevelXP,
  };
}
