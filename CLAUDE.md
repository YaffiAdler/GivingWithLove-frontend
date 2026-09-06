# Giving With Love — Frontend

## Overview

A volunteer-management web application (Hebrew/RTL) for the "Giving With Love" organization. Enables registration of volunteers, eichud (unification) personnel, projects, sub-projects, positions, and volunteering activity tracking. Includes a data dashboard with drill-down analytics, charts, and CSV export.

## Tech Stack

- **Framework:** Angular 20.2.0 (standalone components)
- **Language:** TypeScript ~5.9.2 (strict mode enabled)
- **UI Libraries:**
  - Angular Material 20.2.14 (CDK, dialog, icons)
  - PrimeNG 20.1.1 (DataView, DatePicker, Chart)
  - Bootstrap 5.3.8 (likely imported but no explicit NgModule)
  - ng2-charts 9.0.0 + Chart.js 3.9.1 (bar, pie, doughnut, line charts)
  - date-fns 4.3.0 + chartjs-adapter-date-fns
  - PrimeIcons 7.0.0
- **HTTP:** `@angular/common/http` (no interceptor)
- **State:** Mutable service properties + RxJS `Observable` (no Signals-based state management; single Signal usage in DataDisplay)
- **Forms:** Reactive Forms (`FormGroup`, `FormControl`)
- **Build:** Angular CLI 20.2.1 via `@angular/build:application`
- **Package Manager:** npm (package-lock.json present)
- **Testing:** Karma + Jasmine (~5.9.0)

## Project Structure

```
src/
├── index.html                     # Root HTML (RTL English html lang, Material Icons via CDN)
├── main.ts                        # bootstrapApplication with appConfig
├── styles.scss                    # Global styles (RTL, sidebar, cards, responsive layout)
└── app/
    ├── app.ts                     # Root App component (standalone, sidebare + router-outlet)
    ├── app.html                   # App shell HTML: sidebar + topbar + router-outlet
    ├── app.scss                   # (empty — styles live in styles.scss)
    ├── app.config.ts              # App-wide providers (router, HTTP, animations, charts)
    ├── app.routes.ts              # All routes (home, volunteering, volunteer, domain, eichud, position, data, login…)
    ├── app.spec.ts                # Basic smoke test (creates app, checks title)
    │
    ├── Components/
    │   ├── home-page/             # Welcome page — minimal "ברוכים הבאים"
    │   ├── log-in/                # Login form — validates name+password against eichud & volunteer data
    │   ├── volunteering/          # Add volunteering record form — date, volunteer, poor man, matcher, project, sub-project
    │   ├── volunteer/             # Volunteer parent — entry page with "register" / "all volunteers" buttons
    │   │   ├── add-volunteer/     # Add/edit volunteer form — searchable eichud list, position + domain selectors
    │   │   ├── all-volunteers/    # Full volunteers table with search, edit, volunteering, details (dialog)
    │   │   └── volunteer-details/ # Modal dialog — volunteer info + volunteering history + pie/bar charts
    │   ├── volunteer-domain/      # Domain selector component — used inside add-volunteer
    │   ├── domains/               # Project domain listing — links to sub-projects + project add form
    │   ├── project/               # Project CRUD — list + add form (name, manager, domain)
    │   ├── sub-project/           # Sub-project list per domain — clicking opens volunteering form
    │   ├── eicud/                 # Eichud (unification) table + add form — 13 fields for person data
    │   ├── position/              # Position CRUD — table + add form
    │   ├── data-display/          # Analytics dashboard — KPIs, bar/pie/doughnut charts, drill-down, CSV export
    │   ├── mid-data/              # Mid-level per-project dashboard — sub-project links + KPI cards
    │   └── deep-data-display/     # Deep dive per sub-project — volunteer count, KPI cards, sub-project list
    │
    ├── Services/
    │   ├── volunteer-service.ts       # Volunteer CRUD — in-memory cache + HTTP
    │   ├── eichud-service.ts          # Eichud CRUD — in-memory cache + HTTP
    │   ├── project-service.ts         # Project CRUD — data aggregation per project
    │   ├── sub-project-service.ts     # SubProject CRUD — in-memory cache + HTTP
    │   ├── volunteering-service.ts    # Volunteering CRUD — selection state + HTTP
    │   ├── position-service.ts        # Position CRUD — in-memory cache + HTTP
    │   └── volunteer-domain-service.ts # VolunteerDomain CRUD — domain selection state + HTTP
    │
    └── Models/
        ├── EichudModel.ts
        ├── PositionModel.ts
        ├── volunteer/volunteer-module.ts
        ├── project/project-module.ts
        ├── sub-project/sub-project-module.ts
        ├── volunteer-domain/volunteer-domain-module.ts
        ├── volunteering/volunteering/volunteering-module.ts
        ├── volunteering/volunteer-domain/volunteer-domain-module.ts
        └── user/user-model/user-model.ts
```

