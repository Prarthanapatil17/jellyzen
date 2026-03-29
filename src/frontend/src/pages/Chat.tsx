import { Book, Send, Wind } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import JellyfishSVG from "../components/JellyfishSVG";
import { useApp } from "../contexts/AppContext";

interface Message {
  id: number;
  role: "aura" | "user";
  text: string;
  ts: Date;
  actions?: { label: string; page: string; icon: string }[];
}

const RESPONSES: {
  keywords: string[];
  text: string;
  actions?: { label: string; page: string; icon: string }[];
}[] = [
  {
    keywords: [
      "stress",
      "stressed",
      "overwhelm",
      "overwhelmed",
      "tense",
      "tension",
    ],
    text: "I feel that. The ocean has weathered every storm and yet remains. Let's breathe together first — 4 counts in, hold 4, out for 6. The Ocean Waves session can also help dissolve that tension layer by layer. 🌊",
    actions: [
      { label: "Ocean Waves Meditation", page: "meditations", icon: "🌊" },
      { label: "Release Thoughts", page: "release", icon: "🪼" },
    ],
  },
  {
    keywords: [
      "anxi",
      "anxious",
      "panic",
      "worry",
      "worried",
      "fear",
      "scared",
    ],
    text: "Anxiety is like turbulent surface waves — but beneath the ocean is always still. That stillness is inside you too. The 4-7-8 breathing technique can help ground you right now. ✨",
    actions: [
      { label: "Breathing Exercise", page: "meditations", icon: "💨" },
      { label: "Thought Shredder", page: "release", icon: "🪼" },
    ],
  },
  {
    keywords: [
      "sleep",
      "tired",
      "exhausted",
      "insomnia",
      "rest",
      "can't sleep",
    ],
    text: "The midnight tide carries away all weariness. 'Midnight Tide Sleep' with gentle rain sounds will guide your body into deep rest. Let the ocean hold you tonight. 🌙",
    actions: [
      { label: "Sleep Meditation", page: "meditations", icon: "🌙" },
      { label: "Write in Journal", page: "journal", icon: "📔" },
    ],
  },
  {
    keywords: [
      "sad",
      "depress",
      "lonely",
      "alone",
      "empty",
      "hopeless",
      "unhappy",
    ],
    text: "Even the ocean weeps — that's what the rain is. Your feelings are valid and they're allowed to be here. Writing in your journal can help give them shape, and I'm always here to listen. 💙",
    actions: [
      { label: "Write in Journal", page: "journal", icon: "📔" },
      { label: "Whale Song Meditation", page: "meditations", icon: "🐋" },
    ],
  },
  {
    keywords: ["angry", "anger", "frustrat", "mad", "rage", "furious"],
    text: "Let that fire find water. The Thought Shredder is perfect for releasing intense feelings — write it all out and watch it dissolve. Nothing stored, just released. 🔥",
    actions: [
      { label: "Release Thoughts", page: "release", icon: "🪼" },
      { label: "Forest Meditation", page: "meditations", icon: "🌿" },
    ],
  },
  {
    keywords: ["focus", "concentrate", "distract", "scattered", "attention"],
    text: "Like the deep current that flows unseen beneath the surface, true focus is always there. The 'Current Focus Flow' session with forest sounds will sharpen your mind. 🌿",
    actions: [{ label: "Focus Meditation", page: "meditations", icon: "🌿" }],
  },
  {
    keywords: [
      "happy",
      "good",
      "great",
      "wonderful",
      "joyful",
      "amazing",
      "grateful",
    ],
    text: "Your joy is bioluminescent — it lights up the deep! 🌟 That beautiful energy is worth capturing. Write it in your journal so you can return to this feeling on darker days.",
    actions: [{ label: "Write in Journal", page: "journal", icon: "📔" }],
  },
  {
    keywords: ["breath", "breathe", "breathing", "inhale", "exhale"],
    text: "Beautiful. Breathe in for 4 counts as the tide comes in — hold for 7 at the crest — exhale for 8 as it recedes. This 4-7-8 pattern activates your body's natural calm response. 🌊",
    actions: [{ label: "Guided Breathing", page: "meditations", icon: "💨" }],
  },
  {
    keywords: ["journal", "write", "diary", "reflect"],
    text: "The journal is your private ocean of thoughts. No one else can see what you write there. It's a powerful way to process emotions and track your growth over time. 📔",
    actions: [{ label: "Open Journal", page: "journal", icon: "📔" }],
  },
  {
    keywords: ["meditat", "session", "sound", "audio"],
    text: "We have 6 ocean-themed sessions waiting for you, each with its own ambient sound — ocean waves, rain, binaural beats, forest, whale song, and sacred fire. Which calls to you? 🌊",
    actions: [{ label: "Browse Sessions", page: "meditations", icon: "🌊" }],
  },
  {
    keywords: ["level", "xp", "progress", "journey", "achievement"],
    text: "Your ocean journey tracks everything — XP earned, levels reached, daily challenges, and unlockable achievements. Each action you take deepens your practice. ⚡",
    actions: [{ label: "View Journey", page: "journey", icon: "⚡" }],
  },
  {
    keywords: ["vent", "release", "shred", "bubble", "explode"],
    text: "The Thought Shredder is one of my favorite features. Type whatever's building up inside, hit Release, and watch the bubble pop. It's surprisingly satisfying and absolutely private. 🪼",
    actions: [{ label: "Thought Shredder", page: "release", icon: "🪼" }],
  },
  {
    keywords: ["help", "what can you", "what do you", "how does"],
    text: "I'm Aura, your bioluminescent ocean guide 🪼 I can suggest meditations for your mood, remind you to breathe, listen when you need to vent, and celebrate your growth. What do you need most right now?",
    actions: [
      { label: "Browse Meditations", page: "meditations", icon: "🌊" },
      { label: "My Journey", page: "journey", icon: "⚡" },
    ],
  },
];

