# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start dev server (port 3000, hot reload)
- `npm run build` — Production build
- `npm start` — Start production server (requires build first)
- `npm run lint` — ESLint

No test runner is configured yet.

## Architecture

Next.js 16 App Router project with React 19, TypeScript (strict mode), and Tailwind CSS v4.

- `app/` — App Router pages and layouts (server components by default)
- `app/layout.tsx` — Root layout with Geist font setup and metadata
- `app/page.tsx` — Home page
- `app/globals.css` — Global styles with Tailwind imports and CSS custom properties for theming (light/dark via `prefers-color-scheme`)
- `@/*` path alias maps to the project root
