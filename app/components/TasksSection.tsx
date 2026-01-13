"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Check,
  Circle,
  AlertCircle,
  TrendingUp,
  ListTodo,
  Flame
} from "lucide-react";

const PRIORITIES = [
  { value: "low" as const, label: "Low", color: "text-blue-400", bg: "bg-blue-500/20" },
  { value: "medium" as const, label: "Medium", color: "text-yellow-400", bg: "bg-yellow-500/20" },
  { value: "high" as const, label: "High", color: "text-red-400", bg: "bg-red-500/20" },
];

export default function TasksSection() {
  const tasks = useQuery(api.tasks.list, { showCompleted: true });
  const stats = useQuery(api.tasks.getStats);
  const createTask = useMutation(api.tasks.create);
  const toggleTask = useMutation(api.tasks.toggle);
  const deleteTask = useMutation(api.tasks.remove);
  const clearCompleted = useMutation(api.tasks.clearCompleted);

  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [isAdding, setIsAdding] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    await createTask({
      text: newTask,
      priority,
    });
    setNewTask("");
    setIsAdding(false);
  };

  const getPriorityStyle = (p: "low" | "medium" | "high") => {
    const priority = PRIORITIES.find(pr => pr.value === p);
    return priority || PRIORITIES[1];
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-5"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-accent-500/20">
              <ListTodo className="w-5 h-5 text-accent-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats?.total ?? "—"}</p>
              <p className="text-sm text-surface-400">Total Tasks</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-5"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-500/20">
              <Check className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats?.completed ?? "—"}</p>
              <p className="text-sm text-surface-400">Completed</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-5"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-yellow-500/20">
              <TrendingUp className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats?.pending ?? "—"}</p>
              <p className="text-sm text-surface-400">Pending</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-5"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-red-500/20">
              <Flame className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats?.highPriority ?? "—"}</p>
              <p className="text-sm text-surface-400">High Priority</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Add Task Section */}
      <div className="glass rounded-2xl p-6">
        <AnimatePresence mode="wait">
          {isAdding ? (
            <motion.form
              key="form"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleCreate}
              className="space-y-4"
            >
              <input
                type="text"
                placeholder="What needs to be done?"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                autoFocus
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-surface-500 focus:border-accent-500/50"
              />

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-surface-400">Priority:</span>
                  <div className="flex gap-2">
                    {PRIORITIES.map((p) => (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => setPriority(p.value)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          priority === p.value
                            ? `${p.bg} ${p.color} ring-2 ring-current`
                            : "bg-white/5 text-surface-400 hover:bg-white/10"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1" />

                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 text-surface-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newTask.trim()}
                  className="btn-primary disabled:opacity-50"
                >
                  Add Task
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.button
              key="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(true)}
              className="w-full flex items-center gap-3 px-4 py-3 text-surface-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add a new task...</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {tasks === undefined ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="h-16 glass rounded-xl animate-pulse" />
          ))
        ) : tasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 glass rounded-2xl"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
              <Check className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">All caught up!</h3>
            <p className="text-surface-400">No tasks yet. Add one to get started.</p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {tasks.map((task, index) => {
              const priorityStyle = getPriorityStyle(task.priority);
              return (
                <motion.div
                  key={task._id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.03 }}
                  className={`group glass rounded-xl p-4 flex items-center gap-4 transition-all hover:bg-white/5 ${
                    task.isCompleted ? "opacity-60" : ""
                  }`}
                >
                  <button
                    onClick={() => toggleTask({ id: task._id })}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      task.isCompleted
                        ? "bg-emerald-500 border-emerald-500"
                        : "border-surface-500 hover:border-accent-400"
                    }`}
                  >
                    {task.isCompleted ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <Circle className="w-4 h-4 text-transparent group-hover:text-accent-400" />
                    )}
                  </button>

                  <span className={`flex-1 ${task.isCompleted ? "line-through text-surface-500" : "text-white"}`}>
                    {task.text}
                  </span>

                  <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${priorityStyle.bg} ${priorityStyle.color}`}>
                    {priorityStyle.label}
                  </span>

                  <button
                    onClick={() => deleteTask({ id: task._id })}
                    className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* Clear Completed Button */}
      {tasks && tasks.some(t => t.isCompleted) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-end"
        >
          <button
            onClick={() => clearCompleted()}
            className="text-sm text-surface-400 hover:text-red-400 transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear completed tasks
          </button>
        </motion.div>
      )}

      {/* Convex Concepts */}
      <div className="glass rounded-2xl p-6 mt-8">
        <h3 className="text-lg font-semibold text-white mb-4">🧠 Convex Concepts Used</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="p-4 bg-white/5 rounded-xl">
            <code className="text-accent-400 font-mono">Schema with Union Types</code>
            <p className="text-surface-400 mt-2">
              Priority uses <code className="text-blue-400">v.union()</code> for type-safe enum values: low | medium | high
            </p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl">
            <code className="text-emerald-400 font-mono">Computed Stats Query</code>
            <p className="text-surface-400 mt-2">
              <code className="text-blue-400">getStats</code> computes aggregations on the fly — always up to date!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
