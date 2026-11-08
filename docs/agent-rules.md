# Agent Working Rules — GivingWithLove

These rules apply to every task in this repository. Read them fully before touching code.
If a task prompt and these rules disagree, stop and ask the project owner.

---

## 1. Scope

- Do **only** the task described in the prompt.
- Problems you notice outside the task go into the report under "Out-of-scope findings". Do not fix them.
- Do not reformat, rename or move files that the task does not mention.

## 2. Stop and ask — do not solve at any cost

Stop working and ask the project owner when:

- The code contradicts the task, the plan, or itself (for example: two models for the same entity with different fields, a column used with two meanings).
- The change needs a database schema change, a data migration, or deleting data.
- The business meaning is unclear (units of a value, which entity a code refers to, what a number should count).
- The change would break the API contract used by the other repository beyond what the task defines.
- You need a NuGet / npm package that the task does not list.
- The build or the tests fail for a reason unrelated to your change.
- The fix grows well beyond the files listed in the task.

How to ask: state what you found (`file:line`), why it blocks you, and 2–3 options with your recommendation. Then wait.

Never work around a problem with: `any`, `!` / `null!` to silence the compiler, empty `catch`, `#pragma warning disable`, deleting or skipping tests, `.Result` / `.Wait()`, copy-pasted duplicates, or hard-coded values that hide the real issue.

## 3. Git — no commits without the owner

Allowed:
- `git status`, `git diff`, `git log`, `git show`
- `git switch main && git pull --ff-only` at the start of a task
- `git switch -c <branch>` with the branch name given in the task

Forbidden: `commit`, `push`, `merge`, `rebase`, `reset`, `cherry-pick`, `stash drop`, `checkout -- <file>` / `restore` that discards work, deleting branches, tags, any `--force`.

At the end of the task, propose the commands for the owner to run, in a `bash` block:

```bash
git add <explicit file list — never "git add .">
git commit -m "<type>(<scope>): <short summary in English>"
git push -u origin <branch>
```

