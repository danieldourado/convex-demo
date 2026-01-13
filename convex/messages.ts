import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Real-time chat - demonstrates live updates across multiple clients

export const list = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    const messages = await ctx.db
      .query("messages")
      .order("desc")
      .take(limit);

    // Return in chronological order
    return messages.reverse();
  },
});

export const send = mutation({
  args: {
    author: v.string(),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.body.trim()) {
      throw new Error("Message cannot be empty");
    }

    return await ctx.db.insert("messages", {
      author: args.author,
      body: args.body.trim(),
      createdAt: Date.now(),
    });
  },
});

export const clear = mutation({
  args: {},
  handler: async (ctx) => {
    const messages = await ctx.db.query("messages").collect();
    for (const message of messages) {
      await ctx.db.delete(message._id);
    }
  },
});
