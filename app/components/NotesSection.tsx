"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pin,
  Trash2,
  Edit3,
  X,
  Check,
  Sparkles
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const NOTE_COLORS = [
  { name: "Grape", value: "bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-purple-500/30" },
  { name: "Ocean", value: "bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/30" },
  { name: "Emerald", value: "bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border-emerald-500/30" },
  { name: "Sunset", value: "bg-gradient-to-br from-orange-500/20 to-orange-600/10 border-orange-500/30" },
  { name: "Rose", value: "bg-gradient-to-br from-pink-500/20 to-pink-600/10 border-pink-500/30" },
  { name: "Slate", value: "bg-gradient-to-br from-slate-500/20 to-slate-600/10 border-slate-500/30" },
];

export default function NotesSection() {
  const notes = useQuery(api.notes.list);
  const createNote = useMutation(api.notes.create);
  const updateNote = useMutation(api.notes.update);
  const deleteNote = useMutation(api.notes.remove);
  const togglePin = useMutation(api.notes.togglePin);

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<Id<"notes"> | null>(null);
  const [newNote, setNewNote] = useState({ title: "", content: "", color: NOTE_COLORS[0].value });
  const [editNote, setEditNote] = useState({ title: "", content: "" });

  const handleCreate = async () => {
    if (!newNote.title.trim()) return;
    await createNote({
      title: newNote.title,
      content: newNote.content,
      color: newNote.color,
    });
    setNewNote({ title: "", content: "", color: NOTE_COLORS[0].value });
    setIsCreating(false);
  };

  const handleUpdate = async (id: Id<"notes">) => {
    await updateNote({
      id,
      title: editNote.title,
      content: editNote.content,
    });
    setEditingId(null);
  };

  const startEditing = (note: { _id: Id<"notes">; title: string; content: string }) => {
    setEditingId(note._id);
    setEditNote({ title: note.title, content: note.content });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-accent-400" />
            Notes
          </h2>
          <p className="text-surface-400 mt-1">
            Create notes and watch them sync in real-time across all connected clients
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Note
        </button>
      </div>

      {/* Create Note Modal */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsCreating(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg glass rounded-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">Create Note</h3>
                <button
                  onClick={() => setIsCreating(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-surface-400" />
                </button>
              </div>

              <input
                type="text"
                placeholder="Note title..."
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-surface-500 focus:border-accent-500/50"
              />

              <textarea
                placeholder="Write your note content..."
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-surface-500 focus:border-accent-500/50 resize-none"
              />

              <div>
                <label className="text-sm text-surface-400 mb-2 block">Color</label>
                <div className="flex gap-2 flex-wrap">
                  {NOTE_COLORS.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setNewNote({ ...newNote, color: color.value })}
                      className={`w-10 h-10 rounded-xl border-2 transition-all ${color.value} ${
                        newNote.color === color.value
                          ? "ring-2 ring-accent-500 ring-offset-2 ring-offset-surface-900"
                          : ""
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setIsCreating(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!newNote.title.trim()}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Note
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notes Grid */}
      {notes === undefined ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 glass rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : notes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 glass rounded-2xl"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-accent-500/20 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-accent-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No notes yet</h3>
          <p className="text-surface-400 mb-4">Create your first note to get started</p>
          <button onClick={() => setIsCreating(true)} className="btn-primary">
            <Plus className="w-4 h-4 mr-2 inline" />
            Create Note
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {notes.map((note, index) => (
              <motion.div
                key={note._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className={`relative group rounded-2xl border p-5 ${note.color} transition-all hover:scale-[1.02]`}
              >
                {note.isPinned && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center shadow-lg">
                    <Pin className="w-4 h-4 text-white" />
                  </div>
                )}

                {editingId === note._id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editNote.title}
                      onChange={(e) => setEditNote({ ...editNote, title: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    />
                    <textarea
                      value={editNote.content}
                      onChange={(e) => setEditNote({ ...editNote, content: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white resize-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="flex-1 px-3 py-2 bg-white/10 rounded-lg text-surface-300 hover:bg-white/20"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleUpdate(note._id)}
                        className="flex-1 px-3 py-2 bg-accent-600 rounded-lg text-white hover:bg-accent-500"
                      >
                        <Check className="w-4 h-4 inline mr-1" />
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-white mb-2 pr-8">{note.title}</h3>
                    <p className="text-surface-300 text-sm line-clamp-4 mb-4">{note.content}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-surface-500">
                        {formatDistanceToNow(note.updatedAt, { addSuffix: true })}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => togglePin({ id: note._id })}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          title={note.isPinned ? "Unpin" : "Pin"}
                        >
                          <Pin className={`w-4 h-4 ${note.isPinned ? "text-accent-400" : "text-surface-400"}`} />
                        </button>
                        <button
                          onClick={() => startEditing(note)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4 text-surface-400" />
                        </button>
                        <button
                          onClick={() => deleteNote({ id: note._id })}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Convex Concepts Explanation */}
      <div className="glass rounded-2xl p-6 mt-8">
        <h3 className="text-lg font-semibold text-white mb-4">🧠 Convex Concepts Used</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="p-4 bg-white/5 rounded-xl">
            <code className="text-accent-400 font-mono">useQuery(api.notes.list)</code>
            <p className="text-surface-400 mt-2">
              Reactive query that automatically re-renders when data changes. No manual refetching needed!
            </p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl">
            <code className="text-emerald-400 font-mono">useMutation(api.notes.create)</code>
            <p className="text-surface-400 mt-2">
              Type-safe mutations that validate arguments and sync changes to all clients instantly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
