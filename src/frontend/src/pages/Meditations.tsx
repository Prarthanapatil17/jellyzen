import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, Play, Waves, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useMeditationSessions } from "../hooks/useQueries";

const FALLBACK_SESSIONS = [
  {
    id: 1,
    title: "Deep Ocean Breath",
    duration: 12,
    category: "Breathwork",
    difficulty: "Beginner",
    description:
      "Immerse yourself in calming oceanic breathing rhythms. Feel the ebb and flow of each breath like the gentle tide.",
  },
  {
    id: 2,
    title: "Coral Reef Visualization",
    duration: 18,
    category: "Visualization",
    difficulty: "Intermediate",
    description:
      "Journey through vibrant coral ecosystems teeming with color. Let your mind explore the beauty of the underwater world.",
  },
  {
    id: 3,
    title: "Midnight Tide Sleep",
    duration: 25,
    category: "Sleep",
    difficulty: "Beginner",
    description:
      "Let the rhythm of the midnight tide carry you into deep, restful sleep. Perfect for quieting a busy mind.",
  },
  {
    id: 4,
    title: "Current Focus Flow",
    duration: 15,
    category: "Focus",
    difficulty: "Intermediate",
    description:
      "Harness the power of the deep-sea current to sharpen your focus. Like water finding its path, your mind finds clarity.",
  },
  {
    id: 5,
    title: "Bioluminescent Dream",
    duration: 20,
    category: "Visualization",
    difficulty: "Advanced",
    description:
      "Discover your inner light in the darkest ocean depths. A profound journey into self-luminous awareness.",
  },
  {
    id: 6,
    title: "Whale Song Breathing",
    duration: 10,
    category: "Breathwork",
    difficulty: "Beginner",
    description:
      "Breathe in harmony with the ancient songs of ocean giants. Let their resonance fill your body with peace.",
  },
];

const SESSION_GRADIENTS = [
  { from: "#0d2240", via: "#1a4a7a", accent: "oklch(0.82 0.12 210)" },
  { from: "#180d38", via: "#3a1a78", accent: "oklch(0.65 0.18 290)" },
  { from: "#071828", via: "#0d3550", accent: "oklch(0.60 0.10 200)" },
  { from: "#0c1030", via: "#1e2860", accent: "oklch(0.55 0.16 260)" },
  { from: "#100828", via: "#280f70", accent: "oklch(0.70 0.20 330)" },
  { from: "#081018", via: "#102848", accent: "oklch(0.72 0.12 195)" },
];

const CATEGORY_EMOJIS: Record<string, string> = {
  Breathwork: "💨",
  Visualization: "✨",
  Sleep: "🌙",
  Focus: "🎯",
  default: "🌊",
};

interface MeditationSession {
  id: number;
  title: string;
  duration: number;
  category: string;
  difficulty: string;
  description: string;
}

interface TimerState {
  session: MeditationSession;
  secondsLeft: number;
  totalSeconds: number;
  running: boolean;
  done: boolean;
}

