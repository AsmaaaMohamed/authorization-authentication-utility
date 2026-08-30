# MERN Team Engineering Playbook

A practical rulebook for running production MERN (MongoDB, Express, React, Node) projects: task assignment, git workflow, code structure, comments, and documentation.

---

## 1. Task Assignment & Workflow

### 1.1 Task Lifecycle
Every task moves through fixed states — don't let people skip steps:

```
Backlog → Ready → In Progress → In Review → QA/Staging → Done
```

- **Backlog**: raw idea, not yet estimated.
- **Ready**: has acceptance criteria, is estimated, and is unblocked. Only "Ready" tasks can be picked up.
- 
- **In Progress**: one owner, one branch. No task in progress without a branch open.
- **In Review**: PR open, linked to the ticket.
- **QA/Staging**: deployed to a non-prod environment and verified against acceptance criteria.
- **Done**: merged to main, deployed, ticket closed with a one-line summary of what shipped.

### 1.2 Ticket Template
Enforce this in Jira/Linear/GitHub Projects — reject tickets that don't have it:

```
Title: [MODULE] Short imperative description
  e.g. [AUTH] Add refresh-token rotation on login

Description: What & why (1-3 sentences)

Acceptance Criteria:
- [ ] Criterion 1
- [ ] Criterion 2

Technical Notes: endpoints touched, schema changes, breaking changes
Estimate: S / M / L (or story points)
Labels: frontend | backend | db | devops | bug | feature
```

### 1.3 Role Split Convention
For each feature, split tasks explicitly rather than assigning "build feature X" to one person:

| Layer | Owns |
|---|---|
| DB/Schema | Mongoose models, indexes, migrations |
| Backend | Controllers, services, routes, validation |
| Frontend | Components, state, API integration |
| QA/Review | Cross-checks against acceptance criteria |

One person can wear multiple hats on small teams, but the tasks themselves stay separated in tickets so progress is trackable.

### 1.4 Definition of Ready (before work starts)
- Acceptance criteria written
- Dependencies identified (API contract agreed between FE/BE if applicable)
- Estimated

### 1.5 Definition of Done (before ticket closes)
- Code merged to main via PR (never direct push)
- Tests written and passing
- Lint/format passes in CI
- Documentation updated (README/API docs if behavior changed)
- Deployed to staging and manually verified

---

## 2. Git & Branching

### 2.1 Branch Naming
```
<type>/<ticket-id>-<short-description>

feature/AUTH-102-refresh-token-rotation
fix/CART-45-price-rounding-bug
chore/BE-12-upgrade-mongoose
```
Types: `feature`, `fix`, `chore`, `hotfix`, `refactor`, `docs`.

### 2.2 Branching Model
Use **trunk-based with short-lived feature branches**:
- `main` — always deployable
- `develop` (optional, only if you need a staging gate) — integration branch
- Feature branches off `develop`/`main`, merged via PR within 2-3 days max

Avoid long-lived branches; they rot and create painful merges.

### 2.3 Commit Messages — Conventional Commits
```
<type>(<scope>): <short summary>

feat(auth): add refresh token rotation
fix(cart): correct rounding on discounted totals
docs(readme): update setup instructions
refactor(api): extract validation into middleware
chore(deps): bump mongoose to 8.x
```
Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`.

This enables auto-generated changelogs later (e.g. via `standard-version` or `semantic-release`).

### 2.4 Pull Request Rules
- PR title mirrors the ticket title
- PR description must include: what changed, why, how to test, linked ticket
- Minimum **1 approval** required before merge (2 for auth/payment/data-model changes)
- No self-merging on critical modules
- Squash-merge to keep `main` history clean

**PR Template** (`.github/PULL_REQUEST_TEMPLATE.md`):
```markdown
## What
Brief description of the change.

## Why
Link to ticket: JIRA-123

## How to test
1. Step one
2. Step two

## Screenshots (if UI change)

