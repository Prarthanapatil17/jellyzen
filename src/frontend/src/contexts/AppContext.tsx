import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  LEVEL_NAMES,
  addXP as addXPToState,
  checkAndUpdateStreak,
  getGameState,
  getLevelFromXP,
  trackAction,
} from "../utils/gameState";

export type TimeMode = "day" | "sunset" | "night";

interface AppContextType {
  timeMode: TimeMode;
  cycleTimeMode: () => void;
  xp: number;
  level: number;
  levelName: string;
  streak: number;
  addXP: (amount: number) => void;
  doAction: (
    action: "meditation" | "journal" | "shredder" | "chat" | "breathing",
  ) => void;
  refreshState: () => void;
  navigate: (page: string) => void;
  currentPage: string;
}

const AppContext = createContext<AppContextType>({
  timeMode: "night",
  cycleTimeMode: () => {},
  xp: 0,
  level: 0,
  levelName: "Tide Wanderer",
  streak: 1,
  addXP: () => {},
  doAction: () => {},
  refreshState: () => {},
  navigate: () => {},
  currentPage: "home",
});

export function AppProvider({
  children,
  navigate,
  currentPage,
}: {
  children: React.ReactNode;
  navigate: (p: string) => void;
  currentPage: string;
}) {
  const [timeMode, setTimeMode] = useState<TimeMode>("night");
  const [xp, setXP] = useState(0);
  const [level, setLevel] = useState(0);
  const [levelName, setLevelName] = useState("Tide Wanderer");
  const [streak, setStreak] = useState(1);
  const initialized = useRef(false);

  const refreshState = () => {
    const state = getGameState();
    setXP(state.xp);
    const lv = getLevelFromXP(state.xp);
    setLevel(lv);
    setLevelName(LEVEL_NAMES[lv] ?? "Ancient Mariner");
    setStreak(state.streak);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: init once on mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    checkAndUpdateStreak();
    refreshState();
  }, []);

  const cycleTimeMode = () => {
    setTimeMode((prev) =>
      prev === "day" ? "sunset" : prev === "sunset" ? "night" : "day",
    );
  };

  const addXP = (amount: number) => {
    addXPToState(amount);
    refreshState();
  };

  const doAction = (
    action: "meditation" | "journal" | "shredder" | "chat" | "breathing",
  ) => {
    trackAction(action);
    refreshState();
  };

  return (
    <AppContext.Provider
      value={{
        timeMode,
        cycleTimeMode,
        xp,
        level,
        levelName,
        streak,
        addXP,
        doAction,
        refreshState,
        navigate,
        currentPage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
