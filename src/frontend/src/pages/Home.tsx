import { ChevronLeft, ChevronRight, Clock, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import JellyfishSVG from "../components/JellyfishSVG";
import { useMeditationSessions } from "../hooks/useQueries";

interface HomeProps {
  onNavigate: (page: string) => void;
  onOpenChat: () => void;
}

const SESSION_GRADIENTS = [
  "from-[#0a1628] via-[#1a3a5c] to-[#0d2040]",
  "from-[#120820] via-[#2a1458] to-[#0f1535]",
  "from-[#060d1a] via-[#0d2a3a] to-[#0a1828]",
  "from-[#0c1020] via-[#1e2850] to-[#080f22]",
  "from-[#0d0820] via-[#22106a] to-[#0a0f28]",
  "from-[#080d18] via-[#102040] to-[#06101a]",
];

const FALLBACK_SESSIONS = [
  {
    id: 1,
    title: "Deep Ocean Breath",
    duration: 12,
    category: "Breathwork",
    difficulty: "Beginner",
    description: "Dive into calming oceanic breathing rhythms",
  },
  {
    id: 2,
    title: "Coral Reef Visualization",
    duration: 18,
    category: "Visualization",
    difficulty: "Intermediate",
    description: "Journey through vibrant coral ecosystems",
  },
  {
    id: 3,
    title: "Midnight Tide Sleep",
    duration: 25,
    category: "Sleep",
    difficulty: "Beginner",
    description: "Let the tide carry you into deep restful sleep",
  },
  {
    id: 4,
    title: "Current Focus Flow",
    duration: 15,
    category: "Focus",
    difficulty: "Intermediate",
    description: "Harness the power of the deep-sea current",
  },
  {
    id: 5,
    title: "Bioluminescent Dream",
    duration: 20,
    category: "Visualization",
    difficulty: "Advanced",
    description: "Discover your inner light in the deep sea",
  },
  {
    id: 6,
    title: "Whale Song Breathing",
    duration: 10,
    category: "Breathwork",
    difficulty: "Beginner",
    description: "Breathe in harmony with the ocean giants",
  },
];

const STAR_POSITIONS = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  top: Math.abs((i * 137.5) % 100),
  left: Math.abs((i * 97.3) % 100),
  delay: Math.abs((i * 0.37) % 4),
  size: i % 5 === 0 ? 3 : i % 3 === 0 ? 2 : 1.5,
}));

const BUBBLE_SIZES = [
  { width: 8, height: 8, bottom: 20, left: 10 },
  { width: 14, height: 14, bottom: 45, left: 25 },
  { width: 20, height: 20, bottom: 70, left: 40 },
  { width: 26, height: 26, bottom: 95, left: 55 },
];

