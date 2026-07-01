# Graph Report - tabbyfund  (2026-06-30)

## Corpus Check
- 196 files · ~580,369 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 794 nodes · 1286 edges · 76 communities (65 shown, 11 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.8)
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
- [[_COMMUNITY_Community 22|Community 22]]
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
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 68|Community 68]]
- [[_COMMUNITY_Community 69|Community 69]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 71|Community 71]]
- [[_COMMUNITY_Community 72|Community 72]]
- [[_COMMUNITY_Community 73|Community 73]]
- [[_COMMUNITY_Community 74|Community 74]]
- [[_COMMUNITY_Community 75|Community 75]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 55 edges
2. `createClient()` - 54 edges
3. `TabbyMascot()` - 22 edges
4. `requireRole()` - 21 edges
5. `requireAuth()` - 20 edges
6. `compilerOptions` - 16 edges
7. `TabbyFund — Implementation Checklist` - 16 edges
8. `CaseStatus` - 13 edges
9. `getProfile()` - 12 edges
10. `What You Must Do When Invoked` - 12 edges

## Surprising Connections (you probably didn't know these)
- `AdoptDetailPage()` --calls--> `NotFound()`  [INFERRED]
  src/app/(app)/adopt/[id]/page.tsx → src/app/not-found.tsx
- `ProfilePage()` --calls--> `getProfile()`  [EXTRACTED]
  src/app/(app)/profile/page.tsx → src/lib/supabase/auth-helpers.ts
- `RootLayout()` --calls--> `cn()`  [EXTRACTED]
  src/app/layout.tsx → src/lib/utils.ts
- `DropdownMenuCheckboxItem()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/dropdown-menu.tsx → src/lib/utils.ts
- `DropdownMenuRadioItem()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/dropdown-menu.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (76 total, 11 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.20
Nodes (5): AiSeverity, CaseDetail, CaseStatus, FullCase, PublicCase

### Community 1 - "Community 1"
Cohesion: 0.13
Nodes (18): AdminLayout(), VetLayout(), AuthLayout(), AdminActionResult, rejectVet(), verifyVet(), CompleteTreatmentInput, CreateTreatmentInput (+10 more)

### Community 2 - "Community 2"
Cohesion: 0.24
Nodes (8): FosterPage(), metadata, BehaviouralProfileForm(), BehaviouralProfileFormProps, energyOptions, personalityOptions, FosterCaseRow, getMyFosterCases()

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
Cohesion: 0.13
Nodes (13): CaseDetailPageProps, AdoptionStatusCard(), AdoptionStatusCardProps, CaseStickyNav(), navItems, FadeIn(), FadeInProps, FosterCard() (+5 more)

### Community 7 - "Community 7"
Cohesion: 0.50
Nodes (3): CasePreviewCard(), CasePreviewCardProps, severityConfig

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

### Community 12 - "Community 12"
Cohesion: 0.08
Nodes (28): AppLayout(), metadata, NotificationsPage(), BottomNav(), items, MobileNav(), MobileNavProps, ProfileMenu() (+20 more)

### Community 13 - "Community 13"
Cohesion: 0.14
Nodes (22): DashboardPage(), metadata, AdoptionPreviewCard(), AdoptionPreviewCardProps, NotificationPreviewCard(), NotificationPreviewCardProps, StatCard(), StatCardProps (+14 more)

### Community 14 - "Community 14"
Cohesion: 0.17
Nodes (10): metadata, PhotoUploader(), PhotoUploaderProps, RescueWizard(), SubmitSuccess(), SubmitSuccessProps, steps, WizardProgress() (+2 more)

### Community 15 - "Auth Actions & Logic"
Cohesion: 0.16
Nodes (13): adminLinks, communityLinks, vetLinks, Button(), buttonVariants, Sheet(), SheetContent(), SheetDescription() (+5 more)

### Community 16 - "Case Feed & Cards"
Cohesion: 0.12
Nodes (16): 10. Donation / Escrow, 11. Foster & Adoption, 12. Admin Dashboard, 13. Judge Sandbox, 14. PWA & Polish, 1. Authentication, 2. Design System, 3. App Shell (+8 more)

### Community 17 - "Community 17"
Cohesion: 0.14
Nodes (13): Badge(), badgeVariants, DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem() (+5 more)

### Community 18 - "Community 18"
Cohesion: 0.16
Nodes (15): CaretakerVolunteerCard(), CaretakerVolunteerCardProps, DonationActionResult, submitDonation(), FosterActionResult, startFoster(), StartFosterInput, updateBehaviouralProfile() (+7 more)

### Community 19 - "Mascot & Branding"
Cohesion: 0.22
Nodes (8): Architecture Decisions Log, Completed Milestones, Current Phase: Application Development, Next Up, Phase 1: Project Foundation ✅, Phase 2: Database Foundation ✅, TabbyFund — Project Progress, Waiting On

### Community 20 - "Dashboard Cards"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 22 - "Community 22"
Cohesion: 0.27
Nodes (8): AIRecommendationCard(), AIRecommendationCardProps, getRecommendation(), CaseHero(), CaseHeroProps, severityConfig, statusLabels, Severity

### Community 23 - "Community 23"
Cohesion: 0.17
Nodes (19): Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage(), Card(), CardAction() (+11 more)

### Community 24 - "Community 24"
Cohesion: 0.22
Nodes (8): Acceptance Criteria, Acceptance Criteria, Glossary, Introduction, Requirement 1, Requirement 2, Requirements, Requirements Document

### Community 25 - "Community 25"
Cohesion: 0.18
Nodes (7): inter, metadata, poppins, RootLayout(), viewport, Separator(), Skeleton()

### Community 26 - "Community 26"
Cohesion: 0.33
Nodes (5): activeFundraisers, almostFunded, DonationCase, presetAmounts, urgentCases

### Community 31 - "Community 31"
Cohesion: 0.08
Nodes (30): AdminPage(), metadata, AdminVetsPage(), metadata, metadata, VetCasesPage(), metadata, VetDashboardPage() (+22 more)

### Community 32 - "Community 32"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

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
Cohesion: 0.15
Nodes (8): metadata, ALT_MAP, MascotSize, SIZE_MAP, TabbyMascot(), TabbyMascotProps, CompletionCard(), CompletionCardProps

### Community 60 - "Community 60"
Cohesion: 0.36
Nodes (3): updateSession(), config, proxy()

### Community 61 - "Community 61"
Cohesion: 0.22
Nodes (10): getCurrentStepIndex(), JourneyStep, JourneyTracker(), JourneyTrackerProps, steps, events, RescueTimeline(), RescueTimelineProps (+2 more)

### Community 62 - "Community 62"
Cohesion: 0.32
Nodes (6): statusConfig, TransportCard(), TransportCardProps, claimTransport(), deliverTransport(), TransportActionResult

### Community 63 - "Community 63"
Cohesion: 0.22
Nodes (8): statusColors, TreatmentTimelineProps, quoteItems, treatmentTimeline, TreatmentUpdate, VetCase, vetCases, vetStats

### Community 64 - "Community 64"
Cohesion: 0.39
Nodes (7): buildDescription(), dataUrlToBlob(), getExtensionFromMime(), normalizeSeverity(), SubmitReportInput, SubmitReportResult, submitRescueReport()

### Community 65 - "Community 65"
Cohesion: 0.40
Nodes (3): metadata, reports, statusConfig

### Community 66 - "Community 66"
Cohesion: 0.23
Nodes (10): CaseDetailPage(), formatLocation(), generateMetadata(), generateMetadata(), VetCaseDetailPage(), VetCaseDetailPageProps, NotFound(), DiagnosisCard() (+2 more)

### Community 67 - "Community 67"
Cohesion: 0.10
Nodes (22): metadata, metadata, metadata, metadata, getRedirectForRole(), login(), logout(), register() (+14 more)

### Community 68 - "Community 68"
Cohesion: 0.21
Nodes (8): CasesPage(), metadata, CaseCard(), CaseCardProps, severityConfig, statusLabels, CaseFilters(), getPublicCases()

### Community 69 - "Community 69"
Cohesion: 0.22
Nodes (9): MascotVariant, AIAnalysisCard(), AIAnalysisCardProps, getMascotVariant(), AIAnalysisPreview(), AIAnalysisPreviewProps, AIResult, getMascotVariant() (+1 more)

### Community 70 - "Community 70"
Cohesion: 0.29
Nodes (6): activeFundraisers, adoptionReady, casesNeedingTransport, dashboardStats, recentNotifications, treatmentUpdates

### Community 71 - "Community 71"
Cohesion: 0.47
Nodes (4): ReviewCard(), ReviewCardProps, emptyDraft, RescueDraft

### Community 72 - "Community 72"
Cohesion: 0.50
Nodes (3): metadata, ProfilePage(), stats

### Community 73 - "Community 73"
Cohesion: 0.50
Nodes (3): outcomeConfig, TreatmentUpdateCard(), TreatmentUpdateCardProps

### Community 74 - "Community 74"
Cohesion: 0.50
Nodes (3): LocationData, LocationPicker(), LocationPickerProps

### Community 75 - "Community 75"
Cohesion: 0.50
Nodes (3): DetailsData, RescueDetailsForm(), RescueDetailsFormProps

## Knowledge Gaps
- **319 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+314 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `Community 13` to `Community 64`, `Community 1`, `Community 0`, `Community 67`, `Adoption Experience`, `Community 66`, `Community 68`, `Donation Flow`, `Community 2`, `Community 12`, `Community 18`, `Community 60`, `Community 62`, `Community 31`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **Why does `cn()` connect `Community 23` to `Community 34`, `Donation Flow`, `Auth Actions & Logic`, `Community 17`, `Community 25`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Why does `TabbyMascot()` connect `Community 40` to `Community 2`, `Adoption Experience`, `Donation Flow`, `Community 69`, `Community 72`, `Community 12`, `Community 13`, `Community 14`, `Community 31`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _319 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.12666666666666668 - nodes in this community are weakly interconnected._
- **Should `Adoption Experience` be split into smaller, more focused modules?**
  _Cohesion score 0.0907563025210084 - nodes in this community are weakly interconnected._
- **Should `Rescue Reporting` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._