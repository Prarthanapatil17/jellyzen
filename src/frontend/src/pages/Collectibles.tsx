import { Progress } from "@/components/ui/progress";
import { Lock } from "lucide-react";
import { useProfile } from "../hooks/useQueries";

const ALL_CREATURES = [
  {
    id: 0,
    emoji: "🪼",
    name: "Crystal Jellyfish",
    rarity: "Legendary",
    description: "Aura herself — bioluminescent guardian of the deep.",
  },
  {
    id: 1,
    emoji: "🐠",
    name: "Clownfish",
    rarity: "Common",
    description: "Bright and cheerful dweller of coral reefs.",
  },
  {
    id: 2,
    emoji: "🦈",
    name: "Blue Shark",
    rarity: "Rare",
    description: "Swift predator of the open ocean.",
  },
  {
    id: 3,
    emoji: "🐙",
    name: "Octopus",
    rarity: "Rare",
    description: "Master of camouflage and intelligence.",
  },
  {
    id: 4,
    emoji: "🦑",
    name: "Glowing Squid",
    rarity: "Epic",
    description: "Bioluminescent squid of midnight waters.",
  },
  {
    id: 5,
    emoji: "🐡",
    name: "Pufferfish",
    rarity: "Common",
    description: "Spiky defender of the coral neighborhood.",
  },
  {
    id: 6,
    emoji: "🦀",
    name: "Red Crab",
    rarity: "Common",
    description: "Scuttling across the sandy ocean floor.",
  },
  {
    id: 7,
    emoji: "🐚",
    name: "Nautilus",
    rarity: "Epic",
    description: "Ancient spiral-shelled philosopher of the sea.",
  },
  {
    id: 8,
    emoji: "⭐",
    name: "Starfish",
    rarity: "Common",
    description: "Five-armed star of the tidal pools.",
  },
  {
    id: 9,
    emoji: "🐬",
    name: "Dolphin",
    rarity: "Rare",
    description: "Joyful acrobat of the ocean waves.",
  },
  {
    id: 10,
    emoji: "🐋",
    name: "Blue Whale",
    rarity: "Legendary",
    description: "Largest creature to ever grace Earth's oceans.",
  },
  {
    id: 11,
    emoji: "🦞",
    name: "Lobster",
    rarity: "Common",
    description: "Armored wanderer of the ocean floor.",
  },
  {
    id: 12,
    emoji: "🐟",
    name: "Angelfish",
    rarity: "Rare",
    description: "Graceful striped beauty of tropical seas.",
  },
  {
    id: 13,
    emoji: "🦐",
    name: "Shrimp",
    rarity: "Common",
    description: "Tiny but vital link in the ocean food chain.",
  },
  {
    id: 14,
    emoji: "🐢",
    name: "Sea Turtle",
    rarity: "Epic",
    description: "Ancient navigator of the deep blue.",
  },
  {
    id: 15,
    emoji: "🪸",
    name: "Coral",
    rarity: "Rare",
    description: "Living reef-builder, home to thousands.",
  },
  {
    id: 16,
    emoji: "🦭",
    name: "Sea Lion",
    rarity: "Rare",
    description: "Playful flippered friend of rocky shores.",
  },
  {
    id: 17,
    emoji: "🐳",
    name: "Humpback Whale",
    rarity: "Legendary",
    description: "Singer of the deep, composer of whale songs.",
  },
  {
    id: 18,
    emoji: "🦋",
    name: "Manta Ray",
    rarity: "Epic",
    description: "Graceful glider of the open ocean.",
  },
  {
    id: 19,
    emoji: "🌊",
    name: "Sea Dragon",
    rarity: "Legendary",
    description: "Mythical spirit of the endless ocean.",
  },
];

const RARITY_COLORS: Record<string, string> = {
  Common: "oklch(var(--muted-foreground))",
  Rare: "oklch(var(--cyan))",
  Epic: "oklch(var(--purple-light))",
  Legendary: "oklch(var(--bio-pink))",
};

const RARITY_GLOW: Record<string, string> = {
  Common: "none",
  Rare: "0 0 15px oklch(var(--cyan) / 0.4)",
  Epic: "0 0 15px oklch(var(--purple-light) / 0.5)",
  Legendary:
    "0 0 20px oklch(var(--bio-pink) / 0.6), 0 0 40px oklch(var(--bio-pink) / 0.2)",
};

const FALLBACK_UNLOCKED = [0, 1, 2];