## How to Run

```bash
# Development server
ng serve

# Production build
ng build

# Watch mode (development)
ng build --watch --configuration development

# Unit tests
ng test
```

No CI/CD scripts or E2E test scripts are defined in `package.json`.

## Architecture & Patterns

### Component Organization

- **Standalone components** — every component is `standalone: true` (no `NgModules` used anywhere).
- **Routing** — all routes defined in `app.routes.ts` with lazy-load-by-import (not `loadChildren`).
- **Data display hierarchy:** `data-display` (overview) → `mid-data` (per-project) → `deep-data-display` (per-sub-project).

### Data Flow

- **Services as state holders** — each service caches data in mutable arrays (`volunteers`, `projects`, `peopleInTheEichud`, etc.) and provides an `Observable$` property for reactive template binding.
- **Constructor & ngOnInit data loading** — services call `refreshData()` in constructors; components call `lastValueFrom()` or `.subscribe()` in `ngOnInit()`.
- **Navigation state** — services hold "selected" values (`volunteerCodeInS`, `projectCodeInS`, etc.) that are read by target components to pre-populate forms.
- **Weak reactive integration** — mix of manual `.subscribe()`, `lastValueFrom()`, and a single `signal()` usage in `DataDisplay` for filter/drill-down state.

### HTTP Layer

- **No HTTP interceptor** — every service has a hardcoded `BASE_URL: 'https://localhost:7016/api/...'`.
- **No error handling** — `.subscribe()` calls lack error callbacks; `lastValueFrom()` is used without try/catch in most places.
- **No request cancellation** — subscriptions are never cleaned up (`takeUntil`, `destroyRef`, etc.).

### Forms

- **Reactive Forms** throughout (`FormGroup`, `FormControl`).
- **Un-typed form controls** — all use `new FormControl(null)` or `FormBuilder.group({...})` without typed form interfaces (`FormGroup<{...}>`).
- **Hardcoded default values** in eicud form (e.g. `familyName: new FormControl("גולדמן")`).

### Charts

- **ng2-charts** wrapping Chart.js 3.9.1 — used in `volunteer-details` (pie, bar), `data-display` (bar, pie, doughnut, line), but line chart (`momentumChart`) not wired in template.

## Key Conventions

- **Naming:** PascalCase classes, camelCase properties/methods.
- **File naming:** kebab-case filenames (e.g. `volunteer-service.ts`).
- **RTL Layout:** all templates use `dir="rtl"`, `styles.scss` has `direction: rtl`.
- **Hebrew content** — UI text in Hebrew, all navigation labels and form labels.
- **CRUD pattern** per service: `getAll`, `getById`, `add`, `update`, `delete` + `refreshData()`.
- **No NgModules** — the entire app uses standalone components and `bootstrapApplication`.
- **No state management library** — state lives in service mutable properties.

## Current Issues / Improvement Opportunities

