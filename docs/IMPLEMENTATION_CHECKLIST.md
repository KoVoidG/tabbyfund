# TabbyFund — Implementation Checklist

Each section maps to a feature module. Tasks are ordered by dependency.
Mark completed tasks with `[x]`.

---

## 1. Authentication

- [ ] Create `src/app/(auth)/login/page.tsx` — email/password login form
- [ ] Create `src/app/(auth)/register/page.tsx` — signup form with display_name
- [ ] Create `src/app/(auth)/forgot-password/page.tsx` — password reset request
- [ ] Create `src/features/auth/actions.ts` — server actions (login, register, logout, reset)
- [ ] Create `src/features/auth/schemas.ts` — Zod schemas (loginSchema, registerSchema)
- [ ] Create auth route group layout `(auth)/layout.tsx` — centered card layout
- [ ] Implement role-based redirect after login (community → dashboard, vet → vet dashboard, admin → admin)
- [ ] Create `src/lib/supabase/auth-helpers.ts` — getUser(), getProfile(), requireAuth(), requireRole()
- [ ] Protect routes: redirect unauthenticated users to /login
- [ ] Add loading, error states to auth pages

---

## 2. Design System

- [ ] Configure CSS variables for TabbyFund brand colors (#6C5CE7, #A78BFA, #F3C9A6, #FFF3E0, #F7F7FB, #2D3748)
- [ ] Update globals.css with brand palette (override shadcn defaults)
- [ ] Add shadcn components: Card, Badge, Dialog, Input, Textarea, Select, Avatar, Progress, Skeleton, Tabs, Separator
- [ ] Create `src/components/ui/bottom-navigation.tsx` — mobile nav (5 items)
- [ ] Create `src/components/ui/sidebar.tsx` — desktop nav
- [ ] Create `src/components/ui/status-badge.tsx` — case status badges with colors
- [ ] Create `src/components/ui/severity-badge.tsx` — AI severity indicators
- [ ] Create `src/components/ui/funding-progress.tsx` — progress bar component
- [ ] Create `src/components/ui/empty-state.tsx` — illustration + message + CTA
- [ ] Create `src/components/ui/page-header.tsx` — consistent page titles
- [ ] Create mascot placeholder SVG components (loading, empty, success, error states)
- [ ] Typography: heading classes use font-heading (Poppins), body uses font-sans (Inter)

---

## 3. App Shell

- [ ] Create `src/app/(app)/layout.tsx` — authenticated app layout with navigation
- [ ] Create bottom navigation component (Home, Feed, Report, Activity, Profile)
- [ ] Create desktop sidebar navigation
- [ ] Implement role-aware navigation (hide vet/admin links from community users)
- [ ] Create `src/app/(app)/loading.tsx` — skeleton loader
- [ ] Create `src/app/(app)/error.tsx` — error boundary
- [ ] Create `src/app/(app)/not-found.tsx` — 404 page with mascot

---

## 4. Community Dashboard

- [ ] Create `src/app/(app)/dashboard/page.tsx` — server component
- [ ] Create `src/features/dashboard/components/ImpactStats.tsx` — cats reported, missions, donations
- [ ] Create `src/features/dashboard/components/ActiveMissions.tsx` — current transport/foster assignments
- [ ] Create `src/features/dashboard/components/QuickActions.tsx` — report, browse, adopt, donate buttons
- [ ] Create `src/features/dashboard/components/RecentActivity.tsx` — timeline of user actions
- [ ] Create `src/features/dashboard/actions.ts` — server actions for dashboard data
- [ ] Add loading skeleton for dashboard

---

## 5. Report Rescue

- [ ] Create `src/app/(app)/report/page.tsx` — multi-step form
- [ ] Create `src/features/report/components/PhotoUpload.tsx` — image capture + compression + upload
- [ ] Create `src/features/report/components/DescriptionStep.tsx` — text input with guidance
- [ ] Create `src/features/report/components/MapPicker.tsx` — Leaflet map with pin drop
- [ ] Create `src/features/report/components/ProgressStepper.tsx` — step indicator
- [ ] Create `src/features/report/schemas.ts` — Zod schema for report form
- [ ] Create `src/features/report/actions.ts` — createRescueCase() server action
- [ ] Implement image compression before upload (browser-image-compression)
- [ ] Implement coordinate fuzzing utility (`src/utils/fuzz-coordinates.ts`)
- [ ] Handle GPS unavailable gracefully (manual pin drop)
- [ ] Show rescue guidance after successful submission
- [ ] Create transport request automatically after case creation

---

## 6. Rescue Feed

- [ ] Create `src/app/(app)/feed/page.tsx` — server component with cases list
- [ ] Create `src/features/feed/components/CaseCard.tsx` — photo, severity, status, location, funding
- [ ] Create `src/features/feed/components/FeedFilters.tsx` — severity, status filter
- [ ] Create `src/features/feed/components/FeedSort.tsx` — severity, newest, distance
- [ ] Create `src/app/(app)/cases/[id]/page.tsx` — case detail page
- [ ] Create `src/features/feed/components/CaseTimeline.tsx` — visual lifecycle progress
- [ ] Create `src/features/feed/components/CaseActions.tsx` — role-based action buttons
- [ ] Create `src/features/feed/actions.ts` — getCases(), getCaseById()
- [ ] Implement pagination (10 per page)
- [ ] Use public_cases view for feed queries (fuzzed coordinates only)

---

## 7. AI Triage

- [ ] Create `src/lib/ai/gemini-service.ts` — AI service layer (build prompt, call API, validate)
- [ ] Create `src/lib/ai/prompts.ts` — system prompt template
- [ ] Create `src/lib/ai/schemas.ts` — Zod schema for AI response validation
- [ ] Create `src/lib/ai/mock.ts` — fallback mock response for demo/offline
- [ ] Create route handler `src/app/api/ai/triage/route.ts` — server-side AI endpoint
- [ ] Display AI results on case detail page (severity badge, condition, reasoning, first aid)
- [ ] Show confidence level indicator
- [ ] Show AI disclaimer ("Generated by AI. Not a medical diagnosis.")
- [ ] Handle AI failure gracefully (case still created, AI marked unavailable)
- [ ] Retry once on validation failure before marking unavailable

---

## 8. Transport

- [ ] Create `src/app/(app)/transport/page.tsx` — transport queue
- [ ] Create `src/features/transport/components/TransportCard.tsx` — case info + claim button
- [ ] Create `src/features/transport/components/TransportMission.tsx` — active mission view
- [ ] Create `src/features/transport/actions.ts` — claimTransport() (calls claim_transport DB fn)
- [ ] Create `src/features/transport/actions.ts` — confirmDelivery()
- [ ] Show precise coordinates only to assigned transporter (via direct cases query)
- [ ] Show safety tips during transport
- [ ] Update case status to IN_TRANSIT on claim, AT_VET on delivery
- [ ] Add notification to reporter when transport is claimed

---

## 9. Vet Portal

- [ ] Create `src/app/(app)/vet/page.tsx` — vet dashboard (protected: verified vet only)
- [ ] Create `src/features/vet/components/VetDashboard.tsx` — pending cases, treatments, stats
- [ ] Create `src/features/vet/components/CaseReview.tsx` — photos, AI summary, transport notes
- [ ] Create `src/features/vet/components/QuoteForm.tsx` — treatment cost, notes, recovery estimate
- [ ] Create `src/features/vet/components/TreatmentUpdate.tsx` — progress updates + photo upload
- [ ] Create `src/features/vet/actions.ts` — submitQuote(), updateTreatment(), completeTreatment()
- [ ] Create `src/features/vet/schemas.ts` — Zod schemas for quote and treatment forms
- [ ] Update case status: AT_VET → QUOTED → FUNDING_OPEN (on quote submit)
- [ ] Update case status: IN_TREATMENT → TREATED (on treatment completion)
- [ ] Escrow release triggers automatically via database trigger

---

## 10. Donation / Escrow

- [ ] Create `src/app/(app)/cases/[id]/donate/page.tsx` — donation page
- [ ] Create `src/features/donation/components/FundingProgress.tsx` — progress bar + stats
- [ ] Create `src/features/donation/components/DonationForm.tsx` — amount input + mock QR
- [ ] Create `src/features/donation/components/DonationHistory.tsx` — donor's own history
- [ ] Create `src/features/donation/actions.ts` — createDonation()
- [ ] Use get_funding_progress() for public display (privacy-safe aggregates)
- [ ] Show mock PromptPay QR code (simulated payment)
- [ ] Prevent donations when funding is not open (check case status)
- [ ] Show escrow status on case detail page
- [ ] Toast notification on successful donation

---

## 11. Foster & Adoption

- [ ] Create `src/app/(app)/adopt/page.tsx` — adoption listings feed
- [ ] Create `src/features/adoption/components/AdoptionCard.tsx` — before/after, personality, status
- [ ] Create `src/features/adoption/components/AdoptionFilters.tsx` — personality, health
- [ ] Create `src/app/(app)/cases/[id]/adopt/page.tsx` — adoption detail + request
- [ ] Create `src/features/foster/components/FosterInfo.tsx` — care instructions, progress
- [ ] Create `src/features/adoption/actions.ts` — requestAdoption(), createAdoptionListing()
- [ ] Create `src/features/foster/actions.ts` — assignFoster(), updateFosterStatus()
- [ ] Update case status: FUNDS_RELEASED → IN_FOSTER → ADOPTED

---

## 12. Admin Dashboard

- [ ] Create `src/app/(app)/admin/page.tsx` — admin dashboard (protected: admin only)
- [ ] Create `src/features/admin/components/PlatformStats.tsx` — users, cases, funding totals
- [ ] Create `src/features/admin/components/VetVerification.tsx` — pending vet approvals
- [ ] Create `src/features/admin/components/CaseModeration.tsx` — case management
- [ ] Create `src/features/admin/components/UserManagement.tsx` — user list, role changes
- [ ] Create `src/features/admin/actions.ts` — verifyVet(), disableUser(), resolveCase()
- [ ] Use Recharts for platform analytics (cases over time, funding totals)

---

## 13. Judge Sandbox

- [ ] Create `src/app/sandbox/page.tsx` — public route (no auth required)
- [ ] Create `src/features/sandbox/components/RoleSwitcher.tsx` — reporter/volunteer/vet/donor/foster/adopter
- [ ] Create `src/features/sandbox/components/LifecycleDemo.tsx` — one-click step-through
- [ ] Pre-load seed data into sandbox view
- [ ] Mock AI responses for sandbox (no API dependency)
- [ ] Ensure sandbox works offline (no external dependencies)
- [ ] Add explanatory tooltips at each lifecycle stage

---

## 14. PWA & Polish

- [ ] Create `public/manifest.json` — app name, icons, theme color
- [ ] Add PWA meta tags to layout
- [ ] Add Framer Motion page transitions (fade + slide)
- [ ] Add card hover animations
- [ ] Add loading skeleton animations (stagger)
- [ ] Responsive testing: 375px, 390px, 430px, tablet, desktop
- [ ] Accessibility audit: focus states, ARIA labels, contrast ratios
- [ ] Remove console.logs, clean up code
- [ ] Final build verification (zero TypeScript/ESLint errors)
- [ ] Test demo flow end-to-end

---

## Dependencies Between Sections

```
Authentication (1)
  └── App Shell (3)
        └── Community Dashboard (4)
        └── Report Rescue (5)
              └── AI Triage (7)
              └── Rescue Feed (6)
                    └── Transport (8)
                          └── Vet Portal (9)
                                └── Donation/Escrow (10)
                                      └── Foster/Adoption (11)
        └── Admin Dashboard (12)

Design System (2) ← parallel with Auth, needed by all UI

Judge Sandbox (13) ← after all features complete
PWA/Polish (14) ← final pass
```
