import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// QUERIES - Read data from the database
// Queries are reactive: the UI automatically updates when data changes!

export const list = query({
  args: {},
  handler: async (ctx) => {
    // Fetch all notes, pinned ones first, then by creation date
    const notes = await ctx.db
      .query("notes")
      .order("desc")
      .collect();

    // Sort: pinned first, then by updatedAt
    return notes.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.updatedAt - a.updatedAt;
    });
  },
});

export const get = query({
  args: { id: v.id("notes") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// MUTATIONS - Modify data in the database
// Mutations are transactional and automatically sync to all connected clients

export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    color: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const noteId = await ctx.db.insert("notes", {
      title: args.title,
      content: args.content,
      color: args.color,
      isPinned: false,
      createdAt: now,
      updatedAt: now,
    });
    return noteId;
  },
});

export const update = mutation({
  args: {
    id: v.id("notes"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    color: v.optional(v.string()),
    isPinned: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const existingNote = await ctx.db.get(id);
    if (!existingNote) {
      throw new Error("Note not found");
    }

    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("notes") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const togglePin = mutation({
  args: { id: v.id("notes") },
  handler: async (ctx, args) => {
    const note = await ctx.db.get(args.id);
    if (!note) {
      throw new Error("Note not found");
    }
    await ctx.db.patch(args.id, {
      isPinned: !note.isPinned,
      updatedAt: Date.now(),
    });
  },
});