export default function Collectibles() {
  const { data: profile } = useProfile();
  const unlockedIds = profile
    ? Array.from(profile.unlockedCollectibles)
    : FALLBACK_UNLOCKED;

  const unlockedCount = unlockedIds.length;
  const total = ALL_CREATURES.length;

  return (
    <div className="min-h-screen ocean-bg pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 animate-slide-up">
          <h1
            className="font-display text-4xl font-bold mb-3"
            style={{ color: "oklch(var(--foreground))" }}
          >
            Sea Creature Collectibles
          </h1>
          <p
            className="mb-6"
            style={{ color: "oklch(var(--muted-foreground))" }}
          >
            Discover and collect all creatures of the deep. Complete sessions
            and reach milestones to unlock more.
          </p>

          {/* Progress bar */}
          <div className="glass-card p-5 mb-8" data-ocid="collectibles.card">
            <div className="flex justify-between items-center mb-3">
              <div
                className="font-display font-semibold"
                style={{ color: "oklch(var(--foreground))" }}
              >
                Collection Progress
              </div>
              <div
                className="font-display text-xl font-bold"
                style={{ color: "oklch(var(--cyan))" }}
              >
                {unlockedCount} / {total}
              </div>
            </div>
            <Progress value={(unlockedCount / total) * 100} className="h-3" />
            <div
              className="flex justify-between text-xs mt-2"
              style={{ color: "oklch(var(--muted-foreground))" }}
            >
              <span>Keep meditating to unlock more creatures!</span>
              <span>{Math.round((unlockedCount / total) * 100)}%</span>
            </div>
          </div>

          {/* Rarity legend */}
          <div className="flex flex-wrap gap-3 mb-8">
            {Object.entries(RARITY_COLORS).map(([rarity, color]) => (
              <div
                key={rarity}
                className="flex items-center gap-2 glass-card px-3 py-1.5"
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: color }}
                />
                <span className="text-xs" style={{ color }}>
                  {rarity}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Creatures grid */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          data-ocid="collectibles.list"
        >
          {ALL_CREATURES.map((creature, i) => {
            const unlocked = unlockedIds.includes(creature.id);
            const rarityColor = RARITY_COLORS[creature.rarity];
            const glow = unlocked ? RARITY_GLOW[creature.rarity] : "none";
            return (
              <div
                key={creature.id}
                className={`glass-card p-4 text-center group transition-all ${
                  unlocked
                    ? "hover:scale-110 cursor-pointer"
                    : "opacity-40 grayscale"
                }`}
                style={
                  unlocked
                    ? {
                        boxShadow: glow,
                        borderColor: rarityColor.replace(")", " / 0.4)"),
                      }
                    : {}
                }
                data-ocid={`collectibles.item.${i + 1}`}
              >
                <div
                  className={`text-5xl mb-3 transition-transform ${unlocked ? "group-hover:scale-125" : ""}`}
                >
                  {unlocked ? (
                    creature.emoji
                  ) : (
                    <div className="flex items-center justify-center w-12 h-12 mx-auto">
                      <Lock
                        className="w-7 h-7"
                        style={{ color: "oklch(var(--muted-foreground))" }}
                      />
                    </div>
                  )}
                </div>
                <div
                  className="font-display text-xs font-semibold mb-1"
                  style={{
                    color: unlocked
                      ? "oklch(var(--foreground))"
                      : "oklch(var(--muted-foreground))",
                  }}
                >
                  {unlocked ? creature.name : "???"}
                </div>
                {unlocked && (
                  <div
                    className="text-xs font-medium"
                    style={{ color: rarityColor }}
                  >
                    {creature.rarity}
                  </div>
                )}
                {unlocked && (
                  <div
                    className="text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity leading-tight"
                    style={{ color: "oklch(var(--muted-foreground))" }}
                  >
                    {creature.description}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Unlock hint */}
        <div
          className="mt-10 glass-card p-6 text-center"
          data-ocid="collectibles.empty_state"
        >
          <div className="text-3xl mb-3">🌊</div>
          <h3
            className="font-display text-lg font-semibold mb-2"
            style={{ color: "oklch(var(--foreground))" }}
          >
            How to unlock more creatures
          </h3>
          <div
            className="flex flex-wrap gap-3 justify-center text-sm"
            style={{ color: "oklch(var(--muted-foreground))" }}
          >
            <span className="glass-card px-3 py-1.5">
              ✨ Complete meditation sessions
            </span>
            <span className="glass-card px-3 py-1.5">
              🔥 Maintain daily streaks
            </span>
            <span className="glass-card px-3 py-1.5">
              ⚡ Gain experience points
            </span>
            <span className="glass-card px-3 py-1.5">🏆 Earn achievements</span>
          </div>
        </div>
      </div>
    </div>
  );
}
