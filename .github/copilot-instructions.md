# Copilot Instructions for Port2025

## Project Overview
- **Framework:** Next.js 15 (App Router, TypeScript, MDX, next-intl, TailwindCSS)
- **Purpose:** Multilingual portfolio and blog site with static HTML blog posts per locale.
- **Key Directories:**
  - `app/` — Route handlers, layouts, pages (per-locale structure)
  - `components/` — UI and section components, organized by type
  - `lib/` — Core logic (e.g., blog post extraction)
  - `public/blog/` — Source of blog posts, organized by locale and slug
  - `i18n/` — Internationalization helpers and routing
  - `messages/` — Locale message JSONs

## Blog System
- Blog posts are static HTML files in `public/blog/{locale}/posts/`.
- Metadata (title, date, excerpt) is extracted from HTML tags by `lib/blog.ts`.
- API route `/api/blog` returns posts for a locale (default: `en`).
- URL pattern: `/{locale}/blog/{slug}`.
- To add a post: place a valid HTML file in the correct locale folder.

## Internationalization
- Uses `next-intl` for locale routing and translations.
- Supported locales: `en`, `es`, `fr`, `pt-BR`.
- Navigation and messages are managed in `i18n/` and `messages/`.

## Build & Dev
- **Dev:** `npm run dev` (uses Turbopack)
- **Build:** `npm run build`
- **Start:** `npm run start`
- **Lint:** `npm run lint`
- TailwindCSS and PostCSS are configured via `tailwindcss` and `postcss.config.mjs`.

## Patterns & Conventions
- Components are function-based, colocated by type (UI, layout, sections).
- Use TypeScript and explicit types for all logic and props.
- Blog logic is centralized in `lib/blog.ts`.
- API routes in `app/api/` delegate to `lib/` for business logic.
- Prefer semantic, accessible HTML in blog posts and components.
- Use `next-themes` for theme toggling, `next-intl` for locale switching.

## Examples
- See `lib/blog.ts` for blog parsing logic.
- See `app/[locale]/blog/[slug]/page.tsx` for blog post rendering.
- See `components/sections/` for page section patterns.

## Integration
- No database: all content is file-based.
- No server-side rendering for blog posts; all data is read from disk at runtime.

---

**For AI agents:**
- Always update both the HTML post and the correct locale index when adding content.
- When adding new locales, update `i18n/`, `messages/`, and `public/blog/`.
- Follow the file/folder conventions strictly for posts and components.