### 🔴 Critical

#### 1. All API URLs hardcoded → no environment configuration
**Where:** Every service file (e.g. `volunteer-service.ts:16`, `eichud-service.ts:13`, `project-service.ts:16`).
**Issue:** `BASE_URL = 'https://localhost:7016/api/...'` is hardcoded in each service. Impossible to target different backends (dev/staging/prod) without modifying code.
**Fix:** Use `src/environments/environment.ts` with Angular environment replacement.

#### 2. No HTTP interceptor → error handling, auth headers, logging missing
**Where:** `app.config.ts` calls `provideHttpClient()` without any interceptor setup.
**Issue:** Every HTTP call lacks centralized error handling, authentication tokens, request logging, or loading-state broadcasting.
**Fix:** Add `withInterceptors(...)` to `provideHttpClient()` with an interceptor for error handling and auth.

#### 3. Subscription memory leaks everywhere
**Where:** Across all components and services — e.g. `all-volunteers.ts:58`, `volunteer-service.ts:59`, `eichud-service.ts:42`, `position-service.ts:18`.
**Issue:** Components subscribe to `valueChanges` and HTTP observables without any teardown (`takeUntilDestroyed`, `takeUntil`, `async pipe`). Services subscribe to HTTP calls in constructors and `refreshData()` without cleanup. This causes memory leaks and potential double-submissions.
**Fix:** Replace manual `.subscribe()` with `async` pipe in templates where possible; use `takeUntilDestroyed()` or `DestroyRef` for imperative subscriptions.

#### 4. Models decorated as `@NgModule` instead of plain classes
**Where:** Every model file — e.g. `EichudModel.ts:10`, `PositionModel.ts:10`, `VolunteerModule.ts:18`.
**Issue:** Data models like `EichudModel`, `PositionModel`, `VolunteerModule` etc. are declared as `@NgModule({ declarations: [], imports: [CommonModule] })` classes that also export nothing. These are not NgModules — they are plain data classes. The `@NgModule` decorator is a no-op active misdirection.
**Fix:** Remove the `@NgModule` decorator and `CommonModule` imports entirely. Export the class as a plain TypeScript class.

#### 5. `VolunteerModule` name conflict with Angular NgModule convention
**Where:** `src/app/Models/volunteer/volunteer-module.ts:18`.
**Issue:** The volunteer data model is named `VolunteerModule`, which directly clashes with Angular's `NgModule` convention. This is extremely confusing and can cause IDE/compiler confusion.
**Fix:** Rename to `Volunteer` or `VolunteerModel`.

### 🟠 Architecture

#### 6. Services used as state containers with mutable arrays
**Where:** All services — e.g. `volunteer-service.ts:21-22`, `eichud-service.ts:15-16`.
**Issue:** Each service holds mutable arrays (`volunteers: VolunteerModule[] = []`) that are mutated directly by components. This causes stale reads, change detection issues, and loss of reactive updates.
**Fix:** Use Signals (`signal`, `computed`) or BehaviorSubjects for state; components should react to changes rather than read mutable arrays.

#### 7. No separation between "selected state" and "data state"
**Where:** `volunteer-service.ts:24-30`, `volunteering-service.ts:19-47`.
**Issue:** Selection state (`volunteerCodeInS`, `poorManCodeInS`, `matcherCodeInS`... ) mixed with data CRUD in the same services. High coupling, no clear ownership.
**Fix:** Extract selection/navigation state into route parameters or a dedicated state service.

#### 8. Services calling HTTP in constructors
**Where:** `eichud-service.ts:18`, `project-service.ts:28`, `sub-project-service.ts:15`, `position-service.ts:17`.
**Issue:** HTTP calls in constructors cause data fetching at inject time, before any component actually needs the data. Can cause race conditions and wasted requests if the service is injected but unused.
**Fix:** Move initialization to `APP_INITIALIZER` or lazy-load via component lifecycle hooks.