## Checklist
- [ ] Tests added/updated
- [ ] Docs updated
- [ ] No console.logs or commented-out code left in
```

---

## 3. Project Structure

### Backend (Node/Express)
```
server/
├── src/
│   ├── config/          # db, env, third-party configs
│   ├── models/          # Mongoose schemas
│   ├── routes/          # route definitions only
│   ├── controllers/     # request/response handling
│   ├── services/        # business logic, reusable across controllers
│   ├── middlewares/     # auth, validation, error handling
│   ├── utils/           # pure helper functions
│   └── app.js
├── tests/
└── server.js
```
Rule: **routes stay thin** (map path → controller), **controllers stay thin** (parse request, call service, send response), **business logic lives in services**.

### Frontend (React)
```
client/
├── src/
│   ├── components/      # dumb/reusable UI components
│   ├── features/        # feature-based modules (Redux slices, hooks, pages)
│   ├── pages/           # route-level components
│   ├── hooks/           # custom hooks
│   ├── services/        # API call functions (axios instances)
│   ├── context/ or store/  # global state
│   ├── utils/
│   └── App.jsx
```
Prefer **feature-based folders** over type-based (`components/`, `reducers/`, `pages/` scattered) once the app grows past a handful of screens.

---

## 4. Coding Standards

### Naming
- Files: `camelCase.js` for utils/services, `PascalCase.jsx` for React components
- Mongoose models: singular PascalCase (`User`, `OrderItem`)
- Routes: kebab-case URLs (`/api/user-profiles`)
- Booleans: `isActive`, `hasAccess`, not `active`, `access`

### Error Handling
- One centralized Express error-handling middleware — controllers never `try/catch` and format errors themselves; they throw or call `next(err)`
- Use a custom `AppError` class with `statusCode` and `message`
- Never leak stack traces to clients in production

### Environment Variables
- `.env` never committed — always `.env.example` with dummy values checked in
- Validate env vars at startup (fail fast if a required var is missing) — use a small schema check (e.g. `envalid` or a manual check)

### API Design
- REST-consistent: `GET /users`, `POST /users`, `PATCH /users/:id`, `DELETE /users/:id`
- Always version APIs: `/api/v1/...`
- Consistent response shape:
```json
{ "success": true, "data": {}, "message": "" }
{ "success": false, "error": { "code": "", "message": "" } }
```

### MongoDB/Mongoose
- Every schema defines `timestamps: true`
- Indexes declared explicitly in the schema, not added ad-hoc in the DB
- No business logic inside schema `pre`/`post` hooks beyond simple derived fields — keep it in services

### React
- Functional components + hooks only (no new class components)
- One component per file, default export named same as file
- Keep components under ~150 lines — extract when they grow past that
- Co-locate a component's styles/tests/subcomponents in the same folder

---

## 5. Code Comments Guidelines

**Rule of thumb: comments explain *why*, not *what*.** If a comment just restates the code, delete it or rewrite the code to be clearer.

Bad:
```js
// increment i by 1
i++;
```

Good:
```js
// Retry once before failing — third-party API occasionally
// times out on cold start, see incident INC-231
if (attempt < 1) return retry();
```

### When to comment
- Non-obvious business rules ("why does this discount apply only on weekdays")
- Workarounds for bugs in libraries/APIs (link the issue if possible)
- Anything a new hire would misread as a mistake

### When NOT to comment
- Self-explanatory code
- Commented-out old code (delete it — git history keeps it)
- Restating variable/function names in prose

### Tags
```js
// TODO(ashraf): handle pagination once API supports it — JIRA-88
// FIXME: race condition when two requests hit this simultaneously
// HACK: temporary patch until vendor fixes their webhook payload
```
Always tag with an owner or ticket ID so TODOs don't rot anonymously. Run a periodic grep for `TODO`/`FIXME` before each release.

### JSDoc for shared/reusable functions
Required for anything exported from `utils/` or `services/` that other devs will call without reading the implementation:

```js
/**
 * Calculates the final price after applying tiered discounts.
 * @param {number} basePrice
 * @param {Array<{minQty: number, rate: number}>} tiers
 * @returns {number} final price rounded to 2 decimals
 */
function applyTieredDiscount(basePrice, tiers) { ... }
```
Not required for trivial one-line helpers or private component-internal functions.

---

## 6. Documentation Standards

### Repo README (required in every repo)
Must include:
1. Project overview (2-3 sentences)
2. Tech stack
3. Local setup instructions (env vars, install, run)
4. Folder structure overview
5. How to run tests
6. Deployment notes / link to CI-CD pipeline

### API Documentation
- Use **Swagger/OpenAPI** for backend — auto-generate from JSDoc annotations on routes (`swagger-jsdoc`) or maintain an `openapi.yaml`
- Every endpoint documents: method, path, auth requirement, request body schema, response schema, possible error codes

### Architecture Decision Records (ADRs)
For any non-trivial technical decision (choosing a caching layer, switching state management, auth strategy), add a short file to `docs/adr/`:
```
docs/adr/0001-use-redis-for-session-store.md

# Context
# Decision
# Consequences
```
This stops the same debates from repeating every 6 months.

### Component Documentation (optional but recommended once team > 4 devs)
Use **Storybook** for shared UI components so design/QA can see them in isolation without reading code.

---

## 7. Code Review Checklist

Reviewers check, in order:
1. Does it meet the acceptance criteria in the ticket?
2. Is business logic in services, not controllers/components?
3. Are errors handled (no silent failures, no swallowed promises)?
4. Any secrets, API keys, or `console.log` left in?
5. Are new env vars added to `.env.example`?
6. Tests present for new logic?
7. Naming and structure follow section 4?
8. Does it introduce N+1 queries or unindexed Mongo queries?



## 8. Quick Reference Summary

- Tickets always follow the template in §1.2 — no vague tasks.
- One branch per ticket, named `type/TICKET-ID-desc`.
- Commits follow Conventional Commits.
- PRs require review + passing CI, no self-merge on critical code.
- Controllers/components stay thin; logic lives in services/hooks.
- Comments explain *why*; TODOs always have an owner/ticket.
- Every repo has a README; every endpoint is in Swagger; every big decision gets an ADR.
- No PR merges without tests, lint pass, and updated docs.
