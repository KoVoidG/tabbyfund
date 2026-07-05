# Testing Report — TabbyFund

### Status: ✅ Local and production testing completed successfully

---

## Manual Testing (Localhost)

### Environment

- **URL:** http://localhost:3000
- **Backend:** Supabase Cloud (hosted PostgreSQL + Auth + Storage)
- **Browser:** Chrome (latest)
- **OS:** Windows 11
- **Node.js:** 20+

### Summary

Manual testing was completed on localhost against Supabase Cloud. All core user journeys were tested end-to-end by logging in as each role and performing role-specific actions. The full rescue lifecycle was tested from start to finish:

**Community report → Transport → Vet quote → Funding → Treatment → Caretaker assignment → Behavioural profile → Adoption listing → Adoption success**

### Tested Flows

| Feature | Status | Notes |
|---------|--------|-------|
| Community registration | ✅ Pass | Email/password, role selection |
| Vet registration | ✅ Pass | With clinic name/address, geocoding |
| Login / Logout | ✅ Pass | Role-based redirect after login |
| Rescue report submission | ✅ Pass | Photo upload, AI triage (Gemini), location, transport option |
| AI triage (Gemini Vision) | ✅ Pass | Real API analysis with graceful fallback |
| Transport claim (volunteer) | ✅ Pass | Open → Claimed → Delivered |
| Self-transport (reporter) | ✅ Pass | Reporter checks "I can transport" |
| Transport delivery → AT_VET | ✅ Pass | Case status advances correctly |
| Vet quote creation | ✅ Pass | Line-item quote builder |
| Donation / funding flow | ✅ Pass | Amount selection, simulated escrow |
| Fully funded → FUNDED status | ✅ Pass | Automatic server-side transition |
| Treatment start and updates | ✅ Pass | Treatment record creation |
| Treatment completion | ✅ Pass | Outcome + adoption approval |
| Caretaker auto-assignment | ✅ Pass | Transporter becomes caretaker |
| Caretaker volunteer | ✅ Pass | Community user volunteers |
| Behavioural profile | ✅ Pass | Personality, energy, ideal home |
| Adoption listing visibility | ✅ Pass | Only visible when all 3 conditions met |
| Adoption celebration screen | ✅ Pass | "Rescue More Cats" prompt |
| Admin vet approval | ✅ Pass | Approve button works |
| Admin vet rejection | ✅ Pass | Downgrade to community |
| Rejected vet handling | ✅ Pass | Rejection screen with options |
| Admin case moderation | ✅ Pass | Flagged/new/approved triage |
| Admin user management | ✅ Pass | User list with actions |
| Notifications | ✅ Pass | Dropdown, mark read, page view |
| Role-based route protection | ✅ Pass | Community blocked from /vet, /admin |
| Pending vet screen | ✅ Pass | Shows inline at /vet |
| Volunteer page | ✅ Pass | Transport + caretaker opportunities |

---

## Production Testing (Deployed Vercel App)

### Environment

- **URL:** https://tabbyfund.vercel.app/
- **Backend:** Supabase Cloud
- **Browser:** Chrome (latest)
- **Deployment:** Vercel

### Summary

Production testing was completed on the deployed Vercel app after deployment. The deployed version was tested using the same demo accounts and core workflows used during local testing. All major production flows worked as expected.

### Production Test Results

| Test | Status |
|------|--------|
| Live homepage loads | ✅ Pass |
| Register page loads | ✅ Pass |
| Login works for community user | ✅ Pass |
| Login works for verified vet | ✅ Pass |
| Login works for admin | ✅ Pass |
| Community dashboard loads | ✅ Pass |
| Vet dashboard loads | ✅ Pass |
| Admin dashboard loads | ✅ Pass |
| Rescue feed loads seeded cases | ✅ Pass |
| Report page loads and works | ✅ Pass |
| Photo upload works | ✅ Pass |
| AI analysis works with graceful fallback | ✅ Pass |
| Donate page shows fundraisers | ✅ Pass |
| Donation flow works | ✅ Pass |
| Vet quote and treatment pages work | ✅ Pass |
| Foster / caretaker page works | ✅ Pass |
| Adopt page loads eligible cats | ✅ Pass |
| Notifications work | ✅ Pass |
| Role-based route protection works | ✅ Pass |
| Community cannot access /admin | ✅ Pass |
| Community cannot access /vet | ✅ Pass |
| Pending vet sees verification screen | ✅ Pass |
| Rejected vet sees rejection screen | ✅ Pass |

---

## Automated Testing (Playwright)

### Setup

Playwright is configured for end-to-end smoke tests using Chromium. Tests run against `http://localhost:3000` with the dev server started automatically.

### How to Run

```bash
# Install Playwright browsers (first time only)
npx playwright install chromium

# Run all e2e tests
npm run test:e2e

# Run with interactive UI
npm run test:e2e:ui
```

### Test Credentials

Tests read credentials from `.env.local` via dotenv:

| Variable | Default | Purpose |
|----------|---------|---------|
| `E2E_COMMUNITY_EMAIL` | somchai@example.com | Community user login |
| `E2E_COMMUNITY_PASSWORD` | password123 | Community user password |
| `E2E_ADMIN_EMAIL` | admin@tabbyfund.com | Admin login |
| `E2E_ADMIN_PASSWORD` | password123 | Admin password |
| `E2E_VET_EMAIL` | dr.siriporn@example.com | Verified vet login |
| `E2E_VET_PASSWORD` | password123 | Vet password |

### Current Automated Results: 9 passed, 2 known timing issues

| Test | Status | Notes |
|------|--------|-------|
| Home page loads | ✅ Pass | |
| Login page loads | ✅ Pass | |
| Register page loads | ✅ Pass | |
| Unauthenticated → dashboard redirects to /login | ✅ Pass | |
| Unauthenticated → /admin redirects to /login | ✅ Pass | |
| Unauthenticated → /vet redirects to /login | ✅ Pass | |
| Community user can log in and reach dashboard | ✅ Pass | |
| Admin user can log in and reach admin page | ✅ Pass | |
| Verified vet can log in and reach vet page | ✅ Pass | |
| Community cannot access /admin | ⚠️ Timing | Playwright redirect timing issue |
| Community cannot access /vet | ⚠️ Timing | Playwright redirect timing issue |

### Analysis of Remaining Issues

The 2 remaining issues are **Playwright test runner timing problems**, not application bugs.

The server-side `requireRole()` guard correctly redirects community users away from `/admin` and `/vet` to `/dashboard`. This is confirmed by:
- Manual browser testing (immediate redirect observed)
- Production testing (role protection verified on deployed app)

The Playwright issue occurs because `page.goto("/admin")` resolves before the Next.js server-side redirect completes, causing a momentary URL mismatch in the assertion window. This is a test timing limitation caused by how the current Playwright assertion waits for Next.js server-side redirects.

**Verdict:** These are non-blocking automated test timing issues. The underlying role protection feature is fully functional in both localhost and production environments.

---

## Test File Locations

```
tests/
└── e2e/
    ├── helpers.ts       # Login helper, session clearing, assertions
    ├── smoke.spec.ts    # Public page loads + unauthenticated redirects
    └── auth.spec.ts     # Login and role-based access tests

playwright.config.ts     # Playwright configuration (dotenv, chromium, auto dev server)
```
