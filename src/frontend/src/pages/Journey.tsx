import { Progress } from "@/components/ui/progress";
import { Flame, Lock, Sparkles, Trophy, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApp } from "../contexts/AppContext";
import {
  LEVEL_NAMES,
  LEVEL_THRESHOLDS,
  completeChallengeById,
  getGameState,
  getLevelFromXP,
  getXPForNextLevel,
} from "../utils/gameState";

const CHALLENGE_POOL = [
  {
    id: "med2",
    label: "Complete 2 meditations",
    xp: 75,
    emoji: "🌊",
    action: "meditations",
    check: (s: ReturnType<typeof getGameState>) => s.completedMeditations >= 2,
  },
  {
    id: "journal",
    label: "Write a journal entry",
    xp: 30,
    emoji: "📔",
    action: "journal",
    check: (s: ReturnType<typeof getGameState>) => s.journalCount >= 1,
  },
  {
    id: "shredder",
    label: "Release thoughts in the bubble",
    xp: 20,
    emoji: "🪼",
    action: "release",
    check: (s: ReturnType<typeof getGameState>) => s.shredderCount >= 1,
  },
  {
    id: "chat5",
    label: "Chat with Aura 5 times",
    xp: 50,
    emoji: "🪼",
    action: "chat",
    check: (s: ReturnType<typeof getGameState>) => s.chatCount >= 5,
  },
  {
    id: "breath",
    label: "Complete a breathing exercise",
    xp: 40,
    emoji: "💨",
    action: "meditations",
    check: (s: ReturnType<typeof getGameState>) => s.breathingCount >= 1,
  },
  {
    id: "med1",
    label: "Complete any meditation",
    xp: 50,
    emoji: "✨",
    action: "meditations",
    check: (s: ReturnType<typeof getGameState>) => s.completedMeditations >= 1,
  },
  {
    id: "streak",
    label: "Check in today",
    xp: 10,
    emoji: "🔥",
    action: null,
    check: () => true,
  },
  {
    id: "med20",
    label: "Complete a long meditation",
    xp: 60,
    emoji: "⏱",
    action: "meditations",
    check: (s: ReturnType<typeof getGameState>) => s.completedMeditations >= 1,
  },
];

function getDailyChallenges() {
  const date = new Date().toISOString().split("T")[0];
  const seed = date.split("-").reduce((a, b) => a + Number.parseInt(b), 0);
  const result: typeof CHALLENGE_POOL = [];
  const used = new Set<number>();
  for (let i = 0; result.length < 3; i++) {
    const idx = (seed + i * 7) % CHALLENGE_POOL.length;
    if (!used.has(idx)) {
      used.add(idx);
      result.push(CHALLENGE_POOL[idx]);
    }
    if (i > 50) break;
  }
  return result;
}

const ACHIEVEMENTS = [
  {
    id: "first_dive",
    name: "First Dive",
    desc: "Complete your first meditation",
    emoji: "⚓",
    color: "oklch(0.75 0.12 215)",
    check: (s: ReturnType<typeof getGameState>) => s.completedMeditations >= 1,
  },
  {
    id: "wave_rider",
    name: "Wave Rider",
    desc: "Complete 5 meditations",
    emoji: "🌊",
    color: "oklch(0.62 0.16 285)",
    check: (s: ReturnType<typeof getGameState>) => s.completedMeditations >= 5,
  },
  {
    id: "deep_diver",
    name: "Deep Diver",
    desc: "Reach Level 5",
    emoji: "🔭",
    color: "oklch(0.68 0.18 325)",
    check: (s: ReturnType<typeof getGameState>) => getLevelFromXP(s.xp) >= 4,
  },
  {
    id: "fire_streak",
    name: "Fire Streak",
    desc: "Maintain a 7-day streak",
    emoji: "🔥",
    color: "oklch(0.75 0.18 30)",
    check: (s: ReturnType<typeof getGameState>) => s.streak >= 7,
  },
  {
    id: "journaler",
    name: "Soul Journaler",
    desc: "Write 5 journal entries",
    emoji: "📔",
    color: "oklch(0.70 0.14 145)",
    check: (s: ReturnType<typeof getGameState>) => s.journalCount >= 5,
  },
  {
    id: "shredder_pro",
    name: "Release Master",
    desc: "Use the Thought Shredder 5 times",
    emoji: "🪼",
    color: "oklch(0.72 0.15 250)",
    check: (s: ReturnType<typeof getGameState>) => s.shredderCount >= 5,
  },
  {
    id: "social_jelly",
    name: "Aura's Friend",
    desc: "Chat with Aura 20 times",
    emoji: "💙",
    color: "oklch(0.68 0.14 215)",
    check: (s: ReturnType<typeof getGameState>) => s.chatCount >= 20,
  },
  {
    id: "ancient_mariner",
    name: "Ancient Mariner",
    desc: "Reach Level 20",
    emoji: "🚢",
    color: "oklch(0.82 0.18 50)",
    check: (s: ReturnType<typeof getGameState>) => getLevelFromXP(s.xp) >= 19,
  },
];

