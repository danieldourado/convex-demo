# Convex Demo Application

A beautiful, interactive demo showcasing **Convex** — a real-time backend-as-a-service with automatic syncing, reactive queries, and type-safe mutations.

![Convex Demo](https://convex.dev/logo.svg)

## 🚀 Features

This demo includes three interactive sections:

### 📝 Notes
- Create, edit, and delete notes
- Pin important notes
- Color-coded organization
- Real-time sync across tabs

### ✅ Tasks
- Priority-based task management (Low/Medium/High)
- Toggle completion status
- Live statistics dashboard
- Clear completed tasks

### 💬 Chat
- Real-time messaging
- Multiple user simulation
- Instant message delivery
- Open multiple tabs to see live sync!

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Convex (real-time database + serverless functions)
- **Styling**: Tailwind CSS, Framer Motion
- **Icons**: Lucide React

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A Convex account (free at [convex.dev](https://convex.dev))

### Installation

1. **Install dependencies**:

```bash
npm install
```

2. **Set up Convex**:

```bash
npx convex dev
```

This command will:
- Prompt you to log in or create a Convex account
- Create a new Convex project (or link to existing)
- Generate the `convex/_generated` folder with type-safe APIs
- Start the Convex development server
- Create a `.env.local` file with your `NEXT_PUBLIC_CONVEX_URL`

3. **Start the Next.js dev server** (in a new terminal):

```bash
npm run dev:frontend
```

Or run both together:

```bash
npm run dev
```

4. **Open your browser** at [http://localhost:3000](http://localhost:3000)

## 🧠 Understanding Convex

### Key Concepts

#### 1. Schema (`convex/schema.ts`)
Defines your database structure with type-safe validators:

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  notes: defineTable({
    title: v.string(),
    content: v.string(),
    isPinned: v.boolean(),
  }).index("by_pinned", ["isPinned"]),
});
```

#### 2. Queries (`convex/notes.ts`)
Read data reactively — UI auto-updates when data changes:

```typescript
import { query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("notes").collect();
  },
});
```

#### 3. Mutations
Write data transactionally — syncs to all clients instantly:

```typescript
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: { title: v.string(), content: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("notes", {
      title: args.title,
      content: args.content,
      isPinned: false,
    });
  },
});
```

#### 4. React Hooks
Use type-safe hooks in your components:

```tsx
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

function NotesComponent() {
  // Reactive query - re-renders on data change
  const notes = useQuery(api.notes.list);

  // Type-safe mutation
  const createNote = useMutation(api.notes.create);

  const handleCreate = () => {
    createNote({ title: "New Note", content: "..." });
  };
}
```

## 🎨 Project Structure

```
convex-demo/
├── app/
│   ├── components/
│   │   ├── NotesSection.tsx    # Notes CRUD demo
│   │   ├── TasksSection.tsx    # Tasks with priorities
│   │   └── ChatSection.tsx     # Real-time chat
│   ├── ConvexClientProvider.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── convex/
│   ├── _generated/             # Auto-generated (don't edit)
│   ├── schema.ts               # Database schema
│   ├── notes.ts                # Notes queries & mutations
│   ├── tasks.ts                # Tasks queries & mutations
│   └── messages.ts             # Chat queries & mutations
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## 🔥 Why Convex?

| Feature | Traditional Backend | Convex |
|---------|-------------------|--------|
| Real-time sync | Manual WebSocket setup | ✅ Automatic |
| Type safety | Manual types + validation | ✅ End-to-end TypeScript |
| Database | SQL setup + ORM | ✅ Built-in with indexes |
| Serverless | Configure + deploy | ✅ Just write functions |
| Auth | Implement + secure | ✅ Built-in providers |

## 🧪 Testing Real-time Features

1. Open the app in **two browser tabs**
2. Create a note in one tab
3. Watch it appear instantly in the other tab!
4. Try the chat feature with different usernames

## 📚 Learn More

- [Convex Documentation](https://docs.convex.dev)
- [Convex Quickstart](https://docs.convex.dev/quickstart)
- [Convex Discord Community](https://convex.dev/community)

## 📄 License

MIT
