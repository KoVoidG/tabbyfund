# Graph Report - tabbyfund  (2026-06-29)

## Corpus Check
- 178 files · ~561,845 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 698 nodes · 1031 edges · 64 communities (55 shown, 9 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `369c3a65`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Admin & Dashboard Pages|Admin & Dashboard Pages]]
- [[_COMMUNITY_Vet Portal|Vet Portal]]
- [[_COMMUNITY_Notifications & Profile|Notifications & Profile]]
- [[_COMMUNITY_Adoption Experience|Adoption Experience]]
- [[_COMMUNITY_Rescue Reporting|Rescue Reporting]]
- [[_COMMUNITY_Donation Flow|Donation Flow]]
- [[_COMMUNITY_Case Detail & Components|Case Detail & Components]]
- [[_COMMUNITY_Package Dependencies|Package Dependencies]]
- [[_COMMUNITY_Package Libraries|Package Libraries]]
- [[_COMMUNITY_shadcn Config|shadcn Config]]
- [[_COMMUNITY_Shell UI Components|Shell UI Components]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_Sidebar & Navigation|Sidebar & Navigation]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Auth Pages|Auth Pages]]
- [[_COMMUNITY_Auth Actions & Logic|Auth Actions & Logic]]
- [[_COMMUNITY_Case Feed & Cards|Case Feed & Cards]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Database Schema|Database Schema]]
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
- [[_COMMUNITY_Admin Mock Data|Admin Mock Data]]
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
- [[_COMMUNITY_Community 65|Community 65]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 55 edges
2. `TabbyMascot()` - 22 edges
3. `compilerOptions` - 16 edges
4. `TabbyFund — Implementation Checklist` - 16 edges
5. `getProfile()` - 12 edges
6. `What You Must Do When Invoked` - 12 edges
7. `UserProfile` - 11 edges
8. `CaseStatus` - 11 edges
9. `createClient()` - 10 edges
10. `/graphify` - 10 edges

## Surprising Connections (you probably didn't know these)
- `DashboardPage()` --calls--> `getProfile()`  [EXTRACTED]
  src/app/(app)/dashboard/page.tsx → src/lib/supabase/auth-helpers.ts
- `RootLayout()` --calls--> `cn()`  [EXTRACTED]
  src/app/layout.tsx → src/lib/utils.ts
- `DropdownMenuCheckboxItem()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/dropdown-menu.tsx → src/lib/utils.ts
- `DropdownMenuRadioItem()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/dropdown-menu.tsx → src/lib/utils.ts
- `DropdownMenuLabel()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/dropdown-menu.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (64 total, 9 thin omitted)

### Community 0 - "Admin & Dashboard Pages"
Cohesion: 0.11
Nodes (19): adoptionRate, fundingDistribution, treatmentSuccess, volunteerActivity, metadata, AdminStatCard(), AdminStatCardProps, AnalyticsCard() (+11 more)

### Community 1 - "Vet Portal"
Cohesion: 0.08
Nodes (25): statusMap, VetCaseDetailPageProps, metadata, metadata, QuickActionCard(), QuickActionCardProps, CompletionCard(), DiagnosisCard() (+17 more)

### Community 2 - "Notifications & Profile"
Cohesion: 0.13
Nodes (11): AdoptDetailPage(), CaseDetailPage(), VetCaseDetailPage(), metadata, NotFound(), ALT_MAP, MascotSize, SIZE_MAP (+3 more)

### Community 3 - "Adoption Experience"
Cohesion: 0.08
Nodes (22): AdoptDetailPageProps, metadata, AdoptionCard(), AdoptionCardProps, ApplicationCTA(), ApplicationCTAProps, BehaviouralSummaryCard(), BehaviouralSummaryCardProps (+14 more)

### Community 4 - "Rescue Reporting"
Cohesion: 0.04
Nodes (47): dependencies, browser-image-compression, class-variance-authority, clsx, date-fns, framer-motion, @google/genai, @hookform/resolvers (+39 more)

### Community 5 - "Donation Flow"
Cohesion: 0.12
Nodes (20): metadata, FundingCard(), FundingCardProps, AmountSelector(), AmountSelectorProps, DonationCaseCard(), DonationCaseCardProps, severityConfig (+12 more)

### Community 6 - "Case Detail & Components"
Cohesion: 0.05
Nodes (43): CaseDetailPageProps, metadata, AdoptionStatusCard(), AdoptionStatusCardProps, AIAnalysisCardProps, AIRecommendationCard(), AIRecommendationCardProps, getRecommendation() (+35 more)

### Community 7 - "Package Dependencies"
Cohesion: 0.19
Nodes (8): metadata, metadata, ForgotPasswordForm(), LoginForm(), ForgotPasswordInput, forgotPasswordSchema, LoginInput, loginSchema

### Community 8 - "Package Libraries"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 9 - "shadcn Config"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 10 - "Shell UI Components"
Cohesion: 0.14
Nodes (13): Badge(), badgeVariants, DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem() (+5 more)

### Community 11 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 12 - "Sidebar & Navigation"
Cohesion: 0.11
Nodes (19): BottomNav(), items, MobileNavProps, NotificationBell(), ProfileMenu(), ProfileMenuProps, adminLinks, communityLinks (+11 more)

### Community 13 - "Community 13"
Cohesion: 0.09
Nodes (22): DashboardPage(), metadata, AdoptionPreviewCard(), AdoptionPreviewCardProps, CasePreviewCard(), CasePreviewCardProps, severityConfig, DonationProgressCard() (+14 more)

### Community 14 - "Auth Pages"
Cohesion: 0.20
Nodes (7): Progress(), Separator(), Tabs(), TabsContent(), TabsList(), tabsListVariants, TabsTrigger()

### Community 15 - "Auth Actions & Logic"
Cohesion: 0.20
Nodes (15): Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage(), Card(), CardAction() (+7 more)

### Community 16 - "Case Feed & Cards"
Cohesion: 0.12
Nodes (16): 10. Donation / Escrow, 11. Foster & Adoption, 12. Admin Dashboard, 13. Judge Sandbox, 14. PWA & Polish, 1. Authentication, 2. Design System, 3. App Shell (+8 more)

### Community 17 - "Community 17"
Cohesion: 0.15
Nodes (13): adminLinks, communityLinks, vetLinks, Button(), buttonVariants, Sheet(), SheetContent(), SheetDescription() (+5 more)

### Community 18 - "Database Schema"
Cohesion: 0.23
Nodes (4): updateSession(), config, proxy(), Database

### Community 19 - "Mascot & Branding"
Cohesion: 0.22
Nodes (8): Architecture Decisions Log, Completed Milestones, Current Phase: Application Development, Next Up, Phase 1: Project Foundation ✅, Phase 2: Database Foundation ✅, TabbyFund — Project Progress, Waiting On

### Community 20 - "Dashboard Cards"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 21 - "Community 21"
Cohesion: 0.23
Nodes (11): metadata, getRedirectForRole(), login(), logout(), register(), requestPasswordReset(), updatePassword(), RegisterForm() (+3 more)

### Community 22 - "Community 22"
Cohesion: 0.24
Nodes (8): MascotVariant, AIAnalysisCard(), getMascotVariant(), AIAnalysisPreview(), AIAnalysisPreviewProps, AIResult, getMascotVariant(), mockResult

### Community 23 - "Community 23"
Cohesion: 0.33
Nodes (5): inter, metadata, poppins, RootLayout(), viewport

### Community 24 - "Community 24"
Cohesion: 0.22
Nodes (8): Acceptance Criteria, Acceptance Criteria, Glossary, Introduction, Requirement 1, Requirement 2, Requirements, Requirements Document

### Community 25 - "Community 25"
Cohesion: 0.27
Nodes (7): mockNotifications, Popover(), PopoverContent(), PopoverDescription(), PopoverHeader(), PopoverTitle(), PopoverTrigger()

### Community 26 - "Community 26"
Cohesion: 0.29
Nodes (5): mockFosterCats, tabs, BehaviouralProfileForm(), energyOptions, personalityOptions

### Community 31 - "Admin Mock Data"
Cohesion: 0.21
Nodes (9): metadata, PhotoUploader(), PhotoUploaderProps, RescueWizard(), ReviewCard(), ReviewCardProps, emptyDraft, RescueDraft (+1 more)

### Community 32 - "Community 32"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 33 - "Community 33"
Cohesion: 0.23
Nodes (11): AdminLayout(), AppLayout(), metadata, ProfilePage(), stats, VetLayout(), AuthLayout(), getProfile() (+3 more)

### Community 34 - "Community 34"
Cohesion: 0.38
Nodes (4): tabs, typeIcons, allNotifications, MockNotification

### Community 35 - "Community 35"
Cohesion: 0.33
Nodes (4): metadata, ResetPasswordForm(), ResetPasswordInput, resetPasswordSchema

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
Nodes (3): LocationData, LocationPicker(), LocationPickerProps

### Community 60 - "Community 60"
Cohesion: 0.50
Nodes (3): DetailsData, RescueDetailsForm(), RescueDetailsFormProps

### Community 61 - "Community 61"
Cohesion: 0.40
Nodes (3): metadata, pendingVets, verifiedVets

### Community 62 - "Community 62"
Cohesion: 0.50
Nodes (3): steps, WizardProgress(), WizardProgressProps

### Community 65 - "Community 65"
Cohesion: 0.40
Nodes (3): metadata, reports, statusConfig

## Knowledge Gaps
- **267 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+262 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `TabbyMascot()` connect `Notifications & Profile` to `Admin & Dashboard Pages`, `Community 33`, `Community 34`, `Adoption Experience`, `Vet Portal`, `Donation Flow`, `Sidebar & Navigation`, `Community 13`, `Community 22`, `Community 26`, `Admin Mock Data`?**
  _High betweenness centrality (0.131) - this node is a cross-community bridge._
- **Why does `cn()` connect `Auth Actions & Logic` to `Shell UI Components`, `Auth Pages`, `Community 17`, `Community 23`, `Community 25`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **Why does `Progress()` connect `Auth Pages` to `Community 13`, `Donation Flow`, `Case Detail & Components`, `Auth Actions & Logic`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _267 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Admin & Dashboard Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.10582010582010581 - nodes in this community are weakly interconnected._
- **Should `Vet Portal` be split into smaller, more focused modules?**
  _Cohesion score 0.07827260458839407 - nodes in this community are weakly interconnected._
- **Should `Notifications & Profile` be split into smaller, more focused modules?**
  _Cohesion score 0.12631578947368421 - nodes in this community are weakly interconnected._