#### 9. `dataPerProject()` called inside `getAllProjects()` — unintended side effect
**Where:** `project-service.ts:31-33`.
**Issue:** `getAllProjects()` calls `this.dataPerProject()` before every GET request, which mutates `this.projects[index]` properties. This couples data retrieval with aggregation logic.
**Fix:** Separate read queries from data transformation. Move aggregation to the component or a dedicated analysis service.

#### 10. Heavy duplication of looping logic for cost/time calculations
**Where:** `project-service.ts:76-114`, `data-display.ts:393-411`, `mid-data.ts:78-106`, `deep-data-display.ts:90-119`.
**Issue:** The same pattern (iterate volunteerings → find sub-project → sum cost/time) is copy-pasted across 4+ files.
**Fix:** Create a shared `AnalyticsService` with reusable aggregation functions.

### 🟡 Code Quality

#### 11. Massive commented-out code blocks
**Where:** `volunteering.ts:1-278` (entire old version commented out), `volunteer-details.html:1-97` (similarly), `add-volunteer.html:1-105`, `data-display.ts:432-448`, `volunteer.ts:43-84`, and more.
**Issue:** Hundreds of lines of dead commented-out code bloat every file, reducing readability and maintainability.
**Fix:** Delete all commented-out code. Git history preserves it.

#### 12. `alert()` for user notifications
**Where:** `volunteering.ts:375`, `volunteer-domain.ts:66`, `add-volunteer.ts` (commented out), `log-in.ts` (commented out).
**Issue:** `alert()` is a blocking, unstyled native dialog. Provides poor UX.
**Fix:** Use Angular Material snackbar/dialog or a toast service.

#### 13. Inconsistent error handling — most HTTP calls lack error callbacks
**Where:** Almost every `.subscribe()` call — e.g. `project.ts:23`, `position.ts:34`, `volunteer-service.ts:49`.
**Issue:** Network failures silently fail or cause unhandled errors.
**Fix:** Add error callbacks and user-facing error notifications.

#### 14. `track` by object reference instead of unique id
**Where:** `volunteering.html:19`, `project.html:26`, `domains.html:6`, `home-page.html` (commented).
**Issue:** `track p` (the object itself) instead of `track p.projectCode` / `p.volunteerCode`. Causes full re-render on data change.
**Fix:** Always use `trackBy` with a unique identifier function.

#### 15. `@Input() hhh!:number` — cryptic naming
**Where:** `volunteer-domain.ts:23`.
**Issue:** No one can understand what `hhh` means. It's used to distinguish edit vs. add mode.
**Fix:** Rename to `isEditMode: boolean`.

#### 16. Store domain selection in service `domains` array, not component-local state
**Where:** `volunteer-domain-service.ts:17`, `add-volunteer.ts:45`.
**Issue:** `VolunteerDomainService.domains: number[]` is mutated globally across components, creating hidden cross-component state coupling.
**Fix:** Keep domain selection as local component state, emit via output, or use route state.

### 🔵 Performance

#### 17. No lazy loading — all components eagerly imported
**Where:** `app.routes.ts:59-77` — every component is statically imported at the top.
**Issue:** The entire application bundle loads at once. For a growing app this will degrade initial load time.
**Fix:** Use `loadComponent: () => import(...)` for route-level lazy loading.

#### 18. `styles.scss` has two competing CSS blocks for the same selectors
**Where:** `styles.scss:1-213` (commented out old block) and `styles.scss:214-467` (active block).
**Issue:** The first big block is commented out but remains in the bundle! This inflates the CSS file unnecessarily.
**Fix:** Delete the commented-out block.

### 🟣 Testing

