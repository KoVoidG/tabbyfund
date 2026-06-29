# TabbyFund — Project Progress

## Completed Milestones

### Phase 1: Project Foundation ✅

| Task | Status |
|------|--------|
| Next.js 16 App Router scaffolding | ✅ |
| TypeScript strict mode | ✅ |
| Tailwind CSS v4 + shadcn/ui (radix-vega) | ✅ |
| Framer Motion | ✅ |
| React Hook Form + Zod v4 | ✅ |
| Supabase client (@supabase/ssr + supabase-js) | ✅ |
| Google Gemini (@google/genai) | ✅ |
| Leaflet + react-leaflet (replaced Google Maps) | ✅ |
| Recharts (dashboards) | ✅ |
| Lucide React icons | ✅ |
| browser-image-compression | ✅ |
| date-fns | ✅ |
| sonner (toast notifications) | ✅ |
| Feature-first folder structure | ✅ |
| Fonts: Inter (body) + Poppins (headings) | ✅ |
| Path aliases (@/*) | ✅ |
| Supabase client helpers (server/client/proxy) | ✅ |
| Next.js 16 proxy.ts (auth session refresh) | ✅ |
| .env.local.example | ✅ |
| ESLint + React Compiler | ✅ |

### Phase 2: Database Foundation ✅

| Task | Status |
|------|--------|
| Supabase CLI initialized (config.toml) | ✅ |
| Storage buckets configured (rescue-photos, treatment-photos, avatars) | ✅ |
| Migration 001: 9 PostgreSQL enums | ✅ |
| Migration 002: update_updated_at() utility | ✅ |
| Migration 003: profiles + RLS helpers + protect trigger | ✅ |
| Migration 004: cases + status history + public_cases view + SECURITY DEFINER | ✅ |
| Migration 005: transport + vet quotes + claim_transport() atomic fn | ✅ |
| Migration 006: donations + treatment + escrow release trigger | ✅ |
| Migration 007: foster + adoption + notifications + CHECK constraints | ✅ |
| Migration 008: storage policies (folder ownership enforced) | ✅ |
| seed.sql: 8 users, 10 cases, full lifecycle demo data | ✅ |
| npm scripts (gen:types, db:reset, db:migrate, db:push) | ✅ |

---

## Current Phase: Application Development

### Waiting On
- Docker + `supabase start` to validate migrations
- `npm run db:reset` to seed local database
- `npm run gen:types` to generate TypeScript types

### Next Up
- Design system implementation (colors, components, navigation)
- Authentication flows (login, register, auth guards)
- App shell (layouts, navigation, role-based routing)

---

## Architecture Decisions Log

| Decision | Reasoning |
|----------|-----------|
| Leaflet over Google Maps | Free, no API key needed, docs specify avoiding paid APIs |
| Inter (body) + Poppins (headings) | Doc 06 design system spec |
| Feature-first folders | Doc 02 architecture spec |
| proxy.ts over middleware.ts | Next.js 16 deprecated middleware convention |
| No email in profiles | auth.users is single source of truth |
| protect_profile_fields trigger | Prevents role/is_verified escalation |
| SECURITY DEFINER for public_cases | RLS blocks direct SELECT; function safely exposes fuzzed coords |
| claim_transport() atomic function | Prevents race conditions with FOR UPDATE SKIP LOCKED |
| Escrow release trigger on INSERT OR UPDATE | Handles both incremental and seed/admin scenarios |
| Donation privacy via aggregate function | get_funding_progress() exposes totals without donor_id |
| Partial unique index for foster | Allows history while enforcing one ACTIVE per case |
| CHECK constraints on foster/adoption | Database-level consistency enforcement |
| Folder ownership on storage | Prevents cross-user uploads |
