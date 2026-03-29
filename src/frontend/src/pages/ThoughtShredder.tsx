import { useRef, useState } from "react";
import { toast } from "sonner";
import { useApp } from "../contexts/AppContext";
import { playPopSound } from "../utils/audioEngine";

type Phase = "idle" | "rising" | "wobble" | "pop" | "message";

const AFFIRMATIONS = [
  "Released. You don't need to carry that anymore.",
  "Let it go. The ocean takes what you no longer need.",
  "That thought has returned to the sea. You are lighter now.",
  "Released into the deep. Your mind is clear.",
  "Gone. You are free from that weight.",
  "The wave has passed. You remain, calm and whole.",
];

const PARTICLE_COUNT = 20;
const PARTICLES = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
  const angle = (i / PARTICLE_COUNT) * 360;
  const dist = 80 + (i % 3) * 40;
  const tx = Math.round(Math.cos((angle * Math.PI) / 180) * dist);
  const ty = Math.round(Math.sin((angle * Math.PI) / 180) * dist);
  const colors = [
    "oklch(0.75 0.12 215)",
    "oklch(0.62 0.16 285)",
    "oklch(0.68 0.18 325)",
    "oklch(0.72 0.12 195)",
  ];
  return {
    id: i,
    tx,
    ty,
    color: colors[i % colors.length],
    size: 6 + (i % 4) * 3,
  };
});

