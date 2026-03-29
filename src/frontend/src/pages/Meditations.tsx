import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import {
  CheckCircle,
  Clock,
  Pause,
  Play,
  Volume2,
  VolumeX,
  Waves,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import JellyfishSVG from "../components/JellyfishSVG";
import { useApp } from "../contexts/AppContext";
import {
  type SoundNode,
  createBinaural,
  createFireCrackle,
  createForest,
  createOceanWaves,
  createRain,
  createWhaleSong,
  playCompletionSound,
} from "../utils/audioEngine";

const SESSIONS = [
  {
    id: 1,
    title: "Deep Ocean Breath",
    duration: 10,
    category: "Breathwork",
    difficulty: "Beginner",
    soundType: "oceanWaves" as const,
    soundLabel: "Ocean Waves",
    description:
      "Ride the ebb and flow of each breath like the gentle tide washing over warm sand.",
    emoji: "🌊",
    gradient: { from: "#061525", via: "#0e3058" },
    accent: "oklch(0.75 0.12 215)",
  },
  {
    id: 2,
    title: "Coral Reef Visualization",
    duration: 18,
    category: "Visualization",
    difficulty: "Intermediate",
    soundType: "binaural" as const,
    soundLabel: "Binaural Deep Hum",
    description:
      "Journey through vibrant coral ecosystems. Let color and light fill your inner world.",
    emoji: "🦒",
    gradient: { from: "#150830", via: "#2e1460" },
    accent: "oklch(0.62 0.16 285)",
  },
  {
    id: 3,
    title: "Midnight Tide Sleep",
    duration: 25,
    category: "Sleep",
    difficulty: "Beginner",
    soundType: "rain" as const,
    soundLabel: "Gentle Rain",
    description:
      "Let the rhythm of the midnight rain carry you into deep, restorative sleep.",
    emoji: "🌙",
    gradient: { from: "#060c1a", via: "#0c2035" },
    accent: "oklch(0.68 0.10 220)",
  },
  {
    id: 4,
    title: "Current Focus Flow",
    duration: 15,
    category: "Focus",
    difficulty: "Intermediate",
    soundType: "forest" as const,
    soundLabel: "Forest Ambience",
    description:
      "Like water finding its path, your mind flows effortlessly toward clarity.",
    emoji: "🌿",
    gradient: { from: "#081018", via: "#142a18" },
    accent: "oklch(0.60 0.14 145)",
  },
  {
    id: 5,
    title: "Bioluminescent Dream",
    duration: 20,
    category: "Visualization",
    difficulty: "Advanced",
    soundType: "fireCrackle" as const,
    soundLabel: "Sacred Fire",
    description:
      "Discover your inner light in the darkest ocean depths. A journey into self-luminous awareness.",
    emoji: "✨",
    gradient: { from: "#0a0618", via: "#1e0a55" },
    accent: "oklch(0.68 0.18 325)",
  },
  {
    id: 6,
    title: "Whale Song Breathing",
    duration: 12,
    category: "Breathwork",
    difficulty: "Beginner",
    soundType: "whaleSong" as const,
    soundLabel: "Whale Song",
    description:
      "Breathe in harmony with the ancient songs of ocean giants. Let resonance fill you with peace.",
    emoji: "🐋",
    gradient: { from: "#060f1a", via: "#0c2540" },
    accent: "oklch(0.72 0.12 195)",
  },
];

type SoundType =
  | "oceanWaves"
  | "binaural"
  | "rain"
  | "forest"
  | "whaleSong"
  | "fireCrackle";

const SOUND_CREATORS: Record<SoundType, (ctx: AudioContext) => SoundNode> = {
  oceanWaves: createOceanWaves,
  binaural: createBinaural,
  rain: createRain,
  forest: createForest,
  whaleSong: createWhaleSong,
  fireCrackle: createFireCrackle,
};

const BREATH_PHASES = [
  { label: "Breathe In", count: 4, color: "oklch(0.75 0.12 215)", scale: 1.35 },
  { label: "Hold", count: 7, color: "oklch(0.62 0.16 285)", scale: 1.35 },
  {
    label: "Breathe Out",
    count: 8,
    color: "oklch(0.68 0.18 325)",
    scale: 0.75,
  },
];

const BREATH_TOTAL = BREATH_PHASES.reduce((a, p) => a + p.count, 0); // 19s

function BreathingGuide({ running }: { running: boolean }) {
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(
        () => setElapsed((e) => (e + 1) % BREATH_TOTAL),
        1000,
      );
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [running]);

  let phaseIndex = 0;
  let remaining = elapsed;
  for (let i = 0; i < BREATH_PHASES.length; i++) {
    if (remaining < BREATH_PHASES[i].count) {
      phaseIndex = i;
      break;
    }
    remaining -= BREATH_PHASES[i].count;
  }
  const phase = BREATH_PHASES[phaseIndex];
  const countInPhase = remaining + 1;

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="relative flex items-center justify-center rounded-full"
        style={{
          width: "140px",
          height: "140px",
          background: `radial-gradient(circle, ${phase.color}22, ${phase.color}08)`,
          boxShadow: `0 0 40px ${phase.color}40, 0 0 80px ${phase.color}15`,
          transform: `scale(${running ? phase.scale : 1})`,
          transition: `transform ${phase.label === "Breathe In" ? phase.count : phase.label === "Breathe Out" ? phase.count : 0.3}s ease-in-out, box-shadow 0.5s ease`,
          border: `2px solid ${phase.color}50`,
        }}
      >
        <JellyfishSVG size={55} />
      </div>
      <div className="text-center">
        <div
          className="font-display text-xl font-bold"
          style={{ color: phase.color }}
        >
          {running ? phase.label : "Press Play"}
        </div>
        {running && (
          <div
            className="text-sm mt-1"
            style={{ color: "oklch(0.65 0.05 225)" }}
          >
            {countInPhase} / {phase.count}s
          </div>
        )}
      </div>
    </div>
  );
}