export default function Meditations() {
  const { data: backendSessions } = useMeditationSessions();
  const sessions =
    backendSessions && backendSessions.length > 0
      ? backendSessions
      : FALLBACK_SESSIONS;
  const [timerState, setTimerState] = useState<TimerState | null>(null);
  const [completedIds, setCompletedIds] = useState<number[]>([]);

  const startSession = (session: MeditationSession) => {
    const totalSeconds = session.duration * 60;
    setTimerState({
      session,
      secondsLeft: totalSeconds,
      totalSeconds,
      running: false,
      done: false,
    });
  };

  const toggleTimer = () => {
    if (!timerState || timerState.done) return;
    if (!timerState.running) {
      const interval = setInterval(() => {
        setTimerState((prev) => {
          if (!prev || !prev.running) {
            clearInterval(interval);
            return prev;
          }
          if (prev.secondsLeft <= 1) {
            clearInterval(interval);
            setCompletedIds((ids) => [...ids, prev.session.id]);
            toast.success(`${prev.session.title} complete! +50 XP 🎉`, {
              duration: 4000,
            });
            return { ...prev, secondsLeft: 0, running: false, done: true };
          }
          return { ...prev, secondsLeft: prev.secondsLeft - 1 };
        });
      }, 1000);
      setTimerState((p) => (p ? { ...p, running: true } : p));
    } else {
      setTimerState((p) => (p ? { ...p, running: false } : p));
    }
  };

  const closeTimer = () => setTimerState(null);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen ocean-bg pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 animate-slide-up">
          <div className="flex items-center gap-3 mb-4">
            <Waves
              className="w-7 h-7"
              style={{ color: "oklch(var(--cyan))" }}
            />
            <h1
              className="font-display text-4xl font-bold"
              style={{ color: "oklch(var(--foreground))" }}
            >
              Guided Sessions
            </h1>
          </div>
          <p style={{ color: "oklch(var(--muted-foreground))" }}>
            Choose your depth. Each session is a unique underwater journey.
          </p>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          data-ocid="meditations.list"
        >
          {sessions.map((session, i) => {
            const gradient = SESSION_GRADIENTS[i % SESSION_GRADIENTS.length];
            const done = completedIds.includes(session.id);
            const emoji =
              CATEGORY_EMOJIS[session.category] ?? CATEGORY_EMOJIS.default;
            const accentBg = gradient.accent.replace(")", " / 0.15)");
            return (
              <div
                key={session.id}
                className="glass-card overflow-hidden group hover:scale-[1.03] transition-all relative"
                style={{
                  background: `linear-gradient(145deg, ${gradient.from}, ${gradient.via})`,
                }}
                data-ocid={`meditations.item.${i + 1}`}
              >
                {done && (
                  <div className="absolute top-3 right-3">
                    <CheckCircle
                      className="w-5 h-5"
                      style={{ color: "oklch(var(--cyan))" }}
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="text-4xl mb-4">{emoji}</div>
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span
                      className="text-xs font-semibold px-3 py-1 rounded-full"
                      style={{ background: accentBg, color: gradient.accent }}
                    >
                      {session.category}
                    </span>
                    <span
                      className="text-xs font-medium px-2 py-1 rounded-full"
                      style={{
                        background: "oklch(var(--border) / 0.5)",
                        color: "oklch(var(--muted-foreground))",
                      }}
                    >
                      {session.difficulty}
                    </span>
                  </div>
                  <h3
                    className="font-display text-xl font-bold mb-2"
                    style={{ color: "oklch(var(--foreground))" }}
                  >
                    {session.title}
                  </h3>
                  <p
                    className="text-sm mb-5 leading-relaxed"
                    style={{ color: "oklch(var(--muted-foreground))" }}
                  >
                    {session.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div
                      className="flex items-center gap-1.5 text-sm"
                      style={{ color: "oklch(var(--muted-foreground))" }}
                    >
                      <Clock className="w-4 h-4" />
                      <span>{session.duration} minutes</span>
                    </div>
                    <button
                      type="button"
                      className="btn-gradient text-white text-sm font-semibold px-5 py-2 rounded-full flex items-center gap-2"
                      onClick={() => startSession(session)}
                      data-ocid={`meditations.item.${i + 1}`}
                    >
                      <Play className="w-3.5 h-3.5" />
                      {done ? "Replay" : "Start"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Dialog
        open={!!timerState}
        onOpenChange={(open) => !open && closeTimer()}
      >
        <DialogContent
          className="max-w-md border-0"
          style={{
            background: "oklch(0.12 0.03 235 / 0.97)",
            backdropFilter: "blur(20px)",
            borderColor: "oklch(var(--border))",
          }}
          data-ocid="meditations.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-gradient-cyan">
              {timerState?.session.title}
            </DialogTitle>
          </DialogHeader>

          {timerState && (
            <div className="space-y-6 py-4">
              <div className="flex justify-center">
                <div
                  className="relative w-40 h-40 rounded-full flex items-center justify-center"
                  style={{
                    background:
                      "radial-gradient(circle, oklch(0.18 0.04 240), oklch(0.10 0.025 240))",
                    boxShadow: timerState.running
                      ? "0 0 40px oklch(var(--cyan) / 0.5)"
                      : "0 0 20px oklch(var(--border))",
                    transition: "box-shadow 0.5s",
                  }}
                >
                  <div className="text-center">
                    <div className="font-display text-4xl font-bold text-gradient-cyan">
                      {timerState.done
                        ? "✓"
                        : formatTime(timerState.secondsLeft)}
                    </div>
                    {!timerState.done && (
                      <div
                        className="text-xs mt-1"
                        style={{ color: "oklch(var(--muted-foreground))" }}
                      >
                        remaining
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div
                  className="flex justify-between text-xs"
                  style={{ color: "oklch(var(--muted-foreground))" }}
                >
                  <span>Progress</span>
                  <span style={{ color: "oklch(var(--cyan))" }}>
                    {Math.round(
                      ((timerState.totalSeconds - timerState.secondsLeft) /
                        timerState.totalSeconds) *
                        100,
                    )}
                    %
                  </span>
                </div>
                <Progress
                  value={
                    ((timerState.totalSeconds - timerState.secondsLeft) /
                      timerState.totalSeconds) *
                    100
                  }
                  className="h-2"
                  data-ocid="meditations.loading_state"
                />
              </div>

              <div className="glass-card p-4 text-center">
                <div
                  className="text-3xl mb-2"
                  style={{
                    animation: timerState.running
                      ? "glow-pulse 4s ease-in-out infinite"
                      : "none",
                  }}
                >
                  🪼
                </div>
                <p
                  className="text-sm"
                  style={{ color: "oklch(var(--muted-foreground))" }}
                >
                  {timerState.done
                    ? "Beautiful session. You've earned 50 XP! 🎉"
                    : timerState.running
                      ? "Breathe in... hold... breathe out. Follow Aura's rhythm."
                      : "Press play to begin your journey."}
                </p>
              </div>

              <div className="flex gap-3">
                {!timerState.done && (
                  <button
                    type="button"
                    className="btn-gradient text-white font-semibold flex-1 py-3 rounded-xl flex items-center justify-center gap-2"
                    onClick={toggleTimer}
                    data-ocid="meditations.primary_button"
                  >
                    <Play className="w-4 h-4" />
                    {timerState.running ? "Pause" : "Play"}
                  </button>
                )}
                <button
                  type="button"
                  className="btn-cyan font-semibold flex-1 py-3 rounded-xl flex items-center justify-center gap-2"
                  onClick={closeTimer}
                  data-ocid="meditations.close_button"
                >
                  <X className="w-4 h-4" />
                  {timerState.done ? "Done" : "End Session"}
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
