"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  FileText,
  CheckSquare,
  MessageCircle,
  Github,
  ExternalLink
} from "lucide-react";
import NotesSection from "./components/NotesSection";
import TasksSection from "./components/TasksSection";
import ChatSection from "./components/ChatSection";

type TabType = "notes" | "tasks" | "chat";

const tabs = [
  { id: "notes" as TabType, label: "Notes", icon: FileText, description: "Real-time collaborative notes" },
  { id: "tasks" as TabType, label: "Tasks", icon: CheckSquare, description: "Priority-based task management" },
  { id: "chat" as TabType, label: "Chat", icon: MessageCircle, description: "Live messaging demo" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("notes");

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <header className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-900/20 via-transparent to-purple-900/10" />

        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-accent-500 to-purple-600 shadow-lg glow-accent">
                <Zap className="w-8 h-8 text-white" />
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-accent-200 to-purple-200 bg-clip-text text-transparent mb-4">
              Convex Demo
            </h1>

            <p className="text-surface-400 text-lg max-w-2xl mx-auto mb-6">
              Experience the power of Convex — a real-time backend with automatic syncing,
              reactive queries, and type-safe mutations.
            </p>

            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 glass px-4 py-2 rounded-full">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-surface-300">Real-time Sync</span>
              </div>
              <div className="flex items-center gap-2 glass px-4 py-2 rounded-full">
                <span className="text-surface-300">Open in multiple tabs to see live updates!</span>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="sticky top-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-1 py-2 overflow-x-auto">
            {tabs.map((tab, index) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-white"
                    : "text-surface-400 hover:text-surface-200"
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-accent-600/30 to-purple-600/30 rounded-xl border border-accent-500/30"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <tab.icon className="w-4 h-4 relative z-10" />
                <span className="relative z-10">{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "notes" && <NotesSection />}
            {activeTab === "tasks" && <TasksSection />}
            {activeTab === "chat" && <ChatSection />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-surface-500 text-sm">
              Built to demonstrate Convex real-time capabilities
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://docs.convex.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-surface-400 hover:text-accent-400 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Convex Docs</span>
              </a>
              <a
                href="https://github.com/get-convex/convex-backend"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-surface-400 hover:text-accent-400 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
