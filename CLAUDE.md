# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run lint     # ESLint (flat config, eslint.config.mjs)
npm test         # Run all Jest tests
npx jest src/__tests__/ui/Button.test.tsx   # Run a single test file
npx jest --testNamePattern "renders"        # Run tests matching a name
```

## Stack

- **Next.js 16.2.4** — App Router (`src/app/`). Before writing Next.js-specific code, check `node_modules/next/dist/docs/` — v16 differs from training data.
- **React 19**, **TypeScript** (strict, `@/*` → `src/*`)
- **Tailwind CSS v3.4** — configured in `tailwind.config.ts`. Theme tokens (colors, typography, radius, shadows) map to CSS variables defined in `globals.css`.
- **Supabase** (`@supabase/ssr`) — Auth + Postgres + Storage
- **Jest 30 + Testing Library** — tests in `src/__tests__/`, config in `jest.config.ts`

## Architecture

### Route & Layout Structure

```
src/app/
├── layout.tsx                  # Root layout (Geist fonts, AuthProvider, CalendarProvider)
├── page.tsx                    # Landing → redirects to /dashboard
├── login/page.tsx              # Google OAuth login
├── dashboard/
│   ├── layout.tsx              # DashboardLayout: AuthGuard + Sidebar + Header + MobileMenu
│   ├── page.tsx                # Dashboard home
│   ├── tasks/page.tsx
│   ├── calendar/page.tsx
│   └── documents/
│       ├── proofread/page.tsx
│       ├── minutes/page.tsx
│       └── research/page.tsx
└── api/
    ├── auth/callback/          # Supabase OAuth callback
    ├── tasks/[id]/
    ├── calendar/events/ + sync/
    ├── documents/proofread/ + proofread/[id]/
    ├── documents/minutes/ + minutes/[id]/ + minutes/[id]/status/
    └── research/ + research/[id]/
```

`src/middleware.ts` guards `/dashboard/**` — redirects to `/login` when unauthenticated.

### Supabase Client Hierarchy

Three distinct clients — use the right one:

| Client | File | When to use |
|--------|------|-------------|
| Browser | `src/lib/supabase/client.ts` | Client components, hooks, contexts |
| Server (SSR) | `src/lib/supabase/server.ts` | API Route Handlers, Server Components |
| Admin | `src/lib/supabase/admin.ts` | Storage ops that bypass RLS (e.g. signed URL generation) |

API routes always call `await createClient()` from `server.ts` and verify `supabase.auth.getUser()` before touching data.

### Database Schema

One `documents` table serves all document features, distinguished by `type`:

```
documents: id, user_id, type ('proofread'|'minutes'|'research'), title,
           original_content, processed_content, metadata JSONB, created_at
```

`metadata JSONB` holds feature-specific structured data. Cast it with `as unknown as CustomType` because Supabase returns `Json` type.

Other tables: `tasks`, `users`, `writing_styles`. All have RLS enabled — user sees only their own rows.

### Authentication Flow

`AuthContext` (`src/lib/auth/AuthContext.tsx`) wraps the app and provides `{ user, isLoading, signIn, signOut }`. It subscribes to `supabase.auth.onAuthStateChange`. `AuthGuard` (`src/components/auth/AuthGuard.tsx`) renders children only when authenticated; middleware handles server-side redirect.

### Feature Data Flows

**Proofread** (synchronous):
`page` → `POST /api/documents/proofread` → OpenAI gpt-4o-mini (JSON mode) → save to DB → return `ProofreadResult`

**Minutes** (async polling):
`page` → `POST /api/documents/minutes` (FormData) → Storage upload → AssemblyAI submit → save `status:'transcribing'`
Client polls `GET /api/documents/minutes/[id]/status` every 5 s → AssemblyAI status check → on complete: OpenAI generate → DB update to `status:'completed'`

**Research** (synchronous):
`page` → `POST /api/research` → Perplexity API (`sonar` model via OpenAI SDK, baseURL `https://api.perplexity.ai`) → citations extracted via `as unknown as { citations?: string[] }` → OpenAI structure summary → save to DB

### State Management

- **Auth state**: `AuthContext` (global, client)
- **Calendar state**: `CalendarContext` (`src/contexts/CalendarContext.tsx`) — events CRUD + 5-min auto-sync with Google Calendar
- **Task state**: `TaskContext` (`src/contexts/TaskContext.tsx`) — task CRUD with optimistic updates
- **Feature-level state**: custom hooks in `src/hooks/` (no global store for documents/research)

### Design System

Dark-only Apple HIG theme. All styling via CSS variables + Tailwind utilities. **Never use raw hex values or Tailwind gray-\* colors in components.**

**Apple typography scale** (Tailwind classes):
`text-largetitle` / `text-title1` / `text-title2` / `text-title3` / `text-headline` / `text-body` / `text-callout` / `text-subheadline` / `text-footnote` / `text-caption1` / `text-caption2`

**Apple utility classes** (defined in `globals.css`):
- `.apple-card` — elevated card surface (`bg-background-elevated`, border, shadow)
- `.apple-inset` — inset section (`bg-background-tertiary`, inset shadow)
- `.apple-glass` / `.apple-glass-dark` — frosted glass with `backdrop-filter`

**Color token naming** mirrors Apple semantics: `text-foreground` / `text-foreground-secondary` / `text-foreground-tertiary` / `text-foreground-quaternary`, `bg-background` / `bg-background-elevated` / `bg-background-secondary` / `bg-background-tertiary`.

### API Route Pattern

Every route handler follows this shape:

```ts
export async function GET(req, { params }) {
  const supabase = await createClient()          // server client
  const { data: { user }, error } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params                    // params is a Promise in Next.js 16
  // ... query with .eq('user_id', user.id) for RLS enforcement
}
```

Dynamic route `params` must be `await`ed in Next.js 16.

### Testing

Tests live in `src/__tests__/{ui,layout,pages}/`. They cover UI components only (no API routes). Mock for CSS modules at `src/__mocks__/styleMock.ts`. Run a focused test with `npx jest --testPathPattern=Button`.

## Key Gotchas

- **`params` must be awaited**: `const { id } = await params` in all dynamic route handlers.
- **Supabase `Json` → custom type**: use two-stage cast `(value as unknown as MyType)`.
- **Storage filename sanitization**: audio files stored as `${userId}/${Date.now()}.${ext}` — Japanese filenames and special characters cause "Invalid key" errors in Supabase Storage.
- **AssemblyAI**: use `speech_models: ['universal-2']` (plural array), not the deprecated `speech_model` string.
- **Polling stale closure**: minutes polling uses `useRef` to hold the polling interval reference to avoid stale closure bugs in `useEffect`.
- **`react-hooks/set-state-in-effect` lint rule**: don't call `setState` synchronously inside `useEffect`; derive state from existing state instead.
