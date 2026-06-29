\# TABBYFUND MASTER PROMPT

\## Part 2 — Technology Stack, Architecture \& Development Standards



\# Primary Goal



Build a modern, scalable, clean, mobile-first Progressive Web Application while keeping the implementation simple enough for a solo developer to complete within 14 days.



Every technology decision has already been made.



Do not recommend alternative frameworks unless explicitly requested.



\---



\# Tech Stack



\## Framework



Next.js (latest stable version)



Requirements:



\- App Router

\- React Server Components

\- Server Actions

\- Route Handlers

\- TypeScript

\- PWA support



Never use the Pages Router.



\---



\## Language



TypeScript



Requirements:



\- Strict Mode enabled

\- Avoid using "any"

\- Prefer explicit typing

\- Infer types only when readability is improved



Every function should have meaningful types.



\---



\## Styling



Tailwind CSS



Guidelines:



\- Mobile first

\- Utility-first styling

\- Responsive design

\- Avoid inline styles

\- Avoid custom CSS unless necessary

\- Use CSS variables for theme colors



\---



\## UI Components



shadcn/ui



Always prefer existing shadcn components before creating custom ones.



When customization is required:



Extend existing components instead of rewriting them.



\---



\## Icons



Lucide React



Use consistent icon sizing throughout the application.



Avoid mixing icon libraries.



\---



\## Forms



React Hook Form



Validation:



Zod



Every form should have:



\- validation

\- loading state

\- success state

\- error state



Never submit invalid data.



\---



\## Database



Supabase PostgreSQL



Supabase manages:



\- Database

\- Authentication

\- Storage

\- Realtime (if required)



Do not introduce Prisma.



Use the official Supabase TypeScript client.



\---



\## Authentication



Supabase Auth



Authentication methods:



Email + Password



Google OAuth (future feature)



Role system:



Community



Vet



Admin



Authorization should always be server-side.



Never trust client roles.



\---



\## Storage



Supabase Storage



Store:



Cat photos



Treatment photos



Adoption photos



Never store images directly inside the database.



Only store URLs.



\---



\## AI



Google Gemini



Use the latest Gemini Flash model available.



The AI should ONLY:



\- classify visible condition

\- estimate severity

\- suggest basic first aid

\- explain why it assigned the severity



The AI must never:



Diagnose diseases



Guarantee medical conditions



Replace veterinary advice



All AI calls happen server-side.



Never expose API keys.



\---



\## Maps



Leaflet



OpenStreetMap



Requirements:



Interactive map



Drop pin



Nearby rescue location



Fuzzed coordinates



Mobile friendly



Avoid paid APIs unless absolutely necessary.



\---



\## Charts



Recharts



Used only inside dashboards.



Keep charts simple.



Avoid excessive analytics.



\---



\## Hosting



Frontend:



Vercel



Backend:



Next.js



Database:



Supabase



Storage:



Supabase



No separate backend server.



\---



\# Overall Architecture



Architecture style:



Feature-first architecture.



Instead of grouping by file type:



❌ Components



❌ Hooks



❌ Pages



Prefer grouping by feature.



Example:



features/



report/



vet/



transport/



donation/



dashboard/



adoption/



admin/



Each feature owns:



components



actions



hooks



types



validation



utilities



\---



\# Suggested Folder Structure



app/



components/



features/



lib/



hooks/



types/



constants/



schemas/



services/



utils/



public/



styles/



supabase/



\---



\# Folder Responsibilities



app/



Contains routing only.



Do not place business logic here.



\---



features/



Contains complete feature implementations.



Every major feature should be isolated.



\---



components/



Reusable UI components shared across multiple features.



Examples:



Button



Card



Badge



Dialog



Navbar



BottomNavigation



ProgressBar



\---



lib/



Global libraries.



Examples:



supabase



auth



ai



maps



\---



services/



Business services.



Examples:



DonationService



ReportService



VetService



NotificationService



\---



schemas/



All Zod validation schemas.



Never duplicate validation.



\---



types/



Shared TypeScript interfaces.



Enums.



DTOs.



Database types.



\---



utils/



Pure helper functions.



Must not depend on React.



\---



constants/



Application constants.



Status values.



Role values.



Configuration.



Labels.



\---



hooks/



Reusable React hooks.



Only create hooks when logic is reused.



Avoid unnecessary abstraction.



\---



\# Server Components



Default:



Server Component.



Only create Client Components when:



Using state



Using effects



Browser APIs



Animations



Maps



Forms



Interactive UI



Always prefer server rendering.



\---



\# State Management



Do not introduce global state until necessary.



Use:



Server Components



Props



Context



Only introduce Zustand if prop drilling becomes excessive.



\---



\# Routing Rules



Every route should have:



loading.tsx



error.tsx



not-found.tsx (when appropriate)



Use nested layouts whenever beneficial.



\---



\# Naming Convention



Components:



PascalCase



Example:



ReportCard.tsx



VetDashboard.tsx



\---



Hooks



camelCase



Example:



useCases()



useDonation()



\---



Utilities



camelCase



Example:



formatCurrency()



calculateSeverity()



\---



Constants



UPPER\_SNAKE\_CASE



\---



Types



PascalCase



\---



Files



Prefer descriptive names.



Avoid abbreviations.



\---



\# Import Rules



Prefer absolute imports.



Avoid deeply nested relative imports.



Organize imports:



1 External packages



2 Internal libraries



3 Components



4 Types



5 Styles



\---



\# Error Handling



Every asynchronous action should handle:



Loading



Success



Failure



Unexpected errors



Never silently fail.



Always provide meaningful messages.



\---



\# Logging



Console logs are acceptable during development.



Remove debugging logs before final deployment.



Never expose sensitive information.



\---



\# Code Organization



Keep components focused.



If a component exceeds roughly 250–300 lines, consider splitting it into smaller components.



Avoid massive files.



\---



\# Dependency Rules



Before adding any new package, ask:



Can the existing stack already solve this?



Avoid dependency bloat.



\---



\# Git Philosophy



Write clean commits.



One feature per commit.



Keep commits small.



Avoid committing broken code.



\---



\# Development Philosophy



Every feature should feel complete.



Incomplete means:



Missing loading state



Missing validation



Missing error handling



Missing responsiveness



Missing accessibility



A feature is only complete when users can confidently use it from beginning to end.



\---



\# AI Collaboration Rules



When generating code:



Think before writing.



Explain the architecture briefly.



Then generate the code.



Keep files organized.



Reuse existing components.



Never duplicate business logic.



Always consider future maintainability.



If uncertain, choose the simpler implementation suitable for a 14-day MVP.

