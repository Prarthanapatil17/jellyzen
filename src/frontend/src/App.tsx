import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Toaster } from "@/components/ui/sonner";
import { Menu, MessageCircle, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import JellyfishSVG from "./components/JellyfishSVG";
import Chat from "./pages/Chat";
import Collectibles from "./pages/Collectibles";
import Home from "./pages/Home";
import Journey from "./pages/Journey";
import Meditations from "./pages/Meditations";

type Page = "home" | "meditations" | "journey" | "collectibles" | "chat";

const NAV_ITEMS: { id: Page; label: string; emoji: string }[] = [
  { id: "meditations", label: "Meditations", emoji: "🌊" },
  { id: "journey", label: "Journey", emoji: "⚡" },
  { id: "collectibles", label: "Collectibles", emoji: "🐠" },
  { id: "chat", label: "Chat", emoji: "🪼" },
];

function renderPage(
  page: Page,
  navigate: (p: string) => void,
  openChat: () => void,
): React.ReactNode {
  switch (page) {
    case "home":
      return <Home onNavigate={navigate} onOpenChat={openChat} />;
    case "meditations":
      return <Meditations />;
    case "journey":
      return <Journey />;
    case "collectibles":
      return <Collectibles />;
    case "chat":
      return <Chat />;
  }
}

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);

  const navigate = (p: string) => {
    setPage(p as Page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: "oklch(var(--background))" }}
    >
      {/* ── Top Nav ── */}
      <header
        className="fixed top-0 inset-x-0 z-50"
        style={{
          background: "oklch(0.08 0.025 240 / 0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid oklch(var(--border) / 0.4)",
        }}
        data-ocid="nav.section"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            type="button"
            className="flex items-center gap-2.5 group"
            onClick={() => navigate("home")}
            data-ocid="nav.link"
          >
            <div className="w-8 h-8 animate-glow-pulse">
              <JellyfishSVG size={32} />
            </div>
            <span className="font-display font-bold text-xl text-gradient-cyan">
              JellyZen
            </span>
          </button>

          <nav
            className="hidden md:flex items-center gap-1"
            aria-label="Main navigation"
          >
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(item.id)}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
                style={{
                  background:
                    page === item.id
                      ? "oklch(var(--cyan) / 0.12)"
                      : "transparent",
                  color:
                    page === item.id
                      ? "oklch(var(--cyan))"
                      : "oklch(var(--muted-foreground))",
                  boxShadow:
                    page === item.id
                      ? "0 0 12px oklch(var(--cyan) / 0.2)"
                      : "none",
                }}
                data-ocid="nav.link"
              >
                <span className="mr-1.5">{item.emoji}</span>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="btn-gradient text-white text-sm font-semibold px-5 py-2 rounded-full hidden md:flex items-center gap-2"
              onClick={() => navigate("meditations")}
              data-ocid="nav.primary_button"
            >
              Start Session
            </button>
            <button
              type="button"
              className="md:hidden glass-card p-2 rounded-xl"
              onClick={() => setMobileMenuOpen((v) => !v)}
              data-ocid="nav.toggle"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X
                  className="w-5 h-5"
                  style={{ color: "oklch(var(--cyan))" }}
                />
              ) : (
                <Menu
                  className="w-5 h-5"
                  style={{ color: "oklch(var(--cyan))" }}
                />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t overflow-hidden"
              style={{
                borderColor: "oklch(var(--border) / 0.4)",
                background: "oklch(0.08 0.025 240 / 0.97)",
              }}
            >
              <div className="px-6 py-4 space-y-1">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigate(item.id)}
                    className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all"
                    style={{
                      background:
                        page === item.id
                          ? "oklch(var(--cyan) / 0.12)"
                          : "transparent",
                      color:
                        page === item.id
                          ? "oklch(var(--cyan))"
                          : "oklch(var(--muted-foreground))",
                    }}
                    data-ocid="nav.link"
                  >
                    <span className="mr-2">{item.emoji}</span>
                    {item.label}
                  </button>
                ))}
                <button
                  type="button"
                  className="btn-gradient text-white text-sm font-semibold w-full py-3 rounded-xl mt-2"
                  onClick={() => navigate("meditations")}
                  data-ocid="nav.primary_button"
                >
                  Start Session
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence mode="wait">
        <motion.main
          key={page}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {renderPage(page, navigate, () => setChatModalOpen(true))}
        </motion.main>
      </AnimatePresence>

      {page !== "chat" && (
        <motion.button
          type="button"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center btn-gradient shadow-lg"
          style={{ boxShadow: "0 0 30px oklch(var(--purple) / 0.5)" }}
          onClick={() => setChatModalOpen(true)}
          data-ocid="chat.open_modal_button"
          aria-label="Chat with Aura"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </motion.button>
      )}

      <Dialog open={chatModalOpen} onOpenChange={setChatModalOpen}>
        <DialogContent
          className="max-w-lg h-[80vh] flex flex-col p-0 overflow-hidden border-0"
          style={{
            background: "oklch(0.10 0.025 238 / 0.97)",
            backdropFilter: "blur(20px)",
            borderColor: "oklch(var(--border))",
          }}
          data-ocid="chat.dialog"
        >
          <Chat />
        </DialogContent>
      </Dialog>

      <Toaster
        theme="dark"
        toastOptions={{
          style: {
            background: "oklch(0.20 0.035 230 / 0.95)",
            border: "1px solid oklch(var(--border))",
            color: "oklch(var(--foreground))",
          },
        }}
      />
    </div>
  );
}
