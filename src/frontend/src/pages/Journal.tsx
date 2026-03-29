import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Book, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApp } from "../contexts/AppContext";

interface JournalEntry {
  id: string;
  title: string;
  body: string;
  date: string;
  mood: string;
}

const MOODS = [
  { emoji: "💙", label: "Calm" },
  { emoji: "🟢", label: "Good" },
  { emoji: "🟡", label: "Okay" },
  { emoji: "🟠", label: "Anxious" },
  { emoji: "🔴", label: "Low" },
];

const PROMPTS = [
  "What moment brought you peace today?",
  "What are you grateful for right now?",
  "What is weighing on your heart?",
  "Describe how the ocean makes you feel.",
  "What do you need to let go of today?",
  "What small act of kindness did you witness?",
];

function getEntries(): JournalEntry[] {
  try {
    return JSON.parse(
      localStorage.getItem("jellyzen_journal") ?? "[]",
    ) as JournalEntry[];
  } catch {
    return [];
  }
}

function saveEntries(entries: JournalEntry[]): void {
  localStorage.setItem("jellyzen_journal", JSON.stringify(entries));
}

const INITIAL_ENTRIES: JournalEntry[] = [
  {
    id: "sample1",
    title: "Finding stillness in the storm",
    body: "Today was overwhelming, but I took 10 minutes to breathe with Aura. The ocean waves sound really helped me release the tension in my shoulders. I noticed how tightly I had been holding everything.",
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    mood: "💙",
  },
  {
    id: "sample2",
    title: "Gratitude after the rain",
    body: "It rained all morning and instead of feeling gloomy I sat with it. The sound felt cleansing. Wrote down three things I appreciate: my warm tea, a message from a friend, and the way light comes through clouds.",
    date: new Date(Date.now() - 86400000).toISOString(),
    mood: "🟢",
  },
];

