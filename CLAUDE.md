# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start dev server (port 3000, hot reload)
- `npm run build` — Production build
- `npm start` — Start production server (requires build first)
- `npm run lint` — ESLint

No test runner is configured yet.

## Architecture

Next.js 16 App Router project with React 19, TypeScript (strict mode), and Tailwind CSS v4. Supabase for auth and database. Recharts for data visualization.

### App structure

- `app/page.tsx` — Landing/marketing page
- `app/layout.tsx` — Root layout with Geist fonts and metadata
- `app/globals.css` — Design tokens (neutral palette, accent, border, muted) with light/dark support
- `app/(auth)/login/` — Email/password login
- `app/(auth)/signup/` — Email/password signup
- `app/(protected)/layout.tsx` — Auth guard (server-side), renders sidebar + header
- `app/(protected)/dashboard/` — Metric cards + Recharts (pie, bar, line)
- `app/(protected)/inventory/` — Sortable item table with add/edit modal
- `app/(protected)/suitcase/` — Packing simulation with capacity slider
- `middleware.ts` — Session refresh, redirects unauthenticated users to /login

### Key directories

- `components/layout/` — Sidebar (responsive, hamburger on mobile) and Header
- `components/inventory/` — ItemTable, ItemForm (modal), CategoryBadge
- `components/simulation/` — SuitcaseSim, PackingList (with clipboard export)
- `components/charts/` — CategoryPie, EssentialsBar, GrowthLine (all "use client")
- `lib/supabase/` — Browser client, server client, middleware helpers
- `lib/algorithms/packing.ts` — Greedy packing: essentials first, then by recency
- `lib/utils/` — cn(), formatDate(), formatWeight()
- `types/index.ts` — Item, Category, PackingResult, User types

### Database

Supabase with RLS. Tables: `categories` (id, user_id, name, color) and `items` (id, user_id, name, category_id, is_essential, weight_grams, tags, last_used_at, notes). Migration in `supabase-migration.sql`.

### Conventions

- `@/*` path alias maps to the project root
- Server components by default; "use client" only for interactive components
- Supabase client created per-request (server) or per-component (browser)
- Design tokens as CSS custom properties consumed via Tailwind theme
