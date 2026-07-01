# Graph Report - tabbyfund  (2026-07-01)

## Corpus Check
- 205 files · ~588,817 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 822 nodes · 1377 edges · 64 communities (53 shown, 11 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4b9f5360`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Adoption Experience|Adoption Experience]]
- [[_COMMUNITY_Rescue Reporting|Rescue Reporting]]
- [[_COMMUNITY_Donation Flow|Donation Flow]]
- [[_COMMUNITY_Case Detail & Components|Case Detail & Components]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Package Libraries|Package Libraries]]
- [[_COMMUNITY_shadcn Config|shadcn Config]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
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
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 69|Community 69]]
- [[_COMMUNITY_Community 70|Community 70]]

## God Nodes (most connected - your core abstractions)
1. `createClient()` - 62 edges
2. `cn()` - 55 edges
3. `TabbyMascot()` - 23 edges
4. `requireAuth()` - 22 edges
5. `requireRole()` - 19 edges
6. `createServiceClient()` - 18 edges
7. `compilerOptions` - 16 edges
8. `TabbyFund — Implementation Checklist` - 16 edges
9. `getProfile()` - 14 edges
10. `CaseStatus` - 13 edges

## Surprising Connections (you probably didn't know these)
- `AdoptDetailPage()` --calls--> `NotFound()`  [INFERRED]
  src/app/(app)/adopt/[id]/page.tsx → src/app/not-found.tsx
- `DonatePage()` --calls--> `getFundingCases()`  [EXTRACTED]
  src/app/(app)/donate/page.tsx → src/lib/donations.ts
- `RootLayout()` --calls--> `cn()`  [EXTRACTED]
  src/app/layout.tsx → src/lib/utils.ts
- `DropdownMenuCheckboxItem()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/dropdown-menu.tsx → src/lib/utils.ts
- `DropdownMenuRadioItem()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/dropdown-menu.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (64 total, 11 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.16
Nodes (10): CasesPage(), metadata, CaseFilters(), AiSeverity, CaseDetail, CaseStatus, FullCase, getPublicCases() (+2 more)

### Community 1 - "Community 1"
Cohesion: 0.05
Nodes (67): AdminLayout(), FosterPage(), metadata, getProfileStats(), metadata, ProfilePage(), VetLayout(), metadata (+59 more)

### Community 2 - "Community 2"
Cohesion: 0.40
Nodes (5): Tabs(), TabsContent(), TabsList(), tabsListVariants, TabsTrigger()

### Community 3 - "Adoption Experience"
Cohesion: 0.05
Nodes (40): AdoptDetailPage(), AdoptDetailPageProps, generateMetadata(), AdoptPage(), metadata, ALT_MAP, MascotSize, MascotVariant (+32 more)

### Community 4 - "Rescue Reporting"
Cohesion: 0.04
Nodes (47): dependencies, browser-image-compression, class-variance-authority, clsx, date-fns, framer-motion, @google/genai, @hookform/resolvers (+39 more)

### Community 5 - "Donation Flow"
Cohesion: 0.10
Nodes (21): DonatePage(), metadata, FundingCard(), FundingCardProps, DashboardSection(), DashboardSectionProps, AmountSelector(), AmountSelectorProps (+13 more)

### Community 6 - "Case Detail & Components"
Cohesion: 0.08
Nodes (24): CaseDetailPageProps, TransportCardWithClinics(), AdoptionStatusCard(), AdoptionStatusCardProps, CaretakerVolunteerCard(), CaretakerVolunteerCardProps, CaseStickyNav(), navItems (+16 more)

### Community 7 - "Community 7"
Cohesion: 0.25
Nodes (9): CaseDetailPage(), formatLocation(), generateMetadata(), generateMetadata(), VetCaseDetailPage(), VetCaseDetailPageProps, NotFound(), DiagnosisCard() (+1 more)

### Community 8 - "Package Libraries"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 9 - "shadcn Config"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 10 - "Community 10"
Cohesion: 0.15
Nodes (12): adoptionRate, fundingDistribution, treatmentSuccess, volunteerActivity, AnalyticsCard(), AnalyticsCardProps, DataPoint, adminStats (+4 more)

### Community 11 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 13 - "Community 13"
Cohesion: 0.08
Nodes (28): DashboardPage(), metadata, AdoptionPreviewCard(), AdoptionPreviewCardProps, CasePreviewCard(), CasePreviewCardProps, severityConfig, DonationProgressCard() (+20 more)

### Community 14 - "Community 14"
Cohesion: 0.18
Nodes (12): AIRecommendationCard(), AIRecommendationCardProps, getRecommendation(), CaseCard(), CaseCardProps, severityConfig, statusLabels, CaseHero() (+4 more)

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
Cohesion: 0.09
Nodes (25): AppLayout(), metadata, NotificationsPage(), BottomNav(), items, MobileNav(), MobileNavProps, ProfileMenu() (+17 more)

### Community 19 - "Mascot & Branding"
Cohesion: 0.22
Nodes (8): Architecture Decisions Log, Completed Milestones, Current Phase: Application Development, Next Up, Phase 1: Project Foundation ✅, Phase 2: Database Foundation ✅, TabbyFund — Project Progress, Waiting On

### Community 20 - "Dashboard Cards"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 23 - "Community 23"
Cohesion: 0.17
Nodes (17): Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage(), Card(), CardAction() (+9 more)

### Community 24 - "Community 24"
Cohesion: 0.22
Nodes (8): Acceptance Criteria, Acceptance Criteria, Glossary, Introduction, Requirement 1, Requirement 2, Requirements, Requirements Document

### Community 25 - "Community 25"
Cohesion: 0.33
Nodes (5): inter, metadata, poppins, RootLayout(), viewport

### Community 26 - "Community 26"
Cohesion: 0.33
Nodes (5): activeFundraisers, almostFunded, DonationCase, presetAmounts, urgentCases

### Community 32 - "Community 32"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 34 - "Community 34"
Cohesion: 0.19
Nodes (10): NotificationBell(), NotificationBellProps, NotificationPreview, typeIcons, Popover(), PopoverContent(), PopoverDescription(), PopoverHeader() (+2 more)

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

### Community 61 - "Community 61"
Cohesion: 0.22
Nodes (10): getCurrentStepIndex(), JourneyStep, JourneyTracker(), JourneyTrackerProps, steps, events, RescueTimeline(), RescueTimelineProps (+2 more)

### Community 62 - "Community 62"
Cohesion: 0.09
Nodes (28): AdminPage(), metadata, AdminVetsPage(), metadata, metadata, VetCasesPage(), metadata, VetDashboardPage() (+20 more)

### Community 63 - "Community 63"
Cohesion: 0.22
Nodes (8): statusColors, TreatmentTimelineProps, quoteItems, treatmentTimeline, TreatmentUpdate, VetCase, vetCases, vetStats

### Community 64 - "Community 64"
Cohesion: 0.60
Nodes (3): updateSession(), config, proxy()

### Community 65 - "Community 65"
Cohesion: 0.40
Nodes (3): metadata, reports, statusConfig

### Community 67 - "Community 67"
Cohesion: 0.10
Nodes (23): metadata, metadata, metadata, metadata, getRedirectForRole(), login(), register(), requestPasswordReset() (+15 more)

### Community 69 - "Community 69"
Cohesion: 0.08
Nodes (26): metadata, LocationData, LocationPicker(), LocationPickerProps, PhotoUploader(), PhotoUploaderProps, DetailsData, RescueDetailsForm() (+18 more)

### Community 70 - "Community 70"
Cohesion: 0.29
Nodes (6): activeFundraisers, adoptionReady, casesNeedingTransport, dashboardStats, recentNotifications, treatmentUpdates

## Knowledge Gaps
- **326 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+321 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `Community 1` to `Community 0`, `Adoption Experience`, `Community 67`, `Case Detail & Components`, `Community 7`, `Community 13`, `Community 17`, `Community 18`, `Community 62`?**
  _High betweenness centrality (0.106) - this node is a cross-community bridge._
- **Why does `cn()` connect `Community 23` to `Community 34`, `Community 2`, `Auth Actions & Logic`, `Community 17`, `Community 25`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Why does `TabbyMascot()` connect `Adoption Experience` to `Community 1`, `Donation Flow`, `Community 69`, `Community 13`, `Community 18`, `Community 62`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _326 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.05095839177185601 - nodes in this community are weakly interconnected._
- **Should `Adoption Experience` be split into smaller, more focused modules?**
  _Cohesion score 0.0519774011299435 - nodes in this community are weakly interconnected._
- **Should `Rescue Reporting` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._