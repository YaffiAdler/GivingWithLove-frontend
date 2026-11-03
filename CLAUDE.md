# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Hebrew/RTL volunteer-management SPA for the "Giving With Love" organization: volunteers, eichud (unification) personnel, project domains → projects → sub-projects, positions, volunteering records, and an analytics dashboard. Angular 20 standalone components, Angular Material + PrimeNG + Bootstrap. Charts use **two** wrappers over the same Chart.js 3.9.1: ng2-charts (`<canvas baseChart>`, registered via `provideCharts(withDefaultRegisterables())` in `app.config.ts`) in `data-display`, and PrimeNG `<p-chart>` (`ChartModule` from `primeng/chart`, which imports `chart.js/auto`) in `volunteer-details`. The `baseChart` canvases left in `volunteer-details.html` are commented out — that component does not import `BaseChartDirective`.

The backend is a separate ASP.NET API (default `https://localhost:7016`) — it must be running for the app to show any data.

### Backend (`../GivingWithLove-backend`) known issues
- **DB connection is hardcoded** in `Dal/Models/DbManager.cs` (`OnConfiguring`, LocalDB `AttachDbFilename=C:\GWL\GivingWithLove-backend\Dal\GWLData.mdf`). The `DefaultConnection` in `Web/appsettings.json` is a placeholder path and is **not used**; `AddDbContext` in `Program.cs` is commented out. The server only works on a machine with that exact path.
- The `.mdf`/`.ldf` files must not be in git (they are in `.gitignore`); each developer needs a local copy of `GWLData.mdf`.
- `bin/` and `obj/` are in `.gitignore` but were committed earlier and are still tracked, so every build dirties the working tree.
- All BL/DAL services are registered as **singletons** (`Bl/BlManager.cs`), including the one holding the `DbContext`. EF Core `DbContext` is not thread-safe, so concurrent requests can fail and cached entities go stale.
- CORS (`Web/Program.cs`) allows any `localhost` origin, because `ng serve` picks a random port when 4200 is taken. The production origin is not allowed yet and must be added on deployment.
- No authentication on the API (it matches the frontend's in-memory login).

### Production config
`environment.prod.ts` holds a placeholder `apiUrl` (`https://PRODUCTION_API_URL_NOT_SET`) until a production server exists. A production build will compile but cannot reach any API.

## Commands

```bash
npm start                      # ng serve → http://localhost:4200
npm run build                  # production build (swaps environment.prod.ts)
npm run watch                  # dev build in watch mode
npm test                       # Karma + Jasmine, all specs
ng test --include src/app/Services/volunteer-service.spec.ts   # single spec file
ng test --no-watch --browsers=ChromeHeadless                    # one-shot run
```

There is no lint script or ESLint config; Prettier settings live inline in `package.json` (`printWidth: 100`, `singleQuote: true`). Most `*.spec.ts` files are CLI-generated stubs.

## Architecture

### Routing
All routes are in [src/app/app.routes.ts](src/app/app.routes.ts) and use `loadComponent` lazy loading. Nested routes matter:
- `volunteer` → `allvolunteers` (child `volunteer-details`), `addvolunteer/add`, `addvolunteer/edit/:id` — add and edit share the `AddVolunteer` component.
- `domain` → `project`, `sub/:id/:name`.
- Analytics drill-down: `data` (`DataDisplay`) → `midData/:code` (per project) → `deepDataDisplay/:code` (per sub-project).
- The volunteering form lives at the short path `v`.

### Services = HTTP + shared state
Each service in `src/app/Services/` (all `providedIn: 'root'`, using `inject()`) mixes three roles:
1. **CRUD over HTTP** — `BASE_URL = \`${environment.apiUrl}/api/<Entity>\``. URL suffix conventions are inconsistent between services (some append `'/' + id`, some `id` directly, some `'Put/'`/`'Delete/'`), so check the exact concatenation in the service you touch.
2. **Cached data** — a mutable array (e.g. `volunteers`) plus an `Observable$` (e.g. `volunteers$`), both reassigned by `refreshData()`. Most constructors call `refreshData()`, so data loads on first injection. `add*`/`update*` methods subscribe internally and call `refreshData()`; `getAll*`/`delete*` return cold Observables.
3. **Cross-component "selected" state** — fields like `volunteerCodeInS`, `projectCodeInS`, and `VolunteerDomainService.domains` are set by one component before navigation and read by the target component to pre-fill forms. When changing navigation flows, trace these fields across components.

Login ([log-in](src/app/Components/log-in/)) only matches entered values against locally loaded eichud/volunteer data and sets `VolunteerService.currentUser` / `isVolunteerLoggedIn` in memory — no tokens, no guards, and nothing persists across a refresh.

### Analytics
`ProjectService.dataPerProject()` (called from `getAllProjects()`) mutates project objects with aggregated cost/time. Similar volunteering → sub-project → sum loops are duplicated in `data-display`, `mid-data`, and `deep-data-display`; keep them consistent when changing calculation rules. `DataDisplay` keeps filter/drill-down state in a single `signal()`, and also handles CSV export.

### HTTP
[src/app/app.config.ts](src/app/app.config.ts) registers `httpLoggingInterceptor` ([src/app/core/http.interceptor.ts](src/app/core/http.interceptor.ts)), which only logs to the console. Components mostly lack error handling.

### Models
`src/app/Models/` holds plain classes. Naming is inconsistent: most are `*Module` (`ProjectModule`, `SubProjectModule`, `VolunteeringModule`), while others are `*Model` (`VolunteerModel`, `EichudModel`). There are **two** `VolunteerDomainModule` classes (`Models/volunteer-domain/` and `Models/volunteering/volunteer-domain/`), so check which one a file imports.

## Conventions

- Component files have no `.component` suffix (`volunteer.ts`, `volunteer.html`, `volunteer.scss`); the class name matches (`Volunteer`). Styles are SCSS, selector prefix `app`.
- Templates are Hebrew and RTL (`dir="rtl"`); most layout and sidebar styling lives in global [src/styles.scss](src/styles.scss) rather than component styles.
- Reactive Forms with untyped `FormControl`s.
- `takeUntilDestroyed()` without arguments only works in an injection context (constructor/field initializer). Inside `ngOnInit` or after an `await`, inject `DestroyRef` as a field and pass it — `takeUntilDestroyed(this.destroyRef)` — otherwise the page throws NG0203.
- Environment config: [src/environments/](src/environments/) (`apiUrl`), swapped through `fileReplacements` in `angular.json` for production builds.
