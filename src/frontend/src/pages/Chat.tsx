import { Loader2, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import JellyfishSVG from "../components/JellyfishSVG";

interface Message {
  id: number;
  role: "aura" | "user";
  text: string;
  ts: Date;
}

const AURA_RESPONSES: Record<string, string> = {
  stress:
    "The ocean has weathered every storm and yet remains. Let's breathe together — inhale for 4 counts, hold for 4, exhale for 6. Feel the tension dissolve like salt in seawater. 🌊",
  anxi: "Anxiety is like turbulent surface waves. But deep below, the ocean is always still. Shall we visit that stillness together with a visualization session? ✨",
  sleep:
    "The midnight tide carries away all weariness. I recommend the 'Midnight Tide Sleep' session — gentle whale songs will guide you to rest. 🐋",
  tired:
    "Even the ocean rests between tides. Your body is asking for renewal. The 'Deep Ocean Breath' session will restore your energy naturally. 💤",
  focus:
    "Like the deep current that flows unseen beneath the surface, true focus is always there. Try 'Current Focus Flow' — 15 minutes to sharpen your mind. 🎯",
  happy:
    "Your joy is bioluminescent — it lights up the deep! 🌟 What a beautiful energy to bring into your practice today. Would you like to amplify it?",
  sad: "Even the ocean weeps — that's what the rain is. Your feelings are valid, friend. Let them flow through you like water, and know that calmer tides await. 💙",
  help: "I'm here to guide your ocean meditation journey. 🪼 I can recommend sessions, share breathing techniques, or simply sit with you in the deep. What do you need?",
  breath:
    "Beautiful choice. Try this: breathe in for 4 counts as the tide comes in, hold for 2 at the crest, exhale for 6 as the tide recedes. Repeat 5 times. 🌊",
  meditat:
    "Wonderful. I have several journeys waiting for you — from gentle breathing in 'Deep Ocean Breath' to profound visions in 'Bioluminescent Dream'. What calls to you?",
  collect:
    "Sea creatures reveal themselves to those who are patient and consistent. Complete more sessions and maintain your streak to coax them from the deep! 🐠",
  level:
    "Each drop of effort raises the tide of your growth. You're doing beautifully. Keep your streak alive and the XP will flow like the current. ⚡",
};

const DEFAULT_RESPONSES = [
  "The deep ocean holds infinite wisdom. What question stirs within you today? 🪼",
  "Every wave that crashes on the shore returns to the sea. You are exactly where you need to be. 🌊",
  "I sense you are ready to dive deeper. Tell me what weighs on your heart. ✨",
  "The bioluminescent creatures of the deep create their own light — so do you. 💫",
  "Close your eyes. Imagine the vast, still ocean floor. That peace is always available to you. 🌟",
  "Breathe. You are safe in these waters. The ocean supports you completely. 🌊",
];

function getAuraResponse(message: string): string {
  const lower = message.toLowerCase();
  for (const [key, response] of Object.entries(AURA_RESPONSES)) {
    if (lower.includes(key)) return response;
  }
  return DEFAULT_RESPONSES[
    Math.floor(Math.random() * DEFAULT_RESPONSES.length)
  ];
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    role: "aura",
    text: "Hello, I'm Aura 🪼 Welcome to the deep ocean of calm. I'm your bioluminescent guide through mindfulness, meditation, and the wonder of the sea. What brings you here today?",
    ts: new Date(),
  },
];