const CONFETTI_PIECES = Array.from({ length: 12 }, (_, i) => ({
  id: `cp-${i}`,
  left: `${(i / 12) * 100}%`,
  color: [
    "oklch(0.75 0.12 215)",
    "oklch(0.62 0.16 285)",
    "oklch(0.68 0.18 325)",
  ][i % 3],
  dur: 0.8 + i * 0.12,
  delay: i * 0.06,
}));

interface SessionState {
  session: (typeof SESSIONS)[0];
  secondsLeft: number;
  totalSeconds: number;
  running: boolean;
  done: boolean;
}

export default function Meditations() {
  const { doAction } = useApp();

  const [sessionState, setSessionState] = useState<SessionState | null>(null);
  const [completedIds, setCompletedIds] = useState<number[]>([]);
  const [volume, setVolume] = useState(70);
  const [muted, setMuted] = useState(false);
  const [confetti, setConfetti] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const soundRef = useRef<SoundNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const stopSound = useCallback(() => {
    soundRef.current?.stop();
    soundRef.current = null;
  }, []);

  const startSound = useCallback(
    (soundType: SoundType) => {
      stopSound();
      if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
        audioCtxRef.current = new AudioContext();
      }
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
      const node = SOUND_CREATORS[soundType](audioCtxRef.current);
      const vol = muted ? 0 : volume / 100;
      node.setVolume(vol);
      soundRef.current = node;
    },
    [stopSound, muted, volume],
  );

  const startSession = (session: (typeof SESSIONS)[0]) => {
    const totalSeconds = session.duration * 60;
    setSessionState({
      session,
      secondsLeft: totalSeconds,
      totalSeconds,
      running: false,
      done: false,
    });
    setConfetti(false);
  };

  const play = useCallback(() => {
    if (!sessionState || sessionState.done) return;
    startSound(sessionState.session.soundType);
    setSessionState((s) => (s ? { ...s, running: true } : s));
    intervalRef.current = setInterval(() => {
      setSessionState((prev) => {
        if (!prev) return prev;
        if (prev.secondsLeft <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          intervalRef.current = null;
          stopSound();
          // completion
          setCompletedIds((ids) => [...ids, prev.session.id]);
          doAction("meditation");
          if (audioCtxRef.current) playCompletionSound(audioCtxRef.current);
          toast.success(`✨ ${prev.session.title} complete! +50 XP`, {
            duration: 4000,
          });
          setConfetti(true);
          return { ...prev, secondsLeft: 0, running: false, done: true };
        }
        return { ...prev, secondsLeft: prev.secondsLeft - 1 };
      });
    }, 1000);
  }, [sessionState, startSound, stopSound, doAction]);

  const pause = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    soundRef.current?.stop();
    setSessionState((s) => (s ? { ...s, running: false } : s));
  }, []);

  const closeSession = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    stopSound();
    setSessionState(null);
    setConfetti(false);
  }, [stopSound]);

  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.setVolume(muted ? 0 : volume / 100);
    }
  }, [volume, muted]);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      stopSound();
    };
  }, [stopSound]);

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="min-h-screen ocean-bg pt-20 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 animate-slide-up pt-6">
          <div className="flex items-center gap-3 mb-3">
            <Waves
              className="w-6 h-6"
              style={{ color: "oklch(0.75 0.12 215)" }}
            />
            <h1 className="font-display text-4xl font-bold text-gradient-cyan">
              Guided Sessions
            </h1>
          </div>
          <p style={{ color: "oklch(0.65 0.04 225)" }}>
            Choose your depth. Each session plays real ambient sound.
          </p>
        </div>

        {/* Sessions grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          data-ocid="meditations.list"
        >
          {SESSIONS.map((session, i) => {
            const done = completedIds.includes(session.id);
            return (
              <div
                key={session.id}
                className="glass-card overflow-hidden group hover:scale-[1.02] transition-all relative cursor-pointer"
                style={{
                  background: `linear-gradient(150deg, ${session.gradient.from}, ${session.gradient.via})`,
                }}
                data-ocid={`meditations.item.${i + 1}`}
              >
                {done && (
                  <div className="absolute top-3 right-3">
                    <CheckCircle
                      className="w-5 h-5"
                      style={{ color: "oklch(0.75 0.12 215)" }}
                    />
                  </div>
                )}
                <div className="p-5">
                  <div className="text-4xl mb-3">{session.emoji}</div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{
                        background: `${session.accent}22`,
                        color: session.accent,
                      }}
                    >
                      {session.category}
                    </span>
                    <span
                      className="text-xs px-2.5 py-1 rounded-full"
                      style={{
                        background: "oklch(0.28 0.04 235 / 0.6)",
                        color: "oklch(0.65 0.04 225)",
                      }}
                    >
                      {session.difficulty}
                    </span>
                  </div>
                  <h3
                    className="font-display text-lg font-bold mb-1.5"
                    style={{ color: "oklch(0.93 0.02 220)" }}
                  >
                    {session.title}
                  </h3>
                  <p
                    className="text-sm mb-4 leading-relaxed"
                    style={{ color: "oklch(0.65 0.04 225)" }}
                  >
                    {session.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Clock
                        className="w-3.5 h-3.5"
                        style={{ color: "oklch(0.65 0.04 225)" }}
                      />
                      <span
                        className="text-xs"
                        style={{ color: "oklch(0.65 0.04 225)" }}
                      >
                        {session.duration} min
                      </span>
                      <span
                        className="text-xs ml-2"
                        style={{ color: `${session.accent}cc` }}
                      >
                        🎵 {session.soundLabel}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="btn-gradient text-white text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-1.5"
                      onClick={() => startSession(session)}
                      data-ocid={`meditations.item.${i + 1}`}
                    >
                      <Play className="w-3 h-3" />
                      {done ? "Again" : "Start"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Breathing mini-game section */}
        <div className="mt-12 glass-card p-8" data-ocid="meditations.panel">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">💨</span>
            <div>
              <h2 className="font-display text-2xl font-bold text-gradient-cyan">
                4-7-8 Breathing Exercise
              </h2>
              <p
                className="text-sm mt-0.5"
                style={{ color: "oklch(0.65 0.04 225)" }}
              >
                3 cycles earns +40 XP. Follow the jellyfish.
              </p>
            </div>
          </div>
          <BreathingExercise
            onComplete={() => {
              doAction("breathing");
              toast.success("Breathing complete! +40 XP 💨", {
                duration: 3000,
              });
            }}
          />
        </div>
      </div>

      {/* Session Modal */}
      <Dialog
        open={!!sessionState}
        onOpenChange={(open) => !open && closeSession()}
      >
        <DialogContent
          className="max-w-md border-0"
          style={{
            background: sessionState
              ? `linear-gradient(160deg, ${sessionState.session.gradient.from}, ${sessionState.session.gradient.via} 60%, oklch(0.10 0.03 240))`
              : "oklch(0.10 0.03 240)",
            backdropFilter: "blur(24px)",
            border: `1px solid ${sessionState?.session.accent ?? "oklch(0.28 0.045 235)"}40`,
          }}
          data-ocid="meditations.dialog"
        >
          {sessionState && (
            <>
              <DialogHeader>
                <DialogTitle
                  className="font-display text-2xl"
                  style={{ color: sessionState.session.accent }}
                >
                  {sessionState.session.emoji} {sessionState.session.title}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-5 py-2">
                {/* Breathing guide */}
                <BreathingGuide running={sessionState.running} />

                {/* Timer */}
                <div className="text-center">
                  <div
                    className="font-display text-5xl font-bold"
                    style={{ color: sessionState.session.accent }}
                  >
                    {sessionState.done
                      ? "✓"
                      : formatTime(sessionState.secondsLeft)}
                  </div>
                  {!sessionState.done && (
                    <div
                      className="text-xs mt-1"
                      style={{ color: "oklch(0.60 0.04 225)" }}
                    >
                      remaining
                    </div>
                  )}
                </div>

                {/* Progress */}
                <div className="space-y-1.5">
                  <div
                    className="flex justify-between text-xs"
                    style={{ color: "oklch(0.60 0.04 225)" }}
                  >
                    <span>Progress</span>
                    <span style={{ color: sessionState.session.accent }}>
                      {Math.round(
                        ((sessionState.totalSeconds -
                          sessionState.secondsLeft) /
                          sessionState.totalSeconds) *
                          100,
                      )}
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      ((sessionState.totalSeconds - sessionState.secondsLeft) /
                        sessionState.totalSeconds) *
                      100
                    }
                    className="h-1.5"
                    data-ocid="meditations.loading_state"
                  />
                </div>

                {/* Confetti */}
                {confetti && (
                  <div className="relative h-8 overflow-hidden">
                    {CONFETTI_PIECES.map((p) => (
                      <div
                        key={p.id}
                        className="absolute w-2 h-2 rounded-sm"
                        style={{
                          left: p.left,
                          top: 0,
                          background: p.color,
                          animation: `confetti-fall ${p.dur}s ease-in ${p.delay}s forwards`,
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Sound label */}
                {!sessionState.done && (
                  <div className="glass-card p-3 flex items-center justify-between">
                    <span
                      className="text-xs"
                      style={{ color: "oklch(0.65 0.04 225)" }}
                    >
                      🎵 {sessionState.session.soundLabel}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setMuted((m) => !m)}
                        className="p-1 rounded"
                        style={{ color: "oklch(0.65 0.05 225)" }}
                      >
                        {muted ? (
                          <VolumeX className="w-4 h-4" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </button>
                      <div className="w-20">
                        <Slider
                          value={[volume]}
                          onValueChange={([v]) => setVolume(v)}
                          min={0}
                          max={100}
                          step={5}
                          className="h-1"
                          data-ocid="meditations.input"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {sessionState.done && (
                  <div className="glass-card p-4 text-center">
                    <div className="text-3xl mb-2">✨</div>
                    <p
                      className="font-semibold"
                      style={{ color: sessionState.session.accent }}
                    >
                      Beautiful session!
                    </p>
                    <p
                      className="text-sm mt-1"
                      style={{ color: "oklch(0.65 0.04 225)" }}
                    >
                      +50 XP has been awarded. Keep going!
                    </p>
                  </div>
                )}

                {/* Controls */}
                <div className="flex gap-3">
                  {!sessionState.done && (
                    <button
                      type="button"
                      className="btn-gradient text-white font-semibold flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2"
                      onClick={sessionState.running ? pause : play}
                      data-ocid="meditations.primary_button"
                    >
                      {sessionState.running ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                      {sessionState.running ? "Pause" : "Play"}
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn-cyan font-semibold flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2"
                    onClick={closeSession}
                    data-ocid="meditations.close_button"
                  >
                    <X className="w-4 h-4" />
                    {sessionState.done ? "Done" : "End"}
                  </button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function BreathingExercise({ onComplete }: { onComplete: () => void }) {
  const [active, setActive] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [phase, setPhase] = useState(0); // 0=inhale,1=hold,2=exhale
  const [count, setCount] = useState(1);
  const [done, setDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countRef = useRef(1);
  const phaseRef = useRef(0);
  const cycleRef = useRef(0);

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const start = () => {
    setActive(true);
    setDone(false);
    setPhase(0);
    setCount(1);
    setCycle(0);
    countRef.current = 1;
    phaseRef.current = 0;
    cycleRef.current = 0;
    timerRef.current = setInterval(() => {
      countRef.current += 1;
      const maxCount = BREATH_PHASES[phaseRef.current].count;
      if (countRef.current > maxCount) {
        countRef.current = 1;
        phaseRef.current = (phaseRef.current + 1) % BREATH_PHASES.length;
        if (phaseRef.current === 0) {
          cycleRef.current += 1;
          if (cycleRef.current >= 3) {
            stopTimer();
            setActive(false);
            setDone(true);
            setCycle(3);
            setPhase(0);
            setCount(1);
            onComplete();
            return;
          }
        }
      }
      setCount(countRef.current);
      setPhase(phaseRef.current);
      setCycle(cycleRef.current);
    }, 1000);
  };

  const stop = () => {
    stopTimer();
    setActive(false);
    setPhase(0);
    setCount(1);
    setCycle(0);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: stopTimer is stable
  useEffect(() => () => stopTimer(), []);

  const currentPhase = BREATH_PHASES[phase];

  return (
    <div className="flex flex-col items-center gap-5">
      <div
        className="relative flex items-center justify-center rounded-full"
        style={{
          width: "160px",
          height: "160px",
          background: `radial-gradient(circle, ${currentPhase.color}20, ${currentPhase.color}05)`,
          boxShadow: active
            ? `0 0 50px ${currentPhase.color}50, 0 0 100px ${currentPhase.color}20`
            : "0 0 20px oklch(0.28 0.045 235 / 0.5)",
          transform: active ? `scale(${currentPhase.scale})` : "scale(1)",
          transition: `transform ${phase === 0 ? BREATH_PHASES[0].count : phase === 2 ? BREATH_PHASES[2].count : 0.5}s ease-in-out, box-shadow 0.5s ease`,
          border: `2px solid ${active ? `${currentPhase.color}50` : "oklch(0.28 0.045 235 / 0.5)"}`,
        }}
      >
        <JellyfishSVG size={65} />
      </div>

      {active && (
        <div className="text-center">
          <div
            className="font-display text-2xl font-bold"
            style={{ color: currentPhase.color }}
          >
            {currentPhase.label}
          </div>
          <div
            className="text-sm mt-1"
            style={{ color: "oklch(0.65 0.04 225)" }}
          >
            {count} / {currentPhase.count}s
          </div>
          <div className="flex gap-2 justify-center mt-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{
                  background:
                    i < cycle
                      ? "oklch(0.75 0.12 215)"
                      : i === cycle
                        ? "oklch(0.62 0.16 285)"
                        : "oklch(0.28 0.04 235)",
                }}
              />
            ))}
          </div>
          <div
            className="text-xs mt-1"
            style={{ color: "oklch(0.55 0.04 225)" }}
          >
            Cycle {cycle + 1} of 3
          </div>
        </div>
      )}

      {done && (
        <div className="text-center animate-fade-in">
          <div className="text-3xl mb-1">🌟</div>
          <div
            className="font-semibold"
            style={{ color: "oklch(0.75 0.12 215)" }}
          >
            3 cycles complete! +40 XP
          </div>
        </div>
      )}

      {!active && !done && (
        <p
          className="text-sm text-center"
          style={{ color: "oklch(0.65 0.04 225)" }}
        >
          Inhale 4s → Hold 7s → Exhale 8s · Repeat 3 times
        </p>
      )}

      <div className="flex gap-3">
        {!active ? (
          <button
            type="button"
            className="btn-gradient text-white font-semibold px-8 py-2.5 rounded-full flex items-center gap-2"
            onClick={start}
            data-ocid="meditations.primary_button"
          >
            <Play className="w-4 h-4" />
            {done ? "Again" : "Begin Breathing"}
          </button>
        ) : (
          <button
            type="button"
            className="btn-cyan font-semibold px-8 py-2.5 rounded-full flex items-center gap-2"
            onClick={stop}
            data-ocid="meditations.cancel_button"
          >
            <X className="w-4 h-4" /> Stop
          </button>
        )}
      </div>
    </div>
  );
}
