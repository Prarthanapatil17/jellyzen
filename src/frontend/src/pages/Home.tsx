import {
  Book,
  ChevronLeft,
  ChevronRight,
  Clock,
  Wind,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import JellyfishSVG from "../components/JellyfishSVG";
import { useApp } from "../contexts/AppContext";
import { useMeditationSessions } from "../hooks/useQueries";

interface HomeProps {
  onNavigate: (page: string) => void;
  onOpenChat: () => void;
}

const SESSION_CARDS = [
  {
    id: 1,
    title: "Deep Ocean Breath",
    duration: 10,
    category: "Breathwork",
    emoji: "🌊",
    gradient: "from-[#061525] via-[#0e3058]",
  },
  {
    id: 2,
    title: "Coral Reef Visualization",
    duration: 18,
    category: "Visualization",
    emoji: "🦒",
    gradient: "from-[#150830] via-[#2e1460]",
  },
  {
    id: 3,
    title: "Midnight Tide Sleep",
    duration: 25,
    category: "Sleep",
    emoji: "🌙",
    gradient: "from-[#060c1a] via-[#0c2035]",
  },
  {
    id: 4,
    title: "Current Focus Flow",
    duration: 15,
    category: "Focus",
    emoji: "🌿",
    gradient: "from-[#081018] via-[#142a18]",
  },
  {
    id: 5,
    title: "Bioluminescent Dream",
    duration: 20,
    category: "Visualization",
    emoji: "✨",
    gradient: "from-[#0a0618] via-[#1e0a55]",
  },
  {
    id: 6,
    title: "Whale Song Breathing",
    duration: 12,
    category: "Breathwork",
    emoji: "🐋",
    gradient: "from-[#060f1a] via-[#0c2540]",
  },
];

const FEATURES = [
  {
    emoji: "🌊",
    title: "6 Ambient Sessions",
    desc: "Real sound synthesis: ocean waves, rain, binaural beats & more",
    page: "meditations",
  },
  {
    emoji: "📔",
    title: "Private Journal",
    desc: "Write, reflect, and earn XP for each entry",
    page: "journal",
  },
  {
    emoji: "🪼",
    title: "Thought Shredder",
    desc: "Vent freely — watch your thoughts dissolve into the ocean",
    page: "release",
  },
  {
    emoji: "⚡",
    title: "XP & Levels",
    desc: "20 levels, daily challenges, and unlockable achievements",
    page: "journey",
  },
];

export default function Home({ onNavigate, onOpenChat }: HomeProps) {
  const { xp, level, levelName, streak } = useApp();
  const { data: backendSessions } = useMeditationSessions();
  const sessions =
    backendSessions && backendSessions.length > 0
      ? SESSION_CARDS
      : SESSION_CARDS;
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [chatVisible, setChatVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setChatVisible(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const visibleCount = 3;
  const maxIndex = Math.max(0, sessions.length - visibleCount);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero */}
      <section
        className="relative pt-24 pb-16 px-4 max-w-7xl mx-auto"
        data-ocid="home.section"
      >
        <div className="grid lg:grid-cols-2 gap-10 items-center min-h-[calc(100vh-7rem)]">
          {/* Left */}
          <div className="animate-slide-up space-y-7 z-10">
            <div
              className="inline-flex items-center gap-2 glass-card px-4 py-2 text-sm"
              style={{ color: "oklch(0.75 0.12 215)" }}
            >
              <span className="animate-glow-pulse">🪼</span>
              <span>Your ocean sanctuary awaits</span>
            </div>
            <h1 className="font-display text-5xl lg:text-7xl font-extrabold leading-tight text-gradient-cyan">
              Find Your
              <br />
              Ocean Within
            </h1>
            <p
              className="text-lg leading-relaxed"
              style={{ color: "oklch(0.65 0.04 225)" }}
            >
              Dive deep with{" "}
              <span
                style={{ color: "oklch(0.82 0.12 210)" }}
                className="font-semibold"
              >
                Aura
              </span>
              , your bioluminescent jellyfish guide. Meditate, journal, release,
              and grow through your ocean journey.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="btn-gradient text-white font-semibold px-7 py-3.5 rounded-full text-base"
                onClick={() => onNavigate("meditations")}
                data-ocid="home.primary_button"
              >
                Begin Journey
              </button>
              <button
                type="button"
                className="btn-cyan font-semibold px-7 py-3.5 rounded-full text-base"
                onClick={onOpenChat}
                data-ocid="home.secondary_button"
              >
                Chat with Aura
              </button>
            </div>
            {/* Live stats from context */}
            <div className="flex flex-wrap gap-3">
              {[
                {
                  label: "Current XP",
                  value: `${xp}`,
                  color: "oklch(0.75 0.12 215)",
                },
                {
                  label: levelName,
                  value: `Lv.${level + 1}`,
                  color: "oklch(0.62 0.16 285)",
                },
                {
                  label: "Day Streak",
                  value: `${streak}🔥`,
                  color: "oklch(0.75 0.18 30)",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="glass-card px-4 py-2 text-center"
                >
                  <div
                    className="font-display font-bold text-xl"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "oklch(0.60 0.04 225)" }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="relative flex justify-center items-center">
            <div className="animate-float animate-glow-pulse">
              <JellyfishSVG size={320} />
            </div>

            {chatVisible && (
              <button
                type="button"
                className="absolute bottom-8 -left-4 lg:-left-12 glass-card p-4 max-w-xs text-left animate-fade-in hover:scale-105 transition-transform"
                style={{ border: "1px solid oklch(0.75 0.12 215 / 0.3)" }}
                onClick={onOpenChat}
                data-ocid="home.open_modal_button"
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl animate-glow-pulse shrink-0">🪼</div>
                  <div>
                    <p
                      className="text-xs font-semibold mb-1"
                      style={{ color: "oklch(0.75 0.12 215)" }}
                    >
                      Aura
                    </p>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "oklch(0.90 0.02 220)" }}
                    >
                      Hello! 🌊 Ready to find your calm? I\'m here to guide you.
                    </p>
                  </div>
                </div>
              </button>
            )}

            {/* Rising bubbles decoration */}
            {[8, 14, 20, 26].map((size, i) => (
              <div
                key={size}
                className="absolute rounded-full border"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  bottom: `${20 + i * 18}%`,
                  left: `${10 + i * 12}%`,
                  borderColor: "oklch(0.75 0.12 215 / 0.35)",
                  background: "oklch(0.75 0.12 215 / 0.06)",
                  animation: `bubble-rise ${3 + i * 0.8}s ease-in infinite`,
                  animationDelay: `${i * 0.9}s`,
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Feature highlights */}
      <section
        className="px-4 py-12 max-w-7xl mx-auto"
        data-ocid="home.section"
      >
        <h2
          className="font-display text-3xl font-bold mb-6"
          style={{ color: "oklch(0.93 0.02 220)" }}
        >
          Your Wellness Tools
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {FEATURES.map((f) => (
            <button
              key={f.title}
              type="button"
              className="glass-card p-5 text-left hover:scale-[1.03] transition-all group"
              onClick={() => onNavigate(f.page)}
              data-ocid="home.card"
            >
              <div className="text-3xl mb-3">{f.emoji}</div>
              <h3
                className="font-display font-semibold text-sm mb-1"
                style={{ color: "oklch(0.90 0.02 220)" }}
              >
                {f.title}
              </h3>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "oklch(0.60 0.04 225)" }}
              >
                {f.desc}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Session carousel */}
      <section
        className="px-4 py-12 max-w-7xl mx-auto"
        data-ocid="meditations.section"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2
              className="font-display text-3xl font-bold"
              style={{ color: "oklch(0.93 0.02 220)" }}
            >
              Guided Sessions
            </h2>
            <p
              className="text-sm mt-1"
              style={{ color: "oklch(0.60 0.04 225)" }}
            >
              With real ambient sounds
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="glass-card p-2 rounded-full disabled:opacity-40"
              onClick={() => setCarouselIndex((p) => Math.max(0, p - 1))}
              disabled={carouselIndex === 0}
              data-ocid="meditations.pagination_prev"
            >
              <ChevronLeft
                className="w-5 h-5"
                style={{ color: "oklch(0.75 0.12 215)" }}
              />
            </button>
            <button
              type="button"
              className="glass-card p-2 rounded-full disabled:opacity-40"
              onClick={() => setCarouselIndex((p) => Math.min(maxIndex, p + 1))}
              disabled={carouselIndex >= maxIndex}
              data-ocid="meditations.pagination_next"
            >
              <ChevronRight
                className="w-5 h-5"
                style={{ color: "oklch(0.75 0.12 215)" }}
              />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SESSION_CARDS.slice(carouselIndex, carouselIndex + visibleCount).map(
            (s, i) => (
              <div
                key={s.id}
                className={`glass-card p-5 bg-gradient-to-br ${s.gradient} group hover:scale-[1.02] transition-all`}
                data-ocid={`meditations.item.${i + 1}`}
              >
                <div className="text-3xl mb-3">{s.emoji}</div>
                <span
                  className="text-xs font-medium px-2.5 py-1 rounded-full mb-3 inline-block"
                  style={{
                    background: "oklch(0.75 0.12 215 / 0.15)",
                    color: "oklch(0.75 0.12 215)",
                  }}
                >
                  {s.category}
                </span>
                <h3
                  className="font-display font-bold mb-1"
                  style={{ color: "oklch(0.93 0.02 220)" }}
                >
                  {s.title}
                </h3>
                <div
                  className="flex items-center gap-1 text-xs mb-4"
                  style={{ color: "oklch(0.60 0.04 225)" }}
                >
                  <Clock className="w-3 h-3" /> {s.duration} min
                </div>
                <button
                  type="button"
                  className="btn-gradient text-white text-xs font-semibold w-full py-2 rounded-lg"
                  onClick={() => onNavigate("meditations")}
                  data-ocid="meditations.primary_button"
                >
                  Start Session
                </button>
              </div>
            ),
          )}
        </div>
      </section>

      {/* Progress + Quick Actions */}
      <section
        className="px-4 py-12 max-w-7xl mx-auto"
        data-ocid="journey.section"
      >
        <h2
          className="font-display text-3xl font-bold mb-6"
          style={{ color: "oklch(0.93 0.02 220)" }}
        >
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            type="button"
            className="glass-card p-6 glow-cyan text-center hover:scale-[1.02] transition-transform"
            onClick={() => onNavigate("meditations")}
            data-ocid="home.primary_button"
          >
            <Wind
              className="w-8 h-8 mx-auto mb-3"
              style={{ color: "oklch(0.75 0.12 215)" }}
            />
            <div className="font-display text-xl font-bold text-gradient-cyan">
              Meditate
            </div>
            <div
              className="text-sm mt-1"
              style={{ color: "oklch(0.60 0.04 225)" }}
            >
              +50 XP per session
            </div>
          </button>
          <button
            type="button"
            className="glass-card p-6 glow-purple text-center hover:scale-[1.02] transition-transform"
            onClick={() => onNavigate("journal")}
            data-ocid="home.secondary_button"
          >
            <Book
              className="w-8 h-8 mx-auto mb-3"
              style={{ color: "oklch(0.62 0.16 285)" }}
            />
            <div className="font-display text-xl font-bold text-gradient-purple">
              Journal
            </div>
            <div
              className="text-sm mt-1"
              style={{ color: "oklch(0.60 0.04 225)" }}
            >
              +30 XP per entry
            </div>
          </button>
          <button
            type="button"
            className="glass-card p-6 glow-bio text-center hover:scale-[1.02] transition-transform"
            onClick={() => onNavigate("release")}
            data-ocid="home.secondary_button"
          >
            <span className="text-3xl block mb-3">🪼</span>
            <div
              className="font-display text-xl font-bold"
              style={{ color: "oklch(0.68 0.18 325)" }}
            >
              Release
            </div>
            <div
              className="text-sm mt-1"
              style={{ color: "oklch(0.60 0.04 225)" }}
            >
              +20 XP per release
            </div>
          </button>
        </div>
      </section>

      <footer
        className="text-center py-10 px-4"
        style={{ color: "oklch(0.50 0.04 225)" }}
      >
        <p className="text-xs">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
            style={{ color: "oklch(0.75 0.12 215)" }}
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