const QUICK_PROMPTS = [
  "I'm feeling stressed",
  "Help me focus",
  "I can't sleep",
  "Breathe with me",
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(2);
  const messageCount = messages.length;

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on new message or thinking state
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
    setMessages((prev) => [...prev, userMsg]);
    setThinking(true);
    const delay = 1200 + Math.random() * 1000;
    setTimeout(() => {
      const response = getAuraResponse(text);
      setMessages((prev) => [
        ...prev,
        { id: nextId.current++, role: "aura", text: response, ts: new Date() },
      ]);
      setThinking(false);
    }, delay);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      className="min-h-screen ocean-bg pt-20 pb-0 flex flex-col"
      data-ocid="chat.panel"
    >
      <div className="max-w-3xl mx-auto w-full flex flex-col flex-1 px-4">
        <div className="py-6 flex items-center gap-4">
          <div className="animate-float animate-glow-pulse shrink-0">
            <JellyfishSVG size={52} />
          </div>
          <div>
            <h1
              className="font-display text-2xl font-bold"
              style={{ color: "oklch(var(--foreground))" }}
            >
              Chat with Aura
            </h1>
            <div className="flex items-center gap-2 text-sm">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  background: "oklch(var(--cyan))",
                  boxShadow: "0 0 6px oklch(var(--cyan))",
                }}
              />
              <span style={{ color: "oklch(var(--cyan))" }}>
                Online · Ocean of Calm
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap mb-4">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              className="glass-card text-xs px-3 py-1.5 rounded-full hover:scale-105 transition-transform"
              style={{ color: "oklch(var(--cyan))" }}
              onClick={() => {
                setInput(prompt);
                inputRef.current?.focus();
              }}
              data-ocid="chat.button"
            >
              {prompt}
            </button>
          ))}
        </div>

        <div
          className="flex-1 space-y-4 overflow-y-auto pb-4 scrollbar-hide"
          style={{ minHeight: 0, maxHeight: "calc(100vh - 280px)" }}
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
                    className="w-9 h-9 rounded-full flex items-center justify-center animate-glow-pulse"
                    style={{
                      background: "oklch(var(--accent) / 0.3)",
                      border: "1px solid oklch(var(--purple-light) / 0.5)",
                    }}
                  >
                    <span className="text-lg">🪼</span>
                  </div>
                </div>
              )}
              <div
                className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === "user" ? "rounded-tr-sm" : "rounded-tl-sm"}`}
                style={{
                  background:
                    msg.role === "user"
                      ? "linear-gradient(135deg, oklch(var(--purple) / 0.7), oklch(var(--cyan) / 0.4))"
                      : "oklch(var(--card) / 0.8)",
                  backdropFilter: "blur(12px)",
                  border: `1px solid ${msg.role === "user" ? "oklch(var(--purple) / 0.4)" : "oklch(var(--border) / 0.5)"}`,
                  color: "oklch(var(--foreground))",
                }}
              >
                {msg.text}
                <div
                  className="text-right mt-1"
                  style={{
                    fontSize: "10px",
                    color: "oklch(var(--muted-foreground))",
                  }}
                >
                  {msg.ts.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}

          {thinking && (
            <div
              className="flex gap-3 animate-fade-in"
              data-ocid="chat.loading_state"
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: "oklch(var(--accent) / 0.3)",
                  border: "1px solid oklch(var(--purple-light) / 0.5)",
                }}
              >
                <span className="text-lg">🪼</span>
              </div>
              <div
                className="px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2"
                style={{
                  background: "oklch(var(--card) / 0.8)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid oklch(var(--border) / 0.5)",
                }}
              >
                <Loader2
                  className="w-4 h-4 animate-spin"
                  style={{ color: "oklch(var(--cyan))" }}
                />
                <span
                  className="text-sm"
                  style={{ color: "oklch(var(--muted-foreground))" }}
                >
                  Aura is thinking...
                </span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div
          className="sticky bottom-0 py-4"
          style={{
            background:
              "linear-gradient(to top, oklch(var(--background)) 70%, transparent)",
          }}
        >
          <div
            className="flex gap-3 glass-card p-2 pl-4"
            style={{ border: "1px solid oklch(var(--cyan) / 0.25)" }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask Aura anything about your ocean journey..."
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
              style={{ color: "oklch(var(--foreground))" }}
              data-ocid="chat.input"
            />
            <button
              type="button"
              className="btn-gradient text-white p-2.5 rounded-xl disabled:opacity-50"
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