export default function Journal() {
  const { doAction } = useApp();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [writing, setWriting] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [selectedMood, setSelectedMood] = useState("💙");
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [promptIdx] = useState(() =>
    Math.floor(Math.random() * PROMPTS.length),
  );

  useEffect(() => {
    const stored = getEntries();
    if (stored.length === 0) {
      setEntries(INITIAL_ENTRIES);
      saveEntries(INITIAL_ENTRIES);
    } else {
      setEntries(stored);
    }
  }, []);

  const saveEntry = () => {
    if (!body.trim()) {
      toast.error("Write something first!");
      return;
    }
    const entry: JournalEntry = {
      id: Date.now().toString(),
      title: title.trim() || "Untitled entry",
      body: body.trim(),
      date: new Date().toISOString(),
      mood: selectedMood,
    };
    const updated = [entry, ...entries];
    setEntries(updated);
    saveEntries(updated);
    doAction("journal");
    toast.success("📔 Entry saved! +30 XP", { duration: 3000 });
    setWriting(false);
    setTitle("");
    setBody("");
    setSelectedMood("💙");
  };

  const deleteEntry = (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    saveEntries(updated);
    if (selectedEntry?.id === id) setSelectedEntry(null);
    toast.success("Entry removed");
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("en-US", {
      weekday: "short",
      month: "long",
      day: "numeric",
    });
  };

  const preview = (text: string, max = 100) =>
    text.length > max ? `${text.slice(0, max)}...` : text;

  return (
    <div className="min-h-screen ocean-bg pt-20 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="pt-6 mb-8 flex items-start justify-between">
          <div className="animate-slide-up">
            <div className="flex items-center gap-3 mb-2">
              <Book
                className="w-6 h-6"
                style={{ color: "oklch(0.75 0.12 215)" }}
              />
              <h1 className="font-display text-4xl font-bold text-gradient-cyan">
                My Journal
              </h1>
            </div>
            <p style={{ color: "oklch(0.65 0.04 225)" }}>
              Your private ocean of thoughts. +30 XP per entry.
            </p>
          </div>
          <button
            type="button"
            className="btn-gradient text-white font-semibold px-5 py-2.5 rounded-full flex items-center gap-2 mt-6"
            onClick={() => setWriting(true)}
            data-ocid="journal.open_modal_button"
          >
            <Plus className="w-4 h-4" /> New Entry
          </button>
        </div>

        {/* Writing area */}
        {writing && (
          <div
            className="glass-card p-6 mb-6 animate-slide-up"
            style={{ border: "1px solid oklch(0.75 0.12 215 / 0.3)" }}
            data-ocid="journal.panel"
          >
            <div className="flex items-center justify-between mb-4">
              <h2
                className="font-display text-xl font-semibold"
                style={{ color: "oklch(0.82 0.12 210)" }}
              >
                New Entry
              </h2>
              <button
                type="button"
                onClick={() => setWriting(false)}
                style={{ color: "oklch(0.60 0.04 225)" }}
                data-ocid="journal.close_button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mood picker */}
            <div className="mb-4">
              <p
                className="text-xs font-medium mb-2"
                style={{ color: "oklch(0.65 0.04 225)" }}
              >
                How are you feeling?
              </p>
              <div className="flex gap-2">
                {MOODS.map((m) => (
                  <button
                    key={m.emoji}
                    type="button"
                    className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-xs transition-all"
                    style={{
                      background:
                        selectedMood === m.emoji
                          ? "oklch(0.75 0.12 215 / 0.2)"
                          : "oklch(0.20 0.04 235 / 0.5)",
                      border: `1px solid ${selectedMood === m.emoji ? "oklch(0.75 0.12 215 / 0.5)" : "oklch(0.28 0.045 235 / 0.4)"}`,
                      color:
                        selectedMood === m.emoji
                          ? "oklch(0.82 0.12 210)"
                          : "oklch(0.65 0.04 225)",
                    }}
                    onClick={() => setSelectedMood(m.emoji)}
                    data-ocid="journal.toggle"
                  >
                    <span className="text-xl">{m.emoji}</span>
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Entry title (optional)"
              className="w-full bg-transparent outline-none font-display text-xl font-semibold mb-3 pb-2"
              style={{
                color: "oklch(0.93 0.02 220)",
                borderBottom: "1px solid oklch(0.28 0.045 235 / 0.5)",
              }}
              data-ocid="journal.input"
            />

            <p
              className="text-xs mb-2 italic"
              style={{ color: "oklch(0.55 0.04 225)" }}
            >
              Prompt: {PROMPTS[promptIdx]}
            </p>

            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Start writing... your thoughts are safe here."
              className="min-h-[160px] bg-transparent border-0 resize-none text-sm focus-visible:ring-0 p-0"
              style={{ color: "oklch(0.85 0.02 220)" }}
              data-ocid="journal.textarea"
            />

            <div
              className="flex justify-between items-center mt-4 pt-3"
              style={{ borderTop: "1px solid oklch(0.28 0.045 235 / 0.4)" }}
            >
              <span
                className="text-xs"
                style={{ color: "oklch(0.55 0.04 225)" }}
              >
                {body.length} characters
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="btn-cyan px-4 py-2 rounded-lg text-sm font-medium"
                  onClick={() => setWriting(false)}
                  data-ocid="journal.cancel_button"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-gradient text-white px-5 py-2 rounded-lg text-sm font-semibold"
                  onClick={saveEntry}
                  data-ocid="journal.save_button"
                >
                  Save Entry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Entry viewer */}
        {selectedEntry && (
          <div
            className="glass-card p-6 mb-6 animate-slide-up"
            style={{ border: "1px solid oklch(0.62 0.16 285 / 0.3)" }}
            data-ocid="journal.panel"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-2xl mb-1">{selectedEntry.mood}</div>
                <h2
                  className="font-display text-xl font-bold"
                  style={{ color: "oklch(0.93 0.02 220)" }}
                >
                  {selectedEntry.title}
                </h2>
                <p
                  className="text-xs mt-1"
                  style={{ color: "oklch(0.55 0.04 225)" }}
                >
                  {formatDate(selectedEntry.date)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEntry(null)}
                style={{ color: "oklch(0.60 0.04 225)" }}
                data-ocid="journal.close_button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p
              className="text-sm leading-relaxed whitespace-pre-wrap"
              style={{ color: "oklch(0.80 0.02 220)" }}
            >
              {selectedEntry.body}
            </p>
          </div>
        )}

        {/* Entry list */}
        <div className="space-y-3" data-ocid="journal.list">
          {entries.length === 0 ? (
            <div
              className="glass-card p-10 text-center"
              data-ocid="journal.empty_state"
            >
              <Book
                className="w-12 h-12 mx-auto mb-4 opacity-30"
                style={{ color: "oklch(0.75 0.12 215)" }}
              />
              <p
                className="font-display text-lg"
                style={{ color: "oklch(0.65 0.04 225)" }}
              >
                Your journal awaits your first thought
              </p>
              <button
                type="button"
                className="btn-gradient text-white px-6 py-2.5 rounded-full mt-4 text-sm font-semibold"
                onClick={() => setWriting(true)}
                data-ocid="journal.primary_button"
              >
                Write First Entry
              </button>
            </div>
          ) : (
            entries.map((entry, i) => (
              <button
                key={entry.id}
                type="button"
                className="w-full text-left glass-card p-4 flex items-start gap-4 group hover:scale-[1.01] transition-all"
                onClick={() => setSelectedEntry(entry)}
                data-ocid={`journal.item.${i + 1}`}
              >
                <div className="text-2xl shrink-0">{entry.mood}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      className="font-semibold truncate"
                      style={{ color: "oklch(0.90 0.02 220)" }}
                    >
                      {entry.title}
                    </h3>
                    <span
                      className="text-xs shrink-0"
                      style={{ color: "oklch(0.55 0.04 225)" }}
                    >
                      {formatDate(entry.date)}
                    </span>
                  </div>
                  <p
                    className="text-sm mt-1"
                    style={{ color: "oklch(0.65 0.04 225)" }}
                  >
                    {preview(entry.body)}
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      type="button"
                      className="shrink-0 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: "oklch(0.577 0.245 27)" }}
                      onClick={(e) => e.stopPropagation()}
                      data-ocid={`journal.delete_button.${i + 1}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent
                    style={{
                      background: "oklch(0.12 0.03 240)",
                      border: "1px solid oklch(0.28 0.045 235 / 0.5)",
                    }}
                  >
                    <AlertDialogHeader>
                      <AlertDialogTitle
                        style={{ color: "oklch(0.93 0.02 220)" }}
                      >
                        Delete this entry?
                      </AlertDialogTitle>
                      <AlertDialogDescription
                        style={{ color: "oklch(0.65 0.04 225)" }}
                      >
                        This cannot be undone. Your words will be released to
                        the ocean.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel data-ocid="journal.cancel_button">
                        Keep it
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteEntry(entry.id)}
                        data-ocid="journal.confirm_button"
                        style={{ background: "oklch(0.55 0.22 27)" }}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </button>
            ))
          )}
        </div>

        <footer
          className="text-center py-10"
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
    </div>
  );
}
