import { Progress } from "@/components/ui/progress";
import {
  Anchor,
  Fish,
  Flame,
  Lock,
  Shell,
  Sparkles,
  Star,
  Trophy,
  Zap,
} from "lucide-react";
import { useProfile } from "../hooks/useQueries";

const XP_PER_LEVEL = 100;

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  check: (xp: number, streak: number, unlocked: number) => boolean;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_dive",
    name: "First Dive",
    description: "Complete your first meditation session",
    icon: <Anchor className="w-6 h-6" />,
    color: "oklch(var(--cyan))",
    check: (xp) => xp >= 50,
  },
  {
    id: "ocean_explorer",
    name: "Ocean Explorer",
    description: "Complete 5 meditation sessions",
    icon: <Fish className="w-6 h-6" />,
    color: "oklch(var(--purple-light))",
    check: (xp) => xp >= 250,
  },
  {
    id: "deep_diver",
    name: "Deep Diver",
    description: "Complete 10 meditation sessions",
    icon: <Star className="w-6 h-6" />,
    color: "oklch(var(--bio-pink))",
    check: (xp) => xp >= 500,
  },
  {
    id: "tidal_wave",
    name: "Tidal Wave",
    description: "Maintain a 7-day streak",
    icon: <Flame className="w-6 h-6" />,
    color: "oklch(0.75 0.18 30)",
    check: (_, streak) => streak >= 7,
  },
  {
    id: "coral_keeper",
    name: "Coral Keeper",
    description: "Unlock 5 sea creature collectibles",
    icon: <Shell className="w-6 h-6" />,
    color: "oklch(0.75 0.15 160)",
    check: (_, __, unlocked) => unlocked >= 5,
  },
  {
    id: "bioluminescent",
    name: "Bioluminescent",
    description: "Reach Level 5 in your journey",
    icon: <Sparkles className="w-6 h-6" />,
    color: "oklch(0.82 0.20 300)",
    check: (xp) => Math.floor(xp / XP_PER_LEVEL) >= 5,
  },
];

const FALLBACK_PROFILE = {
  xp: 250,
  streak: 3,
  lastSession: BigInt(0),
  unlockedCollectibles: new Uint32Array([0, 1, 2]),
};

const STREAK_DAYS = [1, 2, 3, 4, 5, 6, 7];