export default function Home({ onNavigate, onOpenChat }: HomeProps) {
  const { data: backendSessions } = useMeditationSessions();
  const sessions =
    backendSessions && backendSessions.length > 0
      ? backendSessions
      : FALLBACK_SESSIONS;
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [chatVisible, setChatVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setChatVisible(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const visibleCount = 3;
  const maxIndex = Math.max(0, sessions.length - visibleCount);

  return (
    <div className="min-h-screen ocean-bg relative overflow-hidden">
      {/* Star field */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {STAR_POSITIONS.map((s) => (
          <div
            key={s.id}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              animationDuration: `${2.5 + s.delay}s`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Hero */}
      <section
        className="relative pt-28 pb-20 px-6 max-w-7xl mx-auto"
        data-ocid="home.section"
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-7rem)]">
          {/* Left column */}
          <div className="animate-slide-up space-y-8 z-10">
            <div
              className="inline-flex items-center gap-2 glass-card px-4 py-2 text-sm"
              style={{ color: "oklch(var(--cyan))" }}
            >
              <span className="animate-glow-pulse inline-block">🪼</span>
              <span>Your ocean sanctuary awaits</span>
            </div>
            <h1 className="font-display text-5xl lg:text-7xl font-extrabold leading-tight text-gradient-cyan">
              Find Your
              <br />
              Ocean Within
            </h1>
            <p
              className="text-lg leading-relaxed"
              style={{ color: "oklch(var(--muted-foreground))" }}
            >
              Dive deep with{" "}
              <span
                style={{ color: "oklch(var(--cyan))" }}
                className="font-semibold"
              >
                Aura
              </span>
              , your bioluminescent jellyfish guide. Experience guided
              meditations, breathing exercises, and ocean visualizations
              designed to calm the storm within.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                className="btn-gradient text-white font-semibold px-8 py-4 rounded-full text-lg"
                onClick={() => onNavigate("meditations")}
                data-ocid="home.primary_button"
              >
                Begin Your Journey
              </button>
              <button
                type="button"
                className="btn-cyan font-semibold px-8 py-4 rounded-full text-lg"
                onClick={onOpenChat}
                data-ocid="home.secondary_button"
              >
                Chat with Aura
              </button>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              {[
                { label: "Guided Sessions", value: "24+" },
                { label: "Sea Creatures", value: "20" },
                { label: "Daily Explorers", value: "2.4k" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="glass-card px-4 py-2 text-center"
                >
                  <div
                    className="font-display font-bold text-xl"
                    style={{ color: "oklch(var(--cyan))" }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "oklch(var(--muted-foreground))" }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="relative flex justify-center items-center">
            <div className="animate-float animate-glow-pulse">
              <JellyfishSVG size={340} />
            </div>

            {chatVisible && (
              <button
                type="button"
                className="absolute bottom-8 -left-4 lg:-left-16 glass-card p-4 max-w-xs text-left animate-fade-in hover:scale-105 transition-transform"
                style={{ border: "1px solid oklch(var(--cyan) / 0.3)" }}
                onClick={onOpenChat}
                data-ocid="home.open_modal_button"
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl animate-glow-pulse shrink-0">🪼</div>
                  <div>
                    <p
                      className="text-xs font-semibold mb-1"
                      style={{ color: "oklch(var(--cyan))" }}
                    >
                      Aura
                    </p>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "oklch(var(--foreground))" }}
                    >
                      Hello, I&apos;m Aura 🌊 Ready to find your calm in the
                      deep? Tap to chat!
                    </p>
                  </div>
                </div>
              </button>
            )}

            {BUBBLE_SIZES.map((b, i) => (
              <div
                key={b.left}
                className="absolute rounded-full border"
                style={{
                  width: `${b.width}px`,
                  height: `${b.height}px`,
                  bottom: `${b.bottom}%`,
                  left: `${b.left}%`,
                  borderColor: "oklch(var(--cyan) / 0.35)",
                  background: "oklch(var(--cyan) / 0.06)",
                  animation: `bubble-rise ${3 + i * 0.8}s ease-in infinite`,
                  animationDelay: `${i * 0.9}s`,
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Today's Guided Sessions */}
      <section
        className="px-6 py-16 max-w-7xl mx-auto"
        data-ocid="meditations.section"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2
              className="font-display text-3xl font-bold"
              style={{ color: "oklch(var(--foreground))" }}
            >
              Today&apos;s Guided Sessions
            </h2>
            <p
              className="mt-1 text-sm"
              style={{ color: "oklch(var(--muted-foreground))" }}
            >
              Curated for your ocean journey
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="glass-card p-2 rounded-full transition-all disabled:opacity-40"
              onClick={() => setCarouselIndex((p) => Math.max(0, p - 1))}
              disabled={carouselIndex === 0}
              data-ocid="meditations.pagination_prev"
            >
              <ChevronLeft
                className="w-5 h-5"
                style={{ color: "oklch(var(--cyan))" }}
              />
            </button>
            <button
              type="button"
              className="glass-card p-2 rounded-full transition-all disabled:opacity-40"
              onClick={() => setCarouselIndex((p) => Math.min(maxIndex, p + 1))}
              disabled={carouselIndex >= maxIndex}
              data-ocid="meditations.pagination_next"
            >
              <ChevronRight
                className="w-5 h-5"
                style={{ color: "oklch(var(--cyan))" }}
              />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 overflow-hidden">
          {sessions
            .slice(carouselIndex, carouselIndex + visibleCount)
            .map((session, i) => (
              <div
                key={session.id}
                className={`glass-card p-6 bg-gradient-to-br ${SESSION_GRADIENTS[(session.id - 1) % SESSION_GRADIENTS.length]} group`}
                data-ocid={`meditations.item.${i + 1}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{
                      background: "oklch(var(--cyan) / 0.15)",
                      color: "oklch(var(--cyan))",
                    }}
                  >
                    {session.category}
                  </span>
                  <div
                    className="flex items-center gap-1 text-xs"
                    style={{ color: "oklch(var(--muted-foreground))" }}
                  >
                    <Clock className="w-3 h-3" />
                    <span>{session.duration}min</span>
                  </div>
                </div>
                <h3
                  className="font-display text-lg font-bold mb-2"
                  style={{ color: "oklch(var(--foreground))" }}
                >
                  {session.title}
                </h3>
                <p
                  className="text-sm mb-4"
                  style={{ color: "oklch(var(--muted-foreground))" }}
                >
                  {session.description}
                </p>
                <button
                  type="button"
                  className="btn-gradient text-white text-sm font-semibold w-full py-2 rounded-lg"
                  onClick={() => onNavigate("meditations")}
                >
                  Start Session
                </button>
              </div>
            ))}
        </div>
      </section>

      {/* Progress Preview */}
      <section
        className="px-6 py-16 max-w-7xl mx-auto"
        data-ocid="journey.section"
      >
        <h2
          className="font-display text-3xl font-bold mb-8"
          style={{ color: "oklch(var(--foreground))" }}
        >
          Your Progress
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <button
            type="button"
            className="glass-card p-6 glow-cyan text-center hover:scale-[1.02] transition-transform w-full"
            onClick={() => onNavigate("journey")}
            data-ocid="journey.card"
          >
            <Zap
              className="w-8 h-8 mx-auto mb-3"
              style={{ color: "oklch(var(--cyan))" }}
            />
            <div className="font-display text-4xl font-bold text-gradient-cyan">
              250 XP
            </div>
            <div
              className="text-sm mt-1"
              style={{ color: "oklch(var(--muted-foreground))" }}
            >
              Level 2 Explorer
            </div>
          </button>
          <button
            type="button"
            className="glass-card p-6 glow-purple text-center hover:scale-[1.02] transition-transform w-full"
            onClick={() => onNavigate("journey")}
            data-ocid="journey.card"
          >
            <span className="text-3xl block mb-3">🔥</span>
            <div className="font-display text-4xl font-bold text-gradient-purple">
              3 Days
            </div>
            <div
              className="text-sm mt-1"
              style={{ color: "oklch(var(--muted-foreground))" }}
            >
              Current Streak
            </div>
          </button>
          <button
            type="button"
            className="glass-card p-6 glow-bio text-center hover:scale-[1.02] transition-transform w-full"
            onClick={() => onNavigate("collectibles")}
            data-ocid="collectibles.card"
          >
            <span className="text-3xl block mb-3">🏆</span>
            <div
              className="font-display text-4xl font-bold"
              style={{ color: "oklch(var(--bio-pink))" }}
            >
              3 / 20
            </div>
            <div
              className="text-sm mt-1"
              style={{ color: "oklch(var(--muted-foreground))" }}
            >
              Creatures Found
            </div>
          </button>
        </div>
      </section>

      {/* Collectibles Preview */}
      <section
        className="px-6 py-16 max-w-7xl mx-auto"
        data-ocid="collectibles.section"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2
              className="font-display text-3xl font-bold"
              style={{ color: "oklch(var(--foreground))" }}
            >
              My Collectible Sea Creatures
            </h2>
            <p
              className="mt-1 text-sm"
              style={{ color: "oklch(var(--muted-foreground))" }}
            >
              3 of 20 discovered
            </p>
          </div>
          <button
            type="button"
            className="btn-cyan px-4 py-2 rounded-lg text-sm"
            onClick={() => onNavigate("collectibles")}
            data-ocid="collectibles.button"
          >
            View All
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {[
            { emoji: "🪼", name: "Crystal Jellyfish", unlocked: true },
            { emoji: "🐠", name: "Clownfish", unlocked: true },
            { emoji: "🦈", name: "Blue Shark", unlocked: true },
            { emoji: "🐙", name: "Octopus", unlocked: false },
            { emoji: "🦑", name: "Glowing Squid", unlocked: false },
            { emoji: "🐡", name: "Pufferfish", unlocked: false },
          ].map((c, i) => (
            <div
              key={c.name}
              className={`glass-card p-4 min-w-[120px] text-center shrink-0 transition-all ${
                c.unlocked ? "glow-bio hover:scale-110" : "opacity-50 grayscale"
              }`}
              data-ocid={`collectibles.item.${i + 1}`}
            >
              <div className="text-4xl mb-2">{c.unlocked ? c.emoji : "🔒"}</div>
              <div
                className="text-xs font-medium"
                style={{
                  color: c.unlocked
                    ? "oklch(var(--foreground))"
                    : "oklch(var(--muted-foreground))",
                }}
              >
                {c.unlocked ? c.name : "???"}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 glass-card p-4">
          <div
            className="flex justify-between text-xs mb-2"
            style={{ color: "oklch(var(--muted-foreground))" }}
          >
            <span>Collection Progress</span>
            <span style={{ color: "oklch(var(--cyan))" }}>3 / 20</span>
          </div>
          <div
            className="h-2 rounded-full overflow-hidden"
            style={{ background: "oklch(var(--border))" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: "15%",
                background:
                  "linear-gradient(90deg, oklch(var(--cyan)), oklch(var(--purple-light)))",
                animation: "progress-glow 2s ease-in-out infinite",
              }}
            />
          </div>
        </div>
      </section>

      <footer
        className="text-center py-8 px-6"
        style={{ color: "oklch(var(--muted-foreground))" }}
      >
        <p className="text-sm">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
            style={{ color: "oklch(var(--cyan))" }}
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