const LEVEL_CREATURES = [
  "🪸",
  "🐠",
  "🦑",
  "🐬",
  "🐢",
  "🐳",
  "🐡",
  "🪼",
  "🐙",
  "🐭",
  "🦈",
  "🐟",
  "🐠",
  "🐋",
  "🌊",
  "🔭",
  "🚭",
  "☀️",
  "🌌",
  "⚓",
];

export default function Journey({
  onNavigate,
}: { onNavigate: (p: string) => void }) {
  const { xp, level, levelName, streak, refreshState } = useApp();
  const [_gameState, setGameState] = useState(getGameState);
  const [dailyChallenges] = useState(getDailyChallenges);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [prevLevel, setPrevLevel] = useState(level);

  // biome-ignore lint/correctness/useExhaustiveDependencies: xp triggers refresh
  useEffect(() => {
    const s = getGameState();
    setGameState(s);
  }, [xp]);

  useEffect(() => {
    if (level > prevLevel && prevLevel > 0) {
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 3000);
    }
    setPrevLevel(level);
  }, [level, prevLevel]);

  const { current: xpCurrent, needed: xpNeeded } = getXPForNextLevel(xp);
  const progressPct =
    xpNeeded > 0 ? Math.min(100, (xpCurrent / xpNeeded) * 100) : 100;

  const claimChallenge = (id: string, action: string | null) => {
    const state = getGameState();
    if (state.completedChallenges.includes(id)) {
      toast.info("Already claimed!");
      return;
    }
    const challenge = CHALLENGE_POOL.find((c) => c.id === id);
    if (!challenge) return;
    if (!challenge.check(state)) {
      if (action) {
        onNavigate(action);
      } else {
        toast.info("Complete the task first!");
      }
      return;
    }
    completeChallengeById(id);
    refreshState();
    setGameState(getGameState());
    toast.success("✨ Challenge complete! +75 XP", { duration: 3000 });
  };

  const currentState = getGameState();

  return (
    <div className="min-h-screen ocean-bg pt-20 pb-16 px-4">
      {/* Level up animation */}
      {showLevelUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="text-center animate-level-up">
            <div className="text-8xl mb-4">
              {LEVEL_CREATURES[level] ?? "🪼"}
            </div>
            <div className="font-display text-4xl font-bold text-gradient-cyan">
              Level Up!
            </div>
            <div
              className="text-xl mt-2"
              style={{ color: "oklch(0.75 0.12 215)" }}
            >
              {levelName}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="pt-6 mb-8 animate-slide-up">
          <div className="flex items-center gap-3 mb-2">
            <Zap
              className="w-6 h-6"
              style={{ color: "oklch(0.75 0.12 215)" }}
            />
            <h1 className="font-display text-4xl font-bold text-gradient-cyan">
              My Journey
            </h1>
          </div>
          <p style={{ color: "oklch(0.65 0.04 225)" }}>
            Track your progress through the depths.
          </p>
        </div>

        {/* Level card */}
        <div
          className="glass-card p-6 mb-6 glow-cyan"
          style={{ border: "1px solid oklch(0.75 0.12 215 / 0.3)" }}
          data-ocid="journey.card"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                style={{
                  background: "oklch(0.75 0.12 215 / 0.15)",
                  border: "2px solid oklch(0.75 0.12 215 / 0.4)",
                }}
              >
                {LEVEL_CREATURES[level] ?? "🪼"}
              </div>
              <div>
                <div className="font-display text-2xl font-bold text-gradient-cyan">
                  Level {level + 1}
                </div>
                <div
                  className="text-base font-medium"
                  style={{ color: "oklch(0.78 0.08 215)" }}
                >
                  {levelName}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div
                className="font-display text-3xl font-bold"
                style={{ color: "oklch(0.75 0.12 215)" }}
              >
                {xp} XP
              </div>
              <div
                className="text-sm"
                style={{ color: "oklch(0.65 0.04 225)" }}
              >
                {xpCurrent} / {xpNeeded} to next level
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-1.5">
            <div
              className="flex justify-between text-xs"
              style={{ color: "oklch(0.65 0.04 225)" }}
            >
              <span>Progress to Level {level + 2}</span>
              <span style={{ color: "oklch(0.75 0.12 215)" }}>
                {Math.round(progressPct)}%
              </span>
            </div>
            <div
              className="h-3 rounded-full overflow-hidden"
              style={{ background: "oklch(0.20 0.04 235)" }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${progressPct}%`,
                  background:
                    "linear-gradient(90deg, oklch(0.50 0.16 280), oklch(0.75 0.12 215))",
                  animation: "progress-glow 2s ease-in-out infinite",
                  transition: "width 0.8s ease",
                }}
              />
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            {
              label: "Day Streak",
              value: streak,
              icon: <Flame className="w-5 h-5" />,
              color: "oklch(0.75 0.18 30)",
            },
            {
              label: "Meditations",
              value: currentState.completedMeditations,
              icon: <span className="text-lg">🌊</span>,
              color: "oklch(0.75 0.12 215)",
            },
            {
              label: "Journal Entries",
              value: currentState.journalCount,
              icon: <span className="text-lg">📔</span>,
              color: "oklch(0.62 0.16 285)",
            },
            {
              label: "Thoughts Released",
              value: currentState.shredderCount,
              icon: <span className="text-lg">🪼</span>,
              color: "oklch(0.68 0.18 325)",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="glass-card p-4 text-center"
              data-ocid="journey.card"
            >
              <div
                style={{ color: stat.color }}
                className="flex justify-center mb-1"
              >
                {stat.icon}
              </div>
              <div
                className="font-display text-2xl font-bold"
                style={{ color: stat.color }}
              >
                {stat.value}
              </div>
              <div
                className="text-xs mt-0.5"
                style={{ color: "oklch(0.60 0.04 225)" }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Daily Challenges */}
        <div className="glass-card p-5 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles
              className="w-5 h-5"
              style={{ color: "oklch(0.75 0.12 215)" }}
            />
            <h2
              className="font-display text-xl font-bold"
              style={{ color: "oklch(0.90 0.02 220)" }}
            >
              Daily Challenges
            </h2>
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: "oklch(0.75 0.12 215 / 0.15)",
                color: "oklch(0.75 0.12 215)",
              }}
            >
              Resets daily
            </span>
          </div>
          <div className="space-y-3" data-ocid="journey.list">
            {dailyChallenges.map((challenge, i) => {
              const claimed = currentState.completedChallenges.includes(
                challenge.id,
              );
              const completed = challenge.check(currentState);
              return (
                <div
                  key={challenge.id}
                  className="flex items-center justify-between gap-4 p-3 rounded-xl"
                  style={{
                    background: claimed
                      ? "oklch(0.75 0.12 215 / 0.10)"
                      : "oklch(0.18 0.035 235 / 0.5)",
                    border: `1px solid ${claimed ? "oklch(0.75 0.12 215 / 0.4)" : "oklch(0.28 0.04 235 / 0.4)"}`,
                  }}
                  data-ocid={`journey.item.${i + 1}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{challenge.emoji}</span>
                    <div>
                      <p
                        className="text-sm font-medium"
                        style={{
                          color: claimed
                            ? "oklch(0.75 0.12 215)"
                            : "oklch(0.88 0.02 220)",
                          textDecoration: claimed ? "line-through" : "none",
                        }}
                      >
                        {challenge.label}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: "oklch(0.60 0.04 225)" }}
                      >
                        +{challenge.xp} XP
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all shrink-0"
                    style={{
                      background: claimed
                        ? "oklch(0.75 0.12 215 / 0.2)"
                        : completed
                          ? "oklch(0.50 0.16 280)"
                          : "oklch(0.22 0.04 235 / 0.7)",
                      color: claimed
                        ? "oklch(0.75 0.12 215)"
                        : completed
                          ? "white"
                          : "oklch(0.65 0.04 225)",
                    }}
                    onClick={() =>
                      claimChallenge(challenge.id, challenge.action)
                    }
                    disabled={claimed}
                    data-ocid={`journey.item.${i + 1}`}
                  >
                    {claimed ? "✓ Done" : completed ? "Claim XP" : "Go"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Achievements */}
        <div className="glass-card p-5 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Trophy
              className="w-5 h-5"
              style={{ color: "oklch(0.75 0.18 30)" }}
            />
            <h2
              className="font-display text-xl font-bold"
              style={{ color: "oklch(0.90 0.02 220)" }}
            >
              Achievements
            </h2>
          </div>
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-3"
            data-ocid="journey.list"
          >
            {ACHIEVEMENTS.map((ach, i) => {
              const unlocked = ach.check(currentState);
              return (
                <div
                  key={ach.id}
                  className={`p-4 rounded-xl text-center transition-all ${unlocked ? "" : "opacity-50"}`}
                  style={{
                    background: unlocked
                      ? `${ach.color}18`
                      : "oklch(0.16 0.03 235 / 0.5)",
                    border: `1px solid ${unlocked ? `${ach.color}50` : "oklch(0.24 0.04 235 / 0.4)"}`,

                    boxShadow: unlocked ? `0 0 20px ${ach.color}25` : "none",
                  }}
                  data-ocid={`journey.item.${i + 1}`}
                >
                  <div className="text-2xl mb-2">
                    {unlocked ? ach.emoji : "🔒"}
                  </div>
                  <p
                    className="text-xs font-semibold"
                    style={{
                      color: unlocked ? ach.color : "oklch(0.65 0.04 225)",
                    }}
                  >
                    {ach.name}
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: "oklch(0.55 0.04 225)" }}
                  >
                    {ach.desc}
                  </p>
                  {unlocked && (
                    <div
                      className="text-xs mt-2 px-2 py-0.5 rounded-full"
                      style={{ background: `${ach.color}20`, color: ach.color }}
                    >
                      Unlocked ✔
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Level roadmap */}
        <div className="glass-card p-5">
          <h2
            className="font-display text-xl font-bold mb-4"
            style={{ color: "oklch(0.90 0.02 220)" }}
          >
            Level Roadmap
          </h2>
          <div
            className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide"
            data-ocid="journey.list"
          >
            {LEVEL_NAMES.map((name, i) => {
              const isCurrentLevel = i === level;
              const isPast = i < level;
              const threshold = LEVEL_THRESHOLDS[i];
              return (
                <div
                  key={name}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg"
                  style={{
                    background: isCurrentLevel
                      ? "oklch(0.75 0.12 215 / 0.12)"
                      : isPast
                        ? "oklch(0.18 0.04 235 / 0.4)"
                        : "transparent",
                    border: `1px solid ${isCurrentLevel ? "oklch(0.75 0.12 215 / 0.4)" : "transparent"}`,
                  }}
                  data-ocid={`journey.item.${i + 1}`}
                >
                  <div className="text-lg shrink-0">
                    {LEVEL_CREATURES[i] ?? "🪼"}
                  </div>
                  <div className="flex-1">
                    <span
                      className="text-sm font-medium"
                      style={{
                        color: isCurrentLevel
                          ? "oklch(0.82 0.12 210)"
                          : isPast
                            ? "oklch(0.65 0.06 220)"
                            : "oklch(0.55 0.04 225)",
                      }}
                    >
                      Lv.{i + 1} — {name}
                    </span>
                  </div>
                  <span
                    className="text-xs"
                    style={{ color: "oklch(0.55 0.04 225)" }}
                  >
                    {threshold} XP
                  </span>
                  {isPast && (
                    <span style={{ color: "oklch(0.75 0.12 215)" }}>✔</span>
                  )}
                  {isCurrentLevel && (
                    <Zap
                      className="w-3.5 h-3.5"
                      style={{ color: "oklch(0.75 0.12 215)" }}
                    />
                  )}
                  {!isPast && !isCurrentLevel && (
                    <Lock
                      className="w-3 h-3"
                      style={{ color: "oklch(0.45 0.04 225)" }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