Use Conventional Commits types: `feat`, `fix`, `refactor`, `chore`, `test`, `docs`.
Never add a `Co-Authored-By` line or any other AI attribution to proposed commit messages or PR descriptions (owner's decision).

## 4. Language

- Code comments, identifiers, commit messages, log messages: **English only**.
- Text shown to end users in the UI: Hebrew, as it is today.
- Comments explain **why**, not what. Don't comment obvious code.
- No commented-out code. Delete it — git keeps the history.

## 5. Clean, readable code

- Meaningful names. No `hhh`, `vm`, `tt`, `v1`, `srv`, `x2`.
- Small functions with one responsibility.
- One public type per file; file name matches the type name.
- No dead code, unused imports, unused variables, or leftover `console.log` / `Console.WriteLine`.
- Errors are handled explicitly and visibly, never swallowed.
- Follow the existing formatting settings (`.editorconfig`, Prettier config in `package.json`).

## 6. Backend architecture (Web → Bl → Dal)

| Layer | Responsible for | Must not |
|---|---|---|
| **Web** (controllers, `Program.cs`) | HTTP: routes, model binding, status codes, DI registration | reference `Dal`, `Dal.Models` or `DbManager` |
| **Bl** | business rules, DTOs, mapping, service interfaces | return EF entities outward; build SQL |
| **Dal** | EF Core context, entities, queries | contain business rules or DTOs |

- Dependency injection only through `Program.cs`. `DbManager` is **scoped**; services are **scoped**.
  No `new ServiceCollection()` inside classes, no service locator, no casting an interface to a concrete class (`(BlXService)x`).
- Async all the way: `async`/`await`, EF `...Async` methods, a `CancellationToken` from the controller passed down. Never `.Result` or `.Wait()`.
- Filter, sort and aggregate in the database (`IQueryable`). Never `.ToList()` and then search in memory.
- Reads use `AsNoTracking()`. Avoid N+1: load related data with `Select` projections or `Include`, in one query.
- Controllers return `ActionResult<T>` with correct status codes (200, 201, 204, 400, 404). Errors go through ProblemDetails. No `try/catch` that returns `bool`.
- "Not found" is a dedicated exception thrown in Bl and mapped to 404 by the global exception handler.
- DTOs live in `Bl/Dtos/<Entity>/`. Mapping lives in `Bl/Mapping/` (one mapper per entity). Query result records that Dal returns live in `Dal/Queries/`.
- **Scale (owner's requirement):** the system must handle many thousands of rows per table (design for at least 100,000 Volunteering rows and tens of thousands of Eichud people). The local database is small today, so "it is fast on my machine" proves nothing. Therefore:
  - List endpoints of large tables (Volunteering, Volunteer, Eichud) are paged on the server: `page` (1-based), `pageSize` (default 25, maximum 100), optional `search` and `sort`, and they return `PagedResult<T> { Items, TotalCount, Page, PageSize }`. Sorting is stable (always ends with the primary key). Small lookup tables (Position, Project, SubProject, the project tree) may return the full list.
  - Never return a whole large table, never load it into memory, never count or aggregate in C#. `Count`, `Sum` and `GroupBy` run in SQL.
  - The number of SQL queries per request is constant; it does not grow with the number of rows (no N+1).
  - Filters and sorts use indexed columns. If a query needs an index that does not exist, write it in `docs/sql/indexes.sql` and tell the owner; never change the database schema yourself.

## 7. Never mix entities

- Each entity has its own DTOs, service and controller.
- Know the domain:
  - **Eichud** — a person in the community registry.
  - **Volunteer** — an Eichud person who volunteers (`Volunteer.VolunteerCode` = `Eichud.EichudCode`).
  - **Volunteering** — one act of volunteering. `VolunteerCode` → Volunteer, `MatcherCode` → Volunteer, `PoorManCode` → **Eichud** (not a Volunteer!), `ProjectCode` → Project, `SubProjectCode` → SubProject.
  - **Project** — tree: a project whose `DomainCode` is null is a department (אגף); its children point to it through `DomainCode`.
  - **VolunteerDomain** — link table Volunteer ↔ Project.
- Separate read DTOs from write DTOs (`VolunteerDto`, `VolunteerDetailsDto` vs `CreateVolunteerDto`, `UpdateVolunteerDto`).
- Don't add fields of entity B to the model of entity A for convenience. Create a dedicated view DTO.
- Statistics live in a dedicated Stats service with its own DTOs, not inside entity services.
- Frontend: exactly one model per entity, in one place. No duplicate model classes.

## 8. Frontend architecture (Angular 20)

Target structure (move toward it only when your task says so):

```
src/app/
  core/       api helpers, API services, interceptors, auth, notifications
  models/     interfaces / generated API types — one source per entity
  features/   <feature>/ pages, components, feature store
  shared/     reusable presentational components, pipes
```

- Models are `interface` / `type`. No classes, no decorators.
- API services (`core/api/<resource>-api.service.ts`): stateless, return `Observable`, one per backend resource, never `subscribe` inside. URLs are built from `environment.apiUrl`.
- State: local component `signal`s; a feature store with signals only when several components share the state. No public mutable arrays on services. Selection between pages goes through route parameters.
- Components never use `HttpClient` directly and never aggregate business data — the server returns ready numbers.
- Scale: large lists (volunteerings, volunteers, Eichud people) use server-side paging, sorting and search (`mat-paginator` / `mat-sort` bound to the API's `page`, `pageSize`, `sort`, `search`; search input debounced ~300 ms with `switchMap` cancelling the previous request). Never download a whole large table to filter it in the browser. Dropdowns that pick a person use a server-side autocomplete, not a full list.
- Prefer `toSignal` / `rxResource` / `async` pipe. Manual subscriptions use `takeUntilDestroyed(this.destroyRef)`.
- Templates: `@if` / `@for` with `track item.<id>`; every data view has loading, error and empty states.
- Strict typing: no `any`, no non-null assertions to silence errors.
- Standalone components, `inject()`, lazy routes with `loadComponent`.
- Charts: `ng2-charts` with `chart.js` 4 only.

## 9. Verify before reporting

- Backend: `dotnet build` with no new warnings; `dotnet test` when tests exist.
- Frontend: `npx ng build`; `npx ng test --watch=false` when relevant.
- Describe how you checked behavior (Swagger calls, pages opened).
- If you could not verify something, say so explicitly. Never claim success you did not see.

## 10. Final report format

```
## Summary
## Changed files            (path — one line why)
## Decisions made
## Out-of-scope findings
## Open questions for the owner
## Verification             (commands and their results)
## Proposed git commands    (bash block)
```