const DEFAULT_RESPONSES = [
  "The deep ocean holds infinite wisdom. What question stirs within you today? 🪼",
  "Every wave that crashes on the shore returns to the sea. You are exactly where you need to be. 🌊",
  "I sense you are ready to dive deeper. Tell me what weighs on your heart. ✨",
  "The bioluminescent creatures of the deep create their own light — so do you. 💧",
  "Close your eyes. Imagine the vast, still ocean floor. That peace is always available to you. 🌟",
  "Breathe. You are safe in these waters. The ocean supports you completely. 🌊",
  "What would it feel like to let go of just one thing today? The ocean can hold it for you.",
];

function getResponse(message: string): {
  text: string;
  actions?: { label: string; page: string; icon: string }[];
} {
  const lower = message.toLowerCase();
  for (const r of RESPONSES) {
    if (r.keywords.some((k) => lower.includes(k)))
      return { text: r.text, actions: r.actions };
  }
  return {
    text: DEFAULT_RESPONSES[
      Math.floor(Math.random() * DEFAULT_RESPONSES.length)
    ],
  };
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    role: "aura",
    text: "Hello, I'm Aura 🪼 Welcome to the deep ocean of calm. I'm your bioluminescent guide through mindfulness, breath, and the wonder of the sea. How are you feeling today?",
    ts: new Date(),
    actions: [
      { label: "Browse Meditations", page: "meditations", icon: "🌊" },
      { label: "Release Thoughts", page: "release", icon: "🪼" },
      { label: "My Journey", page: "journey", icon: "⚡" },
    ],
  },
];

const QUICK_PROMPTS = [
  "I'm feeling stressed",
  "Help me focus",
  "I can't sleep",
  "I'm feeling sad",
  "I need to vent",
  "Guide me to breathe",
];

