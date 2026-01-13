import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// This schema defines the structure of our Convex database
// Convex automatically creates tables and handles all the database operations
export default defineSchema({
  // Notes table - demonstrates basic CRUD with real-time sync
  notes: defineTable({
    title: v.string(),
    content: v.string(),
    color: v.string(),
    isPinned: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    // Indexes allow efficient querying
    .index("by_pinned", ["isPinned"])
    .index("by_created", ["createdAt"]),

  // Tasks table - demonstrates more complex data relationships
  tasks: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    dueDate: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_completed", ["isCompleted"])
    .index("by_priority", ["priority"]),

  // Messages table - demonstrates real-time chat functionality
  messages: defineTable({
    author: v.string(),
    body: v.string(),
    createdAt: v.number(),
  }).index("by_created", ["createdAt"]),
});
