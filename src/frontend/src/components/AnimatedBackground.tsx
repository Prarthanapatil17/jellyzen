import { useEffect, useRef } from "react";
import type { TimeMode } from "../contexts/AppContext";

const BUBBLE_COUNT = 18;
const bubbles = Array.from({ length: BUBBLE_COUNT }, (_, i) => ({
  id: i,
  size: 6 + ((i * 7.3) % 20),
  left: (i * 13.7 + 3) % 96,
  delay: (i * 0.7) % 6,
  duration: 8 + ((i * 1.3) % 10),
}));

const GRADIENTS: Record<TimeMode, string> = {
  day: "linear-gradient(180deg, oklch(0.65 0.18 195) 0%, oklch(0.52 0.14 210) 35%, oklch(0.32 0.10 225) 70%, oklch(0.20 0.07 235) 100%)",
  sunset:
    "linear-gradient(180deg, oklch(0.72 0.18 40) 0%, oklch(0.58 0.20 20) 25%, oklch(0.42 0.18 310) 60%, oklch(0.18 0.06 265) 100%)",
  night:
    "linear-gradient(180deg, oklch(0.12 0.035 255) 0%, oklch(0.10 0.03 245) 40%, oklch(0.07 0.025 240) 75%, oklch(0.05 0.02 235) 100%)",
};

const BUBBLE_COLORS: Record<TimeMode, string> = {
  day: "oklch(0.95 0.05 200 / 0.5)",
  sunset: "oklch(0.92 0.12 30 / 0.4)",
  night: "oklch(0.75 0.12 215 / 0.35)",
};

const WAVE_COLORS: Record<TimeMode, string> = {
  day: "oklch(0.45 0.12 210 / 0.6)",
  sunset: "oklch(0.38 0.15 295 / 0.7)",
  night: "oklch(0.12 0.04 245 / 0.8)",
};

const GLOW_COLORS: Record<TimeMode, string> = {
  day: "oklch(0.75 0.20 195 / 0.15)",
  sunset: "oklch(0.65 0.22 25 / 0.20)",
  night: "oklch(0.52 0.18 280 / 0.12)",
};

const STARS = Array.from({ length: 50 }, (_, i) => ({
  id: `s${i * 17 + 3}`,
  w: i % 5 === 0 ? "2.5px" : i % 3 === 0 ? "1.5px" : "1px",
  top: `${(i * 47.3) % 70}%`,
  left: `${(i * 31.7) % 98}%`,
  opacity: 0.6,
  dur: `${2.5 + ((i * 0.37) % 3)}s`,
  delay: `${(i * 0.3) % 4}s`,
}));

export default function AnimatedBackground({
  timeMode,
}: { timeMode: TimeMode }) {
  const prevMode = useRef(timeMode);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    prevMode.current = timeMode;
  }, [timeMode]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{
        background: GRADIENTS[timeMode],
        transition: "background 1.5s ease",
      }}
      aria-hidden="true"
    >
      {/* Ambient glow orbs */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "60vw",
          height: "60vw",
          top: "-20vw",
          left: "-10vw",
          background: GLOW_COLORS[timeMode],
          filter: "blur(80px)",
          transition: "background 1.5s ease",
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "40vw",
          height: "40vw",
          bottom: "10vh",
          right: "-10vw",
          background: GLOW_COLORS[timeMode],
          filter: "blur(60px)",
          transition: "background 1.5s ease",
        }}
      />

      {/* Floating bubbles */}
      {bubbles.map((b) => (
        <div
          key={b.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: `${b.size}px`,
            height: `${b.size}px`,
            left: `${b.left}%`,
            bottom: "-30px",
            background: BUBBLE_COLORS[timeMode],
            border: `1px solid ${BUBBLE_COLORS[timeMode]}`,
            animation: `bg-bubble-rise ${b.duration}s ease-in ${b.delay}s infinite`,
            transition: "background 1.5s ease, border-color 1.5s ease",
          }}
        />
      ))}

      {/* Wave layers at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ height: "120px" }}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="w-full h-full"
          style={{ display: "block" }}
        >
          <path
            d="M0,60 C180,100 360,20 540,60 C720,100 900,20 1080,60 C1260,100 1350,40 1440,60 L1440,120 L0,120 Z"
            fill={WAVE_COLORS[timeMode]}
            style={{
              animation: "wave-motion 8s ease-in-out infinite",
              transition: "fill 1.5s ease",
            }}
          />
          <path
            d="M0,80 C200,40 400,100 600,80 C800,60 1000,100 1200,80 C1300,70 1380,85 1440,80 L1440,120 L0,120 Z"
            fill={WAVE_COLORS[timeMode]}
            opacity="0.5"
            style={{
              animation: "wave-motion 12s ease-in-out 2s infinite reverse",
              transition: "fill 1.5s ease",
            }}
          />
        </svg>
      </div>

      {/* Stars (night only) */}
      {timeMode === "night" &&
        STARS.map((s) => (
          <div
            key={s.id}
            className="absolute rounded-full bg-white"
            style={{
              width: s.w,
              height: s.w,
              top: s.top,
              left: s.left,
              opacity: s.opacity,
              animation: `twinkle ${s.dur} ease-in-out ${s.delay} infinite`,
            }}
          />
        ))}
    </div>
  );
}
