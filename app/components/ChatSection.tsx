"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, MessageSquare, Trash2, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const AVATARS = [
  { name: "Alice", color: "from-pink-500 to-rose-500" },
  { name: "Bob", color: "from-blue-500 to-cyan-500" },
  { name: "Charlie", color: "from-emerald-500 to-green-500" },
  { name: "Diana", color: "from-purple-500 to-violet-500" },
  { name: "Eve", color: "from-orange-500 to-amber-500" },
];

export default function ChatSection() {
  const messages = useQuery(api.messages.list, { limit: 100 });
  const sendMessage = useMutation(api.messages.send);
  const clearMessages = useMutation(api.messages.clear);

  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleJoin = (name: string) => {
    setAuthor(name);
    setIsJoined(true);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;

    await sendMessage({ author, body });
    setBody("");
  };

  const getAvatarColor = (name: string) => {
    const avatar = AVATARS.find(a => a.name === name);
    if (avatar) return avatar.color;
    // Generate consistent color based on name
    const colors = [
      "from-pink-500 to-rose-500",
      "from-blue-500 to-cyan-500",
      "from-emerald-500 to-green-500",
      "from-purple-500 to-violet-500",
      "from-orange-500 to-amber-500",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (!isJoined) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-accent-500 to-purple-600 flex items-center justify-center shadow-lg glow-accent">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Join the Chat</h2>
          <p className="text-surface-400">
            Pick a name to start chatting. Open multiple tabs to see real-time sync!
          </p>
        </div>

        <div className="glass rounded-2xl p-6 space-y-4">
          <p className="text-sm text-surface-400 text-center">Quick join as:</p>
          <div className="grid grid-cols-5 gap-3">
            {AVATARS.map((avatar) => (
              <motion.button
                key={avatar.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleJoin(avatar.name)}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/10 transition-colors"
              >
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${avatar.color} flex items-center justify-center text-white font-bold text-lg`}>
                  {avatar.name[0]}
                </div>
                <span className="text-xs text-surface-300">{avatar.name}</span>
              </motion.button>
            ))}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-surface-900 text-surface-500 text-sm">or</span>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (author.trim()) handleJoin(author.trim());
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              placeholder="Enter your name..."
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-surface-500 focus:border-accent-500/50"
            />
            <button
              type="submit"
              disabled={!author.trim()}
              className="btn-primary disabled:opacity-50"
            >
              Join
            </button>
          </form>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col h-[70vh]">
      {/* Chat Header */}
      <div className="glass rounded-t-2xl p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarColor(author)} flex items-center justify-center text-white font-bold`}>
            {author[0].toUpperCase()}
          </div>
          <div>
            <p className="text-white font-medium">{author}</p>
            <p className="text-xs text-surface-400">Online</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsJoined(false)}
            className="px-3 py-1.5 text-sm text-surface-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            Switch User
          </button>
          <button
            onClick={() => clearMessages()}
            className="p-2 text-surface-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            title="Clear all messages"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 glass border-x border-white/5 overflow-y-auto p-4 space-y-4">
        {messages === undefined ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageSquare className="w-12 h-12 text-surface-600 mb-3" />
            <p className="text-surface-400">No messages yet</p>
            <p className="text-sm text-surface-500">Be the first to say something!</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((message, index) => {
              const isOwn = message.author === author;
              return (
                <motion.div
                  key={message._id}
                  initial={{ opacity: 0, y: 10, x: isOwn ? 20 : -20 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}
                >
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getAvatarColor(message.author)} flex-shrink-0 flex items-center justify-center text-white text-sm font-bold`}>
                    {message.author[0].toUpperCase()}
                  </div>
                  <div className={`max-w-[70%] ${isOwn ? "items-end" : "items-start"}`}>
                    <div className={`flex items-center gap-2 mb-1 ${isOwn ? "flex-row-reverse" : ""}`}>
                      <span className="text-sm font-medium text-surface-300">{message.author}</span>
                      <span className="text-xs text-surface-500">
                        {formatDistanceToNow(message.createdAt, { addSuffix: true })}
                      </span>
                    </div>
                    <div className={`px-4 py-2.5 rounded-2xl ${
                      isOwn
                        ? "bg-gradient-to-r from-accent-600 to-purple-600 text-white rounded-br-md"
                        : "bg-white/10 text-surface-200 rounded-bl-md"
                    }`}>
                      {message.body}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSend} className="glass rounded-b-2xl p-4 border-t border-white/10">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Type a message..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-surface-500 focus:border-accent-500/50"
          />
          <button
            type="submit"
            disabled={!body.trim()}
            className="btn-primary px-6 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>

      {/* Convex Concepts */}
      <div className="glass rounded-2xl p-6 mt-8">
        <h3 className="text-lg font-semibold text-white mb-4">🧠 Convex Concepts Used</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="p-4 bg-white/5 rounded-xl">
            <code className="text-accent-400 font-mono">Real-time Subscriptions</code>
            <p className="text-surface-400 mt-2">
              Messages sync instantly across all clients. No WebSocket setup needed — Convex handles it!
            </p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl">
            <code className="text-emerald-400 font-mono">Optimistic Updates</code>
            <p className="text-surface-400 mt-2">
              The UI updates immediately when you send a message, while Convex confirms it in the background.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
