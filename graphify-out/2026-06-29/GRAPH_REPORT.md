# Graph Report - tabbyfund  (2026-06-29)

## Corpus Check
- 191 files · ~579,001 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 765 nodes · 1201 edges · 67 communities (56 shown, 11 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4b9f5360`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Notifications & Profile|Notifications & Profile]]
- [[_COMMUNITY_Adoption Experience|Adoption Experience]]
- [[_COMMUNITY_Rescue Reporting|Rescue Reporting]]
- [[_COMMUNITY_Donation Flow|Donation Flow]]
- [[_COMMUNITY_Case Detail & Components|Case Detail & Components]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Package Libraries|Package Libraries]]
- [[_COMMUNITY_shadcn Config|shadcn Config]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Auth Actions & Logic|Auth Actions & Logic]]
- [[_COMMUNITY_Case Feed & Cards|Case Feed & Cards]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Mascot & Branding|Mascot & Branding]]
- [[_COMMUNITY_Dashboard Cards|Dashboard Cards]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Adoption Mock Data|Adoption Mock Data]]
- [[_COMMUNITY_Progress & Sheet UI|Progress & Sheet UI]]
- [[_COMMUNITY_Global CSS|Global CSS]]
- [[_COMMUNITY_Design Preview|Design Preview]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 68|Community 68]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 55 edges
2. `createClient()` - 39 edges
3. `TabbyMascot()` - 22 edges
4. `requireAuth()` - 19 edges
5. `requireRole()` - 18 edges
6. `compilerOptions` - 16 edges
7. `TabbyFund — Implementation Checklist` - 16 edges
8. `CaseStatus` - 13 edges
9. `getProfile()` - 12 edges
10. `What You Must Do When Invoked` - 12 edges

## Surprising Connections (you probably didn't know these)
- `AdoptDetailPage()` --calls--> `NotFound()`  [INFERRED]
  src/app/(app)/adopt/[id]/page.tsx → src/app/not-found.tsx
- `CaseDetailPage()` --calls--> `NotFound()`  [INFERRED]
  src/app/(app)/cases/[id]/page.tsx → src/app/not-found.tsx
- `DashboardPage()` --calls--> `getProfile()`  [EXTRACTED]
  src/app/(app)/dashboard/page.tsx → src/lib/supabase/auth-helpers.ts
- `ProfilePage()` --calls--> `getProfile()`  [EXTRACTED]
  src/app/(app)/profile/page.tsx → src/lib/supabase/auth-helpers.ts
- `generateMetadata()` --calls--> `getCaseDetail()`  [EXTRACTED]
  src/app/(app)/vet/cases/[id]/page.tsx → src/lib/cases.ts

## Import Cycles
- None detected.

## Communities (67 total, 11 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.14
Nodes (13): CasesPage(), metadata, CaseCard(), CaseCardProps, severityConfig, statusLabels, CaseFilters(), AiSeverity (+5 more)

### Community 1 - "Community 1"
Cohesion: 0.13
Nodes (10): metadata, ALT_MAP, MascotSize, SIZE_MAP, TabbyMascot(), TabbyMascotProps, SubmitSuccess(), SubmitSuccessProps (+2 more)

### Community 2 - "Notifications & Profile"
Cohesion: 0.15
Nodes (11): metadata, LocationData, LocationPicker(), LocationPickerProps, PhotoUploader(), PhotoUploaderProps, RescueWizard(), steps (+3 more)

### Community 3 - "Adoption Experience"
Cohesion: 0.09
Nodes (24): AdoptDetailPage(), AdoptDetailPageProps, generateMetadata(), AdoptPage(), metadata, AdoptionCard(), AdoptionCardProps, ApplicationCTA() (+16 more)

### Community 4 - "Rescue Reporting"
Cohesion: 0.04
Nodes (47): dependencies, browser-image-compression, class-variance-authority, clsx, date-fns, framer-motion, @google/genai, @hookform/resolvers (+39 more)

### Community 5 - "Donation Flow"
Cohesion: 0.10
Nodes (23): DonatePage(), metadata, Progress(), FundingCard(), FundingCardProps, DonationProgressCard(), DonationProgressCardProps, AmountSelector() (+15 more)

### Community 6 - "Case Detail & Components"
Cohesion: 0.12
Nodes (17): CaseDetailPage(), CaseDetailPageProps, formatLocation(), generateMetadata(), AdoptionStatusCard(), AdoptionStatusCardProps, CaseStickyNav(), navItems (+9 more)

### Community 8 - "Package Libraries"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 9 - "shadcn Config"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 10 - "Community 10"
Cohesion: 0.07
Nodes (34): adoptionRate, fundingDistribution, treatmentSuccess, volunteerActivity, metadata, metadata, VetCasesPage(), metadata (+26 more)

### Community 11 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 12 - "Community 12"
Cohesion: 0.11
Nodes (19): BottomNav(), items, MobileNav(), MobileNavProps, ProfileMenu(), ProfileMenuProps, adminLinks, communityLinks (+11 more)

### Community 13 - "Community 13"
Cohesion: 0.11
Nodes (20): DashboardPage(), metadata, AdoptionPreviewCard(), AdoptionPreviewCardProps, CasePreviewCard(), CasePreviewCardProps, severityConfig, NotificationPreviewCard() (+12 more)

### Community 14 - "Community 14"
Cohesion: 0.38
Nodes (4): tabs, typeIcons, allNotifications, MockNotification

### Community 15 - "Auth Actions & Logic"
Cohesion: 0.16
Nodes (13): adminLinks, communityLinks, vetLinks, Button(), buttonVariants, Sheet(), SheetContent(), SheetDescription() (+5 more)

### Community 16 - "Case Feed & Cards"
Cohesion: 0.12
Nodes (16): 10. Donation / Escrow, 11. Foster & Adoption, 12. Admin Dashboard, 13. Judge Sandbox, 14. PWA & Polish, 1. Authentication, 2. Design System, 3. App Shell (+8 more)

### Community 17 - "Community 17"
Cohesion: 0.13
Nodes (14): Badge(), badgeVariants, DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem() (+6 more)

### Community 18 - "Community 18"
Cohesion: 0.33
Nodes (6): MascotVariant, AIAnalysisPreview(), AIAnalysisPreviewProps, AIResult, getMascotVariant(), mockResult

### Community 19 - "Mascot & Branding"
Cohesion: 0.22
Nodes (8): Architecture Decisions Log, Completed Milestones, Current Phase: Application Development, Next Up, Phase 1: Project Foundation ✅, Phase 2: Database Foundation ✅, TabbyFund — Project Progress, Waiting On

### Community 20 - "Dashboard Cards"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 21 - "Community 21"
Cohesion: 0.47
Nodes (4): ReviewCard(), ReviewCardProps, emptyDraft, RescueDraft

### Community 23 - "Community 23"
Cohesion: 0.15
Nodes (21): Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage(), Card(), CardAction() (+13 more)

### Community 24 - "Community 24"
Cohesion: 0.22
Nodes (8): Acceptance Criteria, Acceptance Criteria, Glossary, Introduction, Requirement 1, Requirement 2, Requirements, Requirements Document

### Community 25 - "Community 25"
Cohesion: 0.33
Nodes (5): inter, metadata, poppins, RootLayout(), viewport

### Community 26 - "Community 26"
Cohesion: 0.33
Nodes (5): activeFundraisers, almostFunded, DonationCase, presetAmounts, urgentCases

### Community 31 - "Community 31"
Cohesion: 0.21
Nodes (11): AIAnalysisCard(), AIAnalysisCardProps, getMascotVariant(), AIRecommendationCard(), AIRecommendationCardProps, getRecommendation(), CaseHero(), CaseHeroProps (+3 more)

### Community 32 - "Community 32"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 33 - "Community 33"
Cohesion: 0.50
Nodes (3): DetailsData, RescueDetailsForm(), RescueDetailsFormProps

### Community 34 - "Community 34"
Cohesion: 0.24
Nodes (8): mockNotifications, NotificationBell(), Popover(), PopoverContent(), PopoverDescription(), PopoverHeader(), PopoverTitle(), PopoverTrigger()

### Community 35 - "Community 35"
Cohesion: 0.40
Nodes (4): CaseStatus, MockCase, mockCases, Severity

### Community 36 - "Community 36"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 37 - "Community 37"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 38 - "Community 38"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 39 - "Community 39"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 40 - "Community 40"
Cohesion: 0.50
Nodes (3): metadata, ProfilePage(), stats

### Community 60 - "Community 60"
Cohesion: 0.20
Nodes (8): generateMetadata(), VetCaseDetailPage(), VetCaseDetailPageProps, NotFound(), DiagnosisCard(), QuoteBuilder(), QuoteBuilderProps, QuoteItem

### Community 61 - "Community 61"
Cohesion: 0.40
Nodes (3): metadata, pendingVets, verifiedVets

### Community 62 - "Community 62"
Cohesion: 0.22
Nodes (10): getCurrentStepIndex(), JourneyStep, JourneyTracker(), JourneyTrackerProps, steps, events, RescueTimeline(), RescueTimelineProps (+2 more)

### Community 63 - "Community 63"
Cohesion: 0.22
Nodes (8): statusColors, TreatmentTimelineProps, quoteItems, treatmentTimeline, TreatmentUpdate, VetCase, vetCases, vetStats

### Community 65 - "Community 65"
Cohesion: 0.40
Nodes (3): metadata, reports, statusConfig

### Community 67 - "Community 67"
Cohesion: 0.11
Nodes (21): metadata, metadata, metadata, metadata, getRedirectForRole(), login(), register(), requestPasswordReset() (+13 more)

### Community 68 - "Community 68"
Cohesion: 0.05
Nodes (52): AdminLayout(), FosterPage(), metadata, AppLayout(), VetLayout(), AuthLayout(), AdoptionActionResult, submitAdoptionApplication() (+44 more)

## Knowledge Gaps
- **304 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+299 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Community 23` to `Community 34`, `Donation Flow`, `Auth Actions & Logic`, `Community 17`, `Community 25`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **Why does `TabbyMascot()` connect `Community 1` to `Notifications & Profile`, `Adoption Experience`, `Community 68`, `Donation Flow`, `Community 40`, `Community 10`, `Community 12`, `Community 13`, `Community 14`, `Community 18`, `Community 60`, `Community 31`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Why does `createClient()` connect `Community 68` to `Community 0`, `Adoption Experience`, `Community 67`, `Donation Flow`, `Case Detail & Components`, `Community 10`, `Community 17`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _304 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.13725490196078433 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.13450292397660818 - nodes in this community are weakly interconnected._
- **Should `Adoption Experience` be split into smaller, more focused modules?**
  _Cohesion score 0.0907563025210084 - nodes in this community are weakly interconnected._