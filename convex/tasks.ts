import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Demonstrates filtering and complex queries

export const list = query({
  args: {
    showCompleted: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let tasks = await ctx.db.query("tasks").order("desc").collect();

    if (args.showCompleted === false) {
      tasks = tasks.filter((t) => !t.isCompleted);
    }

    // Sort by priority (high > medium > low), then by creation date
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return tasks.sort((a, b) => {
      if (a.isCompleted !== b.isCompleted) {
        return a.isCompleted ? 1 : -1;
      }
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.createdAt - a.createdAt;
    });
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const tasks = await ctx.db.query("tasks").collect();
    const total = tasks.length;
    const completed = tasks.filter((t) => t.isCompleted).length;
    const pending = total - completed;
    const highPriority = tasks.filter((t) => t.priority === "high" && !t.isCompleted).length;

    return { total, completed, pending, highPriority };
  },
});

export const create = mutation({
  args: {
    text: v.string(),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    dueDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tasks", {
      text: args.text,
      isCompleted: false,
      priority: args.priority,
      dueDate: args.dueDate,
      createdAt: Date.now(),
    });
  },
});

export const toggle = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.id);
    if (!task) throw new Error("Task not found");
    await ctx.db.patch(args.id, { isCompleted: !task.isCompleted });
  },
});

export const remove = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const clearCompleted = mutation({
  args: {},
  handler: async (ctx) => {
    const completed = await ctx.db
      .query("tasks")
      .filter((q) => q.eq(q.field("isCompleted"), true))
      .collect();

    for (const task of completed) {
      await ctx.db.delete(task._id);
    }
    return completed.length;
  },
});