function loadHistory(): Message[] {
  try {
    const raw = sessionStorage.getItem("jellyzen_chat");
    if (!raw) return INITIAL_MESSAGES;
    const msgs = JSON.parse(raw) as Message[];
    return msgs.map((m) => ({ ...m, ts: new Date(m.ts) }));
  } catch {
    return INITIAL_MESSAGES;
  }
}

function saveHistory(msgs: Message[]): void {
  try {
    sessionStorage.setItem("jellyzen_chat", JSON.stringify(msgs.slice(-50)));
  } catch {
    /* noop */
  }
}

export default function Chat({
  onNavigate,
}: { onNavigate?: (p: string) => void }) {
  const { doAction } = useApp();
  const [messages, setMessages] = useState<Message[]>(loadHistory);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(100);
  const messageCount = messages.length;

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageCount, thinking]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text || thinking) return;
    setInput("");
    const userMsg: Message = {
      id: nextId.current++,
      role: "user",
      text,
      ts: new Date(),
    };
    const updated = [...messages, userMsg];
    setMessages(updated);
    saveHistory(updated);
    doAction("chat");
    setThinking(true);
    setTimeout(
      () => {
        const resp = getResponse(text);
        const auraMsg: Message = {
          id: nextId.current++,
          role: "aura",
          text: resp.text,
          ts: new Date(),
          actions: resp.actions,
        };
        const final = [...updated, auraMsg];
        setMessages(final);
        saveHistory(final);
        setThinking(false);
      },
      1200 + Math.random() * 800,
    );
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      className="min-h-screen ocean-bg pt-14 pb-0 flex flex-col"
      style={{ minHeight: "100vh" }}
      data-ocid="chat.panel"
    >
      <div
        className="max-w-3xl mx-auto w-full flex flex-col flex-1 px-4"
        style={{ minHeight: 0 }}
      >
        {/* Header */}
        <div className="py-4 flex items-center gap-4 shrink-0">
          <div className="animate-float animate-glow-pulse shrink-0">
            <JellyfishSVG size={48} />
          </div>
          <div>
            <h1
              className="font-display text-xl font-bold"
              style={{ color: "oklch(0.93 0.02 220)" }}
            >
              Chat with Aura
            </h1>
            <div className="flex items-center gap-2 text-xs">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: "oklch(0.75 0.12 215)",
                  boxShadow: "0 0 6px oklch(0.75 0.12 215)",
                }}
              />
              <span style={{ color: "oklch(0.75 0.12 215)" }}>
                Online · Ocean of Calm
              </span>
            </div>
          </div>
        </div>

        {/* Quick prompts */}
        <div className="flex gap-2 flex-wrap mb-3 shrink-0">
          {QUICK_PROMPTS.map((p) => (
            <button
              key={p}
              type="button"
              className="glass-card text-xs px-3 py-1.5 rounded-full hover:scale-105 transition-transform"
              style={{ color: "oklch(0.75 0.12 215)" }}
              onClick={() => {
                setInput(p);
                inputRef.current?.focus();
              }}
              data-ocid="chat.button"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div
          className="flex-1 space-y-4 overflow-y-auto pb-4 scrollbar-hide"
          style={{ minHeight: 0, maxHeight: "calc(100vh - 300px)" }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 animate-slide-up ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              data-ocid={`chat.item.${msg.id}`}
            >
              {msg.role === "aura" && (
                <div className="shrink-0 mt-1">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center animate-glow-pulse"
                    style={{
                      background: "oklch(0.50 0.16 280 / 0.3)",
                      border: "1px solid oklch(0.62 0.16 285 / 0.5)",
                    }}
                  >
                    <span className="text-sm">🪼</span>
                  </div>
                </div>
              )}
              <div className="max-w-[78%] space-y-2">
                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === "user" ? "rounded-tr-sm" : "rounded-tl-sm"}`}
                  style={{
                    background:
                      msg.role === "user"
                        ? "linear-gradient(135deg, oklch(0.50 0.16 280 / 0.7), oklch(0.45 0.14 260 / 0.5))"
                        : "oklch(0.18 0.035 235 / 0.8)",
                    backdropFilter: "blur(12px)",
                    border: `1px solid ${msg.role === "user" ? "oklch(0.50 0.16 280 / 0.4)" : "oklch(0.28 0.045 235 / 0.5)"}`,
                    color: "oklch(0.93 0.02 220)",
                  }}
                >
                  {msg.text}
                  <div
                    className="text-right mt-1"
                    style={{ fontSize: "10px", color: "oklch(0.55 0.04 225)" }}
                  >
                    {msg.ts.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                {/* Action buttons */}
                {msg.role === "aura" && msg.actions && onNavigate && (
                  <div className="flex flex-wrap gap-1.5">
                    {msg.actions.map((action) => (
                      <button
                        key={action.page + action.label}
                        type="button"
                        className="text-xs px-3 py-1.5 rounded-full font-medium transition-all hover:scale-105"
                        style={{
                          background: "oklch(0.75 0.12 215 / 0.12)",
                          border: "1px solid oklch(0.75 0.12 215 / 0.3)",
                          color: "oklch(0.82 0.12 210)",
                        }}
                        onClick={() => onNavigate(action.page)}
                        data-ocid="chat.button"
                      >
                        {action.icon} {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {thinking && (
            <div
              className="flex gap-3 animate-fade-in"
              data-ocid="chat.loading_state"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: "oklch(0.50 0.16 280 / 0.3)",
                  border: "1px solid oklch(0.62 0.16 285 / 0.5)",
                }}
              >
                <span className="text-sm">🪼</span>
              </div>
              <div
                className="px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2"
                style={{
                  background: "oklch(0.18 0.035 235 / 0.8)",
                  border: "1px solid oklch(0.28 0.045 235 / 0.5)",
                }}
              >
                <Loader2
                  className="w-4 h-4 animate-spin"
                  style={{ color: "oklch(0.75 0.12 215)" }}
                />
                <span
                  className="text-sm"
                  style={{ color: "oklch(0.65 0.04 225)" }}
                >
                  Aura is thinking...
                </span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div
          className="sticky bottom-0 py-3 shrink-0"
          style={{
            background:
              "linear-gradient(to top, oklch(0.07 0.025 245) 70%, transparent)",
          }}
        >
          {/* Nav shortcuts */}
          {onNavigate && (
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
                style={{
                  background: "oklch(0.16 0.03 235 / 0.7)",
                  border: "1px solid oklch(0.28 0.045 235 / 0.4)",
                  color: "oklch(0.65 0.04 225)",
                }}
                onClick={() => onNavigate("journal")}
                data-ocid="chat.button"
              >
                <Book className="w-3 h-3" /> Journal
              </button>
              <button
                type="button"
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
                style={{
                  background: "oklch(0.16 0.03 235 / 0.7)",
                  border: "1px solid oklch(0.28 0.045 235 / 0.4)",
                  color: "oklch(0.65 0.04 225)",
                }}
                onClick={() => onNavigate("release")}
                data-ocid="chat.button"
              >
                🪼 Release
              </button>
              <button
                type="button"
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
                style={{
                  background: "oklch(0.16 0.03 235 / 0.7)",
                  border: "1px solid oklch(0.28 0.045 235 / 0.4)",
                  color: "oklch(0.65 0.04 225)",
                }}
                onClick={() => onNavigate("meditations")}
                data-ocid="chat.button"
              >
                <Wind className="w-3 h-3" /> Meditate
              </button>
            </div>
          )}
          <div
            className="flex gap-2 glass-card p-2 pl-4"
            style={{ border: "1px solid oklch(0.75 0.12 215 / 0.2)" }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Talk to Aura..."
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
              style={{ color: "oklch(0.93 0.02 220)" }}
              data-ocid="chat.input"
            />
            <button
              type="button"
              className="btn-gradient text-white p-2 rounded-xl disabled:opacity-50"
              onClick={sendMessage}
              disabled={!input.trim() || thinking}
              data-ocid="chat.submit_button"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