export default function ThoughtShredder() {
  const { doAction } = useApp();
  const [phase, setPhase] = useState<Phase>("idle");
  const [thought, setThought] = useState("");
  const [affirmation, setAffirmation] = useState("");
  const audioCtxRef = useRef<AudioContext | null>(null);
  const affirmIdx = useRef(0);

  const getAudioCtx = () => {
    if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
      audioCtxRef.current = new AudioContext();
    }
    if (audioCtxRef.current.state === "suspended") audioCtxRef.current.resume();
    return audioCtxRef.current;
  };

  const release = () => {
    if (!thought.trim() || phase !== "idle") return;

    // Phase 1: text rises
    setPhase("rising");
    setTimeout(() => {
      // Phase 2: bubble wobbles
      setPhase("wobble");
      setTimeout(() => {
        // Phase 3: bubble pops
        setPhase("pop");
        playPopSound(getAudioCtx());
        setTimeout(() => {
          // Phase 4: show message
          affirmIdx.current = (affirmIdx.current + 1) % AFFIRMATIONS.length;
          setAffirmation(AFFIRMATIONS[affirmIdx.current]);
          doAction("shredder");
          toast.success("+20 XP for releasing a thought 🪼", {
            duration: 2500,
          });
          setPhase("message");
          setThought("");
          setTimeout(() => setPhase("idle"), 3000);
        }, 600);
      }, 600);
    }, 800);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) release();
  };

  const bubbleClass =
    phase === "wobble"
      ? "animate-bubble-wobble"
      : phase === "pop"
        ? "animate-bubble-pop"
        : "animate-bubble-pulse";

  return (
    <div
      className="min-h-screen ocean-bg pt-20 pb-16 px-4 flex flex-col"
      data-ocid="release.panel"
    >
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col">
        <div className="pt-6 mb-8 text-center animate-slide-up">
          <div className="text-5xl mb-3">🪼</div>
          <h1 className="font-display text-4xl font-bold text-gradient-cyan mb-2">
            Release It
          </h1>
          <p style={{ color: "oklch(0.65 0.04 225)" }} className="text-sm">
            Vent freely. Nothing is saved. Watch your thoughts dissolve into the
            ocean.
          </p>
        </div>

        {/* Bubble + interaction area */}
        <div className="flex-1 flex flex-col items-center justify-center gap-6 relative">
          {/* Bubble */}
          {phase !== "pop" && phase !== "message" && (
            <div className="relative">
              <svg
                width="220"
                height="220"
                viewBox="0 0 220 220"
                className={bubbleClass}
                style={{ overflow: "visible" }}
                aria-hidden="true"
              >
                <title>Thought bubble</title>
                {/* Glow filter */}
                <defs>
                  <filter id="bubble-glow">
                    <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <radialGradient id="bubble-fill" cx="40%" cy="35%">
                    <stop offset="0%" stopColor="oklch(0.82 0.12 215 / 0.25)" />
                    <stop
                      offset="60%"
                      stopColor="oklch(0.62 0.16 285 / 0.15)"
                    />
                    <stop
                      offset="100%"
                      stopColor="oklch(0.50 0.16 280 / 0.08)"
                    />
                  </radialGradient>
                </defs>
                <circle
                  cx="110"
                  cy="110"
                  r="100"
                  fill="url(#bubble-fill)"
                  stroke="oklch(0.75 0.12 215 / 0.6)"
                  strokeWidth="1.5"
                  filter="url(#bubble-glow)"
                />
                {/* Highlight */}
                <ellipse
                  cx="80"
                  cy="75"
                  rx="22"
                  ry="12"
                  fill="white"
                  opacity="0.12"
                  transform="rotate(-30 80 75)"
                />
                <ellipse
                  cx="90"
                  cy="82"
                  rx="8"
                  ry="4"
                  fill="white"
                  opacity="0.08"
                  transform="rotate(-30 90 82)"
                />
              </svg>

              {/* Rising text inside bubble */}
              {thought && (
                <div
                  className={`absolute inset-0 flex items-center justify-center px-6 text-center text-sm pointer-events-none ${phase === "rising" ? "animate-text-rise" : ""}`}
                  style={{ color: "oklch(0.85 0.06 220)", lineHeight: 1.5 }}
                >
                  <span className="line-clamp-4">{thought}</span>
                </div>
              )}
            </div>
          )}

          {/* Particles explosion */}
          {phase === "pop" && (
            <div
              className="relative"
              style={{ width: "220px", height: "220px" }}
            >
              {PARTICLES.map((p) => (
                <div
                  key={p.id}
                  className="absolute rounded-full"
                  style={{
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                    left: "50%",
                    top: "50%",
                    marginLeft: `-${p.size / 2}px`,
                    marginTop: `-${p.size / 2}px`,
                    background: p.color,
                    boxShadow: `0 0 8px ${p.color}`,
                    animation: "particle-fly 0.6s ease-out forwards",
                    // @ts-expect-error CSS custom properties
                    "--tx": `${p.tx}px`,
                    "--ty": `${p.ty}px`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Affirmation */}
          {phase === "message" && (
            <div className="text-center animate-fade-in px-6">
              <div className="text-5xl mb-4">✨</div>
              <p
                className="font-display text-2xl font-semibold leading-relaxed"
                style={{ color: "oklch(0.82 0.12 210)" }}
              >
                {affirmation}
              </p>
              <p
                className="text-sm mt-4"
                style={{ color: "oklch(0.60 0.04 225)" }}
              >
                A new bubble awaits...
              </p>
            </div>
          )}

          {/* Textarea input */}
          {(phase === "idle" || phase === "rising") && (
            <div
              className={`w-full max-w-md ${
                phase === "rising"
                  ? "opacity-0 pointer-events-none"
                  : "opacity-100"
              } transition-opacity duration-300`}
            >
              <div
                className="glass-card p-4"
                style={{ border: "1px solid oklch(0.75 0.12 215 / 0.25)" }}
              >
                <p
                  className="text-xs mb-3"
                  style={{ color: "oklch(0.60 0.04 225)" }}
                >
                  Type your thought, then release it. Nothing is stored.
                </p>
                <textarea
                  value={thought}
                  onChange={(e) => setThought(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="What’s on your mind right now? Let it out..."
                  className="w-full bg-transparent outline-none resize-none text-sm"
                  style={{
                    color: "oklch(0.88 0.02 220)",
                    minHeight: "100px",
                  }}
                  rows={4}
                  data-ocid="release.textarea"
                />
                <div
                  className="flex items-center justify-between mt-3 pt-3"
                  style={{ borderTop: "1px solid oklch(0.28 0.045 235 / 0.4)" }}
                >
                  <p
                    className="text-xs"
                    style={{ color: "oklch(0.50 0.04 225)" }}
                  >
                    Ctrl+Enter to release
                  </p>
                  <button
                    type="button"
                    className="btn-gradient text-white font-semibold px-6 py-2 rounded-full text-sm disabled:opacity-40"
                    onClick={release}
                    disabled={!thought.trim()}
                    data-ocid="release.primary_button"
                  >
                    Release 🪼
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="mt-8 grid grid-cols-3 gap-3 text-center">
          {[
            { emoji: "🔒", text: "Not stored anywhere" },
            { emoji: "💭", text: "Safe to be honest" },
            { emoji: "✨", text: "+20 XP per release" },
          ].map((tip) => (
            <div key={tip.text} className="glass-card p-3">
              <div className="text-xl mb-1">{tip.emoji}</div>
              <p className="text-xs" style={{ color: "oklch(0.65 0.04 225)" }}>
                {tip.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
