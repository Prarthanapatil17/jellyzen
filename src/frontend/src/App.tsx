import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Toaster } from "@/components/ui/sonner";
import {
  Book,
  Home as HomeIcon,
  Menu,
  Moon,
  Sparkles,
  Sun,
  Sunset,
  Wind,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import AnimatedBackground from "./components/AnimatedBackground";
import JellyfishSVG from "./components/JellyfishSVG";
import { AppProvider, useApp } from "./contexts/AppContext";
import Chat from "./pages/Chat";
import Home from "./pages/Home";
import Journal from "./pages/Journal";
import Journey from "./pages/Journey";
import Meditations from "./pages/Meditations";
import ThoughtShredder from "./pages/ThoughtShredder";

type Page = "home" | "meditations" | "journal" | "release" | "journey" | "chat";

const NAV_ITEMS: { id: Page; label: string; icon: React.ReactNode }[] = [
  { id: "meditations", label: "Meditate", icon: <Wind className="w-4 h-4" /> },
  { id: "journal", label: "Journal", icon: <Book className="w-4 h-4" /> },
  {
    id: "release",
    label: "Release",
    icon: <span className="text-base">🫧</span>,
  },
  { id: "journey", label: "Journey", icon: <Zap className="w-4 h-4" /> },
  { id: "chat", label: "Aura", icon: <span className="text-base">🪼</span> },
];

const TIME_ICONS = {
  day: <Sun className="w-4 h-4" />,
  sunset: <Sunset className="w-4 h-4" />,
  night: <Moon className="w-4 h-4" />,
};

const TIME_LABELS = { day: "Day", sunset: "Sunset", night: "Night" };

function AppInner() {
  const { timeMode, cycleTimeMode, xp, levelName, navigate, currentPage } =
    useApp();
  const page = currentPage as Page;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);

  const handleNavigate = (p: string) => {
    navigate(p);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPage = () => {
    switch (page) {
      case "home":
        return (
          <Home
            onNavigate={handleNavigate}
            onOpenChat={() => setChatModalOpen(true)}
          />
        );
      case "meditations":
        return <Meditations />;
      case "journal":
        return <Journal />;
      case "release":
        return <ThoughtShredder />;
      case "journey":
        return <Journey onNavigate={handleNavigate} />;
      case "chat":
        return <Chat onNavigate={handleNavigate} />;
      default:
        return (
          <Home
            onNavigate={handleNavigate}
            onOpenChat={() => setChatModalOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground timeMode={timeMode} />

      {/* ── Top Nav ── */}
      <header
        className="fixed top-0 inset-x-0 z-50"
        style={{
          background: "oklch(0.06 0.025 245 / 0.88)",
          backdropFilter: "blur(24px)",
          borderBottom: "1px solid oklch(0.35 0.05 230 / 0.4)",
        }}
        data-ocid="nav.section"
      >
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          {/* Logo */}
          <button
            type="button"
            className="flex items-center gap-2 shrink-0 group"
            onClick={() => handleNavigate("home")}
            data-ocid="nav.link"
          >
            <div className="w-7 h-7 animate-glow-pulse">
              <JellyfishSVG size={28} />
            </div>
            <span className="font-display font-bold text-lg text-gradient-cyan hidden sm:block">
              JellyZen
            </span>
          </button>

          {/* Desktop nav */}
          <nav
            className="hidden md:flex items-center gap-0.5"
            aria-label="Main navigation"
          >
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigate(item.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  background:
                    page === item.id
                      ? "oklch(0.75 0.15 215 / 0.15)"
                      : "transparent",
                  color:
                    page === item.id
                      ? "oklch(0.82 0.12 210)"
                      : "oklch(0.70 0.04 225)",
                  boxShadow:
                    page === item.id
                      ? "0 0 12px oklch(0.82 0.12 210 / 0.2)"
                      : "none",
                }}
                data-ocid="nav.link"
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* XP badge */}
            <div
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                background: "oklch(0.75 0.15 215 / 0.12)",
                border: "1px solid oklch(0.75 0.12 215 / 0.3)",
                color: "oklch(0.82 0.12 210)",
              }}
            >
              <Sparkles className="w-3 h-3" />
              <span>{xp} XP</span>
              <span style={{ color: "oklch(0.65 0.05 225)" }}>·</span>
              <span style={{ color: "oklch(0.75 0.06 220)" }}>{levelName}</span>
            </div>

            {/* Time mode toggle */}
            <button
              type="button"
              onClick={cycleTimeMode}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: "oklch(0.20 0.04 235 / 0.7)",
                border: "1px solid oklch(0.35 0.05 230 / 0.5)",
                color: "oklch(0.75 0.10 215)",
              }}
              title={`Switch to ${timeMode === "day" ? "Sunset" : timeMode === "sunset" ? "Night" : "Day"} mode`}
              data-ocid="nav.toggle"
            >
              {TIME_ICONS[timeMode]}
              <span className="hidden lg:inline">{TIME_LABELS[timeMode]}</span>
            </button>

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden p-2 rounded-lg"
              style={{ background: "oklch(0.18 0.035 235 / 0.7)" }}
              onClick={() => setMobileMenuOpen((v) => !v)}
              data-ocid="nav.toggle"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X
                  className="w-4 h-4"
                  style={{ color: "oklch(0.82 0.12 210)" }}
                />
              ) : (
                <Menu
                  className="w-4 h-4"
                  style={{ color: "oklch(0.82 0.12 210)" }}
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
              className="md:hidden overflow-hidden"
              style={{
                borderTop: "1px solid oklch(0.32 0.05 230 / 0.4)",
                background: "oklch(0.07 0.025 245 / 0.97)",
              }}
            >
              <div className="px-4 py-3 grid grid-cols-2 gap-1">
                <button
                  type="button"
                  onClick={() => handleNavigate("home")}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium"
                  style={{
                    background:
                      page === "home"
                        ? "oklch(0.75 0.15 215 / 0.15)"
                        : "transparent",
                    color:
                      page === "home"
                        ? "oklch(0.82 0.12 210)"
                        : "oklch(0.70 0.04 225)",
                  }}
                  data-ocid="nav.link"
                >
                  <HomeIcon className="w-4 h-4" /> Home
                </button>
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavigate(item.id)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium"
                    style={{
                      background:
                        page === item.id
                          ? "oklch(0.75 0.15 215 / 0.15)"
                          : "transparent",
                      color:
                        page === item.id
                          ? "oklch(0.82 0.12 210)"
                          : "oklch(0.70 0.04 225)",
                    }}
                    data-ocid="nav.link"
                  >
                    {item.icon} {item.label}
                  </button>
                ))}
              </div>
              <div
                className="px-4 py-2 flex items-center gap-2 text-xs"
                style={{
                  color: "oklch(0.65 0.05 225)",
                  borderTop: "1px solid oklch(0.25 0.04 230 / 0.4)",
                }}
              >
                <Sparkles
                  className="w-3 h-3"
                  style={{ color: "oklch(0.82 0.12 210)" }}
                />
                <span style={{ color: "oklch(0.82 0.12 210)" }}>{xp} XP</span>
                <span>·</span>
                <span>{levelName}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence mode="wait">
        <motion.main
          key={page}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          {renderPage()}
        </motion.main>
      </AnimatePresence>

      {/* Floating jellyfish companion */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="fixed bottom-24 left-5 z-40 pointer-events-none"
      >
        <div className="animate-float animate-glow-pulse w-8 h-8 opacity-60">
          <JellyfishSVG size={32} />
        </div>
      </motion.div>

      {/* Floating Chat button */}
      {page !== "chat" && (
        <motion.button
          type="button"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed bottom-6 right-6 z-50 w-13 h-13 rounded-full flex items-center justify-center shadow-lg"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.52 0.18 280), oklch(0.55 0.16 260))",
            boxShadow: "0 0 30px oklch(0.52 0.18 280 / 0.5)",
            width: "52px",
            height: "52px",
          }}
          onClick={() => setChatModalOpen(true)}
          data-ocid="chat.open_modal_button"
          aria-label="Chat with Aura"
        >
          <span className="text-2xl">🪼</span>
        </motion.button>
      )}

      <Dialog open={chatModalOpen} onOpenChange={setChatModalOpen}>
        <DialogContent
          className="max-w-lg h-[82vh] flex flex-col p-0 overflow-hidden border-0"
          style={{
            background: "oklch(0.08 0.025 245 / 0.97)",
            backdropFilter: "blur(24px)",
            border: "1px solid oklch(0.32 0.05 230 / 0.5)",
          }}
          data-ocid="chat.dialog"
        >
          <Chat
            onNavigate={(p) => {
              setChatModalOpen(false);
              handleNavigate(p);
            }}
          />
        </DialogContent>
      </Dialog>

      <Toaster
        theme="dark"
        toastOptions={{
          style: {
            background: "oklch(0.18 0.035 230 / 0.97)",
            border: "1px solid oklch(0.32 0.05 230 / 0.5)",
            color: "oklch(0.95 0.02 225)",
          },
        }}
      />
    </div>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const navigate = (p: string) => setCurrentPage(p);

  return (
    <AppProvider navigate={navigate} currentPage={currentPage}>
      <AppInner />
    </AppProvider>
  );
}