export default function Journey() {
  const { data: profile, isLoading } = useProfile();
  const p = profile ?? FALLBACK_PROFILE;
  const xp = p.xp;
  const streak = p.streak;
  const level = Math.floor(xp / XP_PER_LEVEL);
  const xpInLevel = xp % XP_PER_LEVEL;
  const unlockedCount = Array.from(p.unlockedCollectibles).length;

  const LEVEL_NAMES = [
    "Tide Pool",
    "Coastal Explorer",
    "Open Water",
    "Deep Sea",
    "Abyss Diver",
    "Ocean Master",
  ];
  const levelName = LEVEL_NAMES[Math.min(level, LEVEL_NAMES.length - 1)];

  if (isLoading) {
    return (
      <div
        className="min-h-screen ocean-bg pt-24 flex items-center justify-center"
        data-ocid="journey.loading_state"
      >
        <div className="text-center space-y-3">
          <div className="text-4xl animate-glow-pulse">🪼</div>
          <p style={{ color: "oklch(var(--muted-foreground))" }}>
            Retrieving your journey...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ocean-bg pt-24 pb-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 animate-slide-up">
          <div className="flex items-center gap-3 mb-4">
            <Trophy
              className="w-7 h-7"
              style={{ color: "oklch(var(--cyan))" }}
            />
            <h1
              className="font-display text-4xl font-bold"
              style={{ color: "oklch(var(--foreground))" }}
            >
              Your Journey
            </h1>
          </div>
          <p style={{ color: "oklch(var(--muted-foreground))" }}>
            Track your meditation progress and unlock achievements.
          </p>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10"
          data-ocid="journey.section"
        >
          {/* XP Card */}
          <div className="glass-card p-6 glow-cyan" data-ocid="journey.card">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="p-2 rounded-xl"
                style={{ background: "oklch(var(--cyan) / 0.15)" }}
              >
                <Zap
                  className="w-5 h-5"
                  style={{ color: "oklch(var(--cyan))" }}
                />
              </div>
              <span
                className="text-sm font-medium"
                style={{ color: "oklch(var(--muted-foreground))" }}
              >
                Experience Points
              </span>
            </div>
            <div className="font-display text-5xl font-extrabold text-gradient-cyan mb-1">
              {xp.toLocaleString()}
            </div>
            <div
              className="text-sm mb-4"
              style={{ color: "oklch(var(--muted-foreground))" }}
            >
              Level {level} · {levelName}
            </div>
            <div className="space-y-1.5">
              <div
                className="flex justify-between text-xs"
                style={{ color: "oklch(var(--muted-foreground))" }}
              >
                <span>Next level</span>
                <span style={{ color: "oklch(var(--cyan))" }}>
                  {xpInLevel} / {XP_PER_LEVEL} XP
                </span>
              </div>
              <Progress
                value={(xpInLevel / XP_PER_LEVEL) * 100}
                className="h-2"
              />
            </div>
          </div>

          {/* Streak Card */}
          <div className="glass-card p-6 glow-purple" data-ocid="journey.card">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="p-2 rounded-xl"
                style={{ background: "oklch(var(--bio-pink) / 0.15)" }}
              >
                <Flame
                  className="w-5 h-5"
                  style={{ color: "oklch(var(--bio-pink))" }}
                />
              </div>
              <span
                className="text-sm font-medium"
                style={{ color: "oklch(var(--muted-foreground))" }}
              >
                Daily Streak
              </span>
            </div>
            <div className="font-display text-5xl font-extrabold text-gradient-purple mb-1">
              {streak}
            </div>
            <div
              className="text-sm mb-4"
              style={{ color: "oklch(var(--muted-foreground))" }}
            >
              days in a row
            </div>
            <div className="flex gap-1.5">
              {STREAK_DAYS.map((day) => (
                <div
                  key={day}
                  className="flex-1 h-6 rounded-sm"
                  style={{
                    background:
                      day <= streak
                        ? "linear-gradient(180deg, oklch(var(--bio-pink)), oklch(var(--purple-light)))"
                        : "oklch(var(--border))",
                    boxShadow:
                      day <= streak
                        ? "0 0 8px oklch(var(--bio-pink) / 0.4)"
                        : "none",
                  }}
                />
              ))}
            </div>
            <p
              className="text-xs mt-3"
              style={{ color: "oklch(var(--muted-foreground))" }}
            >
              {streak >= 7
                ? "🏆 On fire! Tidal Wave achieved!"
                : streak >= 3
                  ? "🌊 Great momentum! Keep going!"
                  : "🌱 Every tide starts somewhere."}
            </p>
          </div>

          {/* Summary Card */}
          <div className="glass-card p-6 glow-bio" data-ocid="journey.card">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="p-2 rounded-xl"
                style={{ background: "oklch(var(--purple-light) / 0.15)" }}
              >
                <Star
                  className="w-5 h-5"
                  style={{ color: "oklch(var(--purple-light))" }}
                />
              </div>
              <span
                className="text-sm font-medium"
                style={{ color: "oklch(var(--muted-foreground))" }}
              >
                Summary
              </span>
            </div>
            <div className="space-y-4">
              {[
                { label: "Sessions done", value: Math.floor(xp / 50) },
                { label: "Collectibles", value: `${unlockedCount} / 20` },
                {
                  label: "Achievements",
                  value: `${ACHIEVEMENTS.filter((a) => a.check(xp, streak, unlockedCount)).length} / ${ACHIEVEMENTS.length}`,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between"
                >
                  <span
                    className="text-sm"
                    style={{ color: "oklch(var(--muted-foreground))" }}
                  >
                    {item.label}
                  </span>
                  <span
                    className="font-display font-bold"
                    style={{ color: "oklch(var(--foreground))" }}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div data-ocid="journey.section">
          <h2
            className="font-display text-2xl font-bold mb-6"
            style={{ color: "oklch(var(--foreground))" }}
          >
            Achievements
          </h2>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            data-ocid="journey.list"
          >
            {ACHIEVEMENTS.map((ach, i) => {
              const unlocked = ach.check(xp, streak, unlockedCount);
              const achBg = unlocked
                ? ach.color.replace(")", " / 0.15)")
                : "oklch(var(--muted) / 0.5)";
              const achGlow = unlocked
                ? `0 0 20px ${ach.color.replace(")", " / 0.4)")}`
                : "none";
              return (
                <div
                  key={ach.id}
                  className={`glass-card p-5 transition-all ${unlocked ? "animate-badge-unlock" : "opacity-50"}`}
                  style={unlocked ? { boxShadow: achGlow } : {}}
                  data-ocid={`journey.item.${i + 1}`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="p-3 rounded-xl shrink-0"
                      style={{
                        background: achBg,
                        color: unlocked
                          ? ach.color
                          : "oklch(var(--muted-foreground))",
                      }}
                    >
                      {unlocked ? ach.icon : <Lock className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3
                        className="font-display font-semibold"
                        style={{
                          color: unlocked
                            ? "oklch(var(--foreground))"
                            : "oklch(var(--muted-foreground))",
                        }}
                      >
                        {ach.name}
                      </h3>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: "oklch(var(--muted-foreground))" }}
                      >
                        {ach.description}
                      </p>
                    </div>
                  </div>
                  {unlocked && (
                    <div
                      className="mt-3 text-xs font-semibold text-right"
                      style={{ color: ach.color }}
                    >
                      ✓ Unlocked
                    </div>
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
