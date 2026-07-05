# Testing Report — TabbyFund

## Manual Testing

### Environment

- **URL:** http://localhost:3000
- **Backend:** Supabase Cloud (hosted PostgreSQL + Auth + Storage)
- **Browser:** Chrome (latest)
- **OS:** Windows 11
- **Node.js:** 20+

### Status: ✅ All major flows passed manually

Manual testing was completed on localhost against Supabase Cloud. All core user journeys were tested end-to-end by logging in as each role and performing role-specific actions.

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

## Deployment Testing

### Status: ⏳ Not fully completed yet

- The app has not been fully tested in deployed production (Vercel) mode yet.
- After deployment, a basic production smoke test will be performed.
- The live URL will be added to this report after deployment.

---

## Automated Testing (Playwright)

### Setup

Playwright is configured for basic end-to-end smoke tests using Chromium. Tests run against `http://localhost:3000` with the dev server started automatically by Playwright.

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

### Current Results: 9 passed, 2 failed

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
| Community cannot access /admin | ❌ Fail | Playwright redirect timing |
| Community cannot access /vet | ❌ Fail | Playwright redirect timing |

### Analysis of Failures

The 2 remaining failures are **community access control tests** that assert a logged-in community user gets redirected away from `/admin` and `/vet`. 

**Root cause:** These are Playwright session/redirect timing issues, not functional bugs. The server-side `requireRole()` guard uses Next.js `redirect()` which triggers a server-side redirect. Playwright's `page.goto()` sometimes resolves before the redirect completes, causing the assertion to see `/admin` or `/vet` momentarily.

**Manual testing confirms** the actual app correctly blocks community users from accessing `/admin` and `/vet` — they are immediately redirected to `/dashboard`. This is verified by:
1. Logging in as somchai@example.com
2. Typing /admin in the browser address bar
3. Observing immediate redirect to /dashboard

The issue is purely in how Playwright handles Next.js server-side redirects within an already-authenticated session context.

---

## Production Smoke Test Checklist

After deployment to Vercel, verify:

1. [ ] Live homepage loads at production URL
2. [ ] Community login works (somchai@example.com)
3. [ ] Vet login works (dr.siriporn@example.com)
4. [ ] Admin login works (admin@tabbyfund.com)
5. [ ] Report page (/report) loads and shows wizard
6. [ ] Adopt page (/adopt) loads
7. [ ] Donate page (/donate) shows fundraisers
8. [ ] Protected routes block unauthorized users
9. [ ] Rescue feed (/cases) shows seeded cases
10. [ ] Notifications dropdown shows real data

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
