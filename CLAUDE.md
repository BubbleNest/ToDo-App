@AGENTS.md

# Todo App — CLAUDE.md

Full-stack todo application built with Next.js 16 (App Router), Supabase, Tailwind CSS v4, shadcn/ui, and TypeScript strict mode.

---

## Tech stack

| Layer      | Technology                          |
| ---------- | ----------------------------------- |
| Framework  | Next.js 16 — App Router             |
| Database   | Supabase (Postgres + Auth)          |
| Styling    | Tailwind CSS v4 + shadcn/ui         |
| Language   | TypeScript 5 — strict mode          |
| Runtime    | React 19                            |

---

## Commands

```bash
npm run dev      # dev server (http://localhost:3000)
npm run build    # production build
npm run lint     # eslint
```

---

## Project structure

```
src/
  app/                  # App Router — all routes live here
    layout.tsx          # Root layout (Server Component)
    page.tsx            # Home route (/)
    (auth)/             # Route group — auth pages, no URL prefix
    todos/
      page.tsx          # /todos
      [id]/
        page.tsx        # /todos/:id
  components/
    ui/                 # shadcn/ui primitives (do not edit)
    todos/              # Feature components
  lib/
    supabase/
      client.ts         # Browser Supabase client (singleton)
      server.ts         # Server Supabase client (per-request)
    actions/            # Server Functions (mutations)
    queries/            # Server-side data fetching helpers
  types/                # Shared TypeScript types / Supabase generated types
```

Private folders (`_folder`) colocate non-routable files next to a route without exposing them as URLs.

---

## Next.js 16 — critical conventions

### Components default to Server Components

Layouts and pages are Server Components unless marked `'use client'`. Prefer Server Components — they reduce JS bundle size and can fetch data directly.

Add `'use client'` only when the component needs:
- `useState`, `useEffect`, or any React hook with state/lifecycle
- Event handlers (`onClick`, `onChange`)
- Browser-only APIs (`localStorage`, `window`, etc.)
- Custom hooks

### params is a Promise — always await it

```tsx
// CORRECT
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
}
```

### Server Functions / Server Actions

Mutations use the `'use server'` directive. Place the directive at the top of the async function body, or at the top of a dedicated `actions/` file.

```ts
// src/lib/actions/todos.ts
'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'

export async function createTodo(formData: FormData) {
  const supabase = await createServerClient()
  const { error } = await supabase.from('todos').insert({ title: formData.get('title') })
  if (error) throw new Error(error.message)
  revalidatePath('/todos')
}
```

Always verify auth inside every Server Function before touching data.

### Caching

- Fetch is **not cached by default** — use the `use cache` directive or wrap with `<Suspense>` to stream.
- Call `revalidatePath('/path')` or `revalidateTag('tag')` after mutations.

### Instant navigation

Export `unstable_instant` from a route when client-side navigations to it feel slow. Read `node_modules/next/dist/docs/01-app/02-guides/instant-navigation.mdx` before using it.

---

## Supabase conventions

- **Server client**: create per-request in Server Components and Server Functions (`createServerClient`).
- **Browser client**: one singleton instance for Client Components that need real-time or auth state (`createBrowserClient`).
- **Types**: regenerate with `supabase gen types typescript` and commit to `src/types/supabase.ts`.
- Never expose the `SERVICE_ROLE` key on the client.
- Row Level Security (RLS) must be enabled on every table. Enforce auth checks in RLS policies, not only in application code.

---

## TypeScript conventions

- `strict: true` — no exceptions.
- No `any`. Use `unknown` and narrow explicitly.
- Prefer `type` over `interface` for data shapes; use `interface` only when extension/declaration-merging is intentional.
- All async functions must have explicit return types when used as Server Functions or exported utilities.
- Import path alias: `@/` resolves to `src/`.

---

## Component conventions

- One component per file. Filename = component name in PascalCase (`TodoItem.tsx`).
- Server Components: async function, no hooks.
- Client Components: `'use client'` at the very top, before imports.
- shadcn/ui primitives live in `src/components/ui/` — import them, never edit them directly. Compose new components on top of them in `src/components/`.
- Props types are defined inline or as a `type` above the component, never in a separate file unless shared across multiple components.

---

## Tailwind CSS v4 conventions

- Tailwind v4 uses a CSS-first config (`postcss.config.mjs`). There is no `tailwind.config.ts` by default.
- Use utility classes directly in JSX. No inline `style` props unless animating dynamic values.
- `cn()` helper (from `clsx` + `tailwind-merge`) for conditional class merging.

---

## Commit conventions (Conventional Commits)

```
<type>(<scope>): <subject>
```

**Types:**

| Type       | When to use                                  |
| ---------- | -------------------------------------------- |
| `feat`     | New feature                                  |
| `fix`      | Bug fix                                      |
| `refactor` | Code change that neither fixes nor adds      |
| `style`    | Formatting only (no logic change)            |
| `test`     | Adding or updating tests                     |
| `chore`    | Tooling, deps, config (no production change) |
| `docs`     | Documentation only                           |
| `perf`     | Performance improvement                      |

**Scope** (optional): `todos`, `auth`, `ui`, `db`, `api`, `config`

**Examples:**
```
feat(todos): add due date field to todo form
fix(auth): handle expired session redirect
chore(deps): upgrade supabase-js to v2.50
refactor(todos): extract useTodoList hook
```

Rules:
- Subject in imperative mood, lowercase, no trailing period.
- Body (optional): explain *why*, not *what*.
- Breaking changes: add `!` after the type/scope and a `BREAKING CHANGE:` footer.

---

## Security rules

- Never commit `.env.local` or any file containing secrets.
- All Server Functions must authenticate the caller before reading or writing data.
- Validate and sanitize all user input at the boundary (Server Function / Route Handler), not deeper in the call stack.
- Use parameterized Supabase queries — never concatenate user input into SQL strings.