#### 19. Minimal test coverage — 1 basic spec file only
**Where:** `app.spec.ts` only. Component spec files exist (`*.spec.ts` per component) but appear to be Angular CLI boilerplate stubs (not verified — but no substantive test logic found in `all-volunteers.spec.ts` etc.).
**Issue:** Near-zero test coverage for business logic, services, or routing.
**Fix:** Add unit tests for:
- All services (HTTP mocking via `HttpClientTestingModule`)
- Key business logic (filtering, cost/time calculations)
- Component integration tests

#### 20. No E2E testing configured
**Where:** `package.json` scripts have no E2E command; no Playwright/Cypress config found.
**Issue:** No regression protection for user flows (login → navigate → add volunteering → view data).
**Fix:** Add Playwright or Cypress for key user journeys.

### ⚫ Security

#### 21. No authentication/authorization layer
**Where:** `log-in.ts` — login checks only against locally loaded data (no JWT, no token, no server-side auth).
**Issue:** The "login" is purely cosmetic. `isVolunteerLoggedIn` is a boolean on the service that any component can set. No HTTP auth headers sent.
**Fix:** Implement proper authentication flow with JWT, HTTP interceptor for auth headers, and route guards.

#### 22. `localStorage` / `sessionStorage` not used — session lost on refresh
**Where:** `volunteer-service.ts:64-67`.
**Issue:** `setCurrentUser()` only sets in-memory properties. Page refresh logs out the user.
**Fix:** Persist auth token in `sessionStorage` or `localStorage` with an interceptor that rehydrates state.

### 🟤 Developer Experience

#### 23. No ESLint or Prettier config files
**Where:** Project root — no `.eslintrc.*` or `.prettierrc` (but `package.json` has a `"prettier"` section).
**Issue:** Inline prettier config exists but is minimal. No ESLint means type-linting, unused-import detection, and consistent style enforcement are absent.
**Fix:** Add ESLint with `@angular-eslint` and standard Prettier config file.

#### 24. Unused imports in multiple files
**Where:** `volunteering.ts:294` (`AsyncAction`), `volunteering.ts:297` (`NO_ERRORS_SCHEMA`, `SECURITY_SCHEMA`), `app.ts:3` (`V`), `app.ts:8` (`provideAnimations`), `deep-data-display.ts:10` (`V`).
**Issue:** Unused imports clutter files and cause IDE warnings.
**Fix:** Run `eslint --fix` or manually clean up.

#### 25. Confusing duplicate model: two `VolunteerDomainModule` classes
**Where:** `src/app/Models/volunteer-domain/volunteer-domain-module.ts` and `src/app/Models/volunteering/volunteer-domain/volunteer-domain-module.ts`.
**Issue:** Two separate model files with the same class name and almost identical structure. This is a maintainability risk.
**Fix:** Consolidate into a single model definition.

## Nice-to-Haves / Future Direction

1. **Migrate to Signals** — Replace mutable service arrays with `signal()` / `computed()` for full reactivity.
2. **Standalone migration audit** — The app is already standalone, but ensure no hidden NgModule references remain.
3. **Add environment files** — Create `src/environments/environment.ts` + `environment.prod.ts` with API base URLs.
4. **Upgrade ng2-charts to Angular 20 compatible** — Current ng2-charts 9.0.0 / Chart.js 3.9.1 works, but consider Chart.js 4.x for modern features.
5. **Add ESLint flat config** — Adopt Angular 20's recommended `eslint.config.js` flat config.
6. **Convert to `inject()` function** — Most services already use `inject()`, but a few use constructor injection (`SubProject`, `DataDisplay`, `DeepDataDisplay`, `LogIn`). Consistent use recommended.
7. **Add CI/CD pipeline** — GitHub Actions or GitLab CI for lint → test → build.
8. **Add Angular Universal / SSR** — If SEO for public pages is needed.
9. **Consider Tailwind or PrimeFlex** — Current styling mixes Bootstrap, Material, PrimeNG, and hand-written SCSS. A single design system would reduce CSS bloat.
10. **Build a proper date-range filter component** — `DataDisplay` has `setDate(from, to)` but no UI wired to it.
