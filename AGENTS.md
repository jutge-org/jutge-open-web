# Project rules

- Prefer `fs/promises` over `fs` for all I/O operations.
- Components names should be PascalCase.
- ALways use "Icon" suffix for Lucide icons.
- Never modify files in the `components/ui` directory.
- Never modify the `lib/jutge_api_client.ts` file.
- Do not use mono font for ids.
- problem ids and submission ids are URL friendly, do not encode them.
- All icon buttons should have a tooltip.
- Ensure standard accessibility of all pages and components.

## Architecture

Use this section to locate code quickly. Prefer the **feature lookup table** first, then follow the **data-flow** layers.

### Directory map

| Path                  | Role                                                                                                                                                      |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/`                | Next.js App Router: pages, layouts, route handlers (`route.ts`). URL structure mirrors folders.                                                           |
| `components/`         | React UI grouped by domain (`problems/`, `submissions/`, `instructor/`, …). Shared shell in `components/general/`, `components/layout/`.                  |
| `components/ui/`      | shadcn primitives — **do not edit**.                                                                                                                      |
| `services/queries/`   | Server-side read helpers: fetch from Jutge API, decode/transform, return typed view data. Most exports are `fetch*` functions wrapped in React `cache()`. |
| `services/mutations/` | Server-side write helpers (small; most writes go through `actions/`).                                                                                     |
| `actions/`            | `'use server'` entry points for client components and forms. Thin wrappers around API calls or `services/`.                                               |
| `lib/`                | Pure helpers, auth, domain logic, Monaco/highlight config. Subfolders: `lib/instructor/`, `lib/administrator/`, `lib/monaco/`.                            |
| `hooks/`              | Client-side React hooks (preferences, Monaco/hljs themes, mobile).                                                                                        |
| `content/`            | Markdown source for about/documentation pages.                                                                                                            |
| `docs/`               | Maintainer notes (e.g. migration status). Not rendered by the app.                                                                                        |

### Data flow

```
app/**/page.tsx          → orchestrates: auth, params, breadcrumbs, metadata
       ↓
services/queries/*.ts    → API fetch + decode + aggregate (preferred for reads in RSC pages)
lib/*.ts                 → parsing, row builders, nav helpers, formatters (no direct HTTP)
       ↓
components/**            → present data; minimal logic

Client components that need fresh data or mutations:
components/**  →  actions/*.ts  →  getCurrentClient() / withInstructorClient()  →  Jutge API
```

- **Server Components (default):** pages import from `services/queries/` and `lib/`, then pass props to components.
- **Client interactivity:** components call `actions/*` (e.g. `SubmissionsList` → `actions/submissions.ts`).
- **Instructor writes:** `actions/instructor.ts` via `withInstructorClient()` in `lib/instructor/with-instructor-client.ts`.
- **Administrator writes:** `actions/administrator.ts` via `withAdminClient()` in `lib/administrator/with-admin-client.ts`.

### Routes by audience

| Audience          | Route prefix                                                                          | Components                                                               | Queries / actions                                          |
| ----------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------- |
| Students (public) | `/problems/public`, `/courses/public`                                                 | `components/problems/`, `components/courses/`                            | `services/queries/problems.ts`, `courses.ts`               |
| Students (authed) | `/problems`, `/submissions`, `/exams`, `/courses`, `/awards`, `/activity`, `/profile` | `components/problems/`, `submissions/`, `exams/`, `courses/`, `profile/` | `services/queries/submissions.ts`, `exams.ts`, `awards.ts` |
| Instructors       | `/instructor/**`                                                                      | `components/instructor/**`                                               | `actions/instructor.ts`, `lib/instructor/*`                |
| Administrators    | `/administrator/**`                                                                   | `components/administrator/**`                                            | `actions/administrator.ts`                                 |
| Docs / about      | `/documentation/**`, `/about/**`                                                      | `components/documentation/`, `about/`                                    | `lib/documentation.ts`, `content/documentation/`           |

Instructor layout (`app/instructor/layout.tsx`) gates with `renderInstructor()`. Administrator pages use `renderAdministrator()`. Profile pages use `renderAuthed()`.

### Feature lookup

Start here when changing a feature. Grep component or function names from the table (e.g. `SubmissionDetailView`, `fetchProblemDetail`).

| Feature                         | Routes (`app/`)                                            | Components                                                                              | Services / lib                                                                     | Actions                               |
| ------------------------------- | ---------------------------------------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------- |
| Problem list & search           | `problems/(list)/`, `problems/search/`, `problems/public/` | `ProblemsList`, `ProblemsSearchView`                                                    | `services/queries/problems.ts`, `lib/problems.ts`                                  | `actions/problems.ts`                 |
| Problem detail (statement)      | `problems/[key]/(detail)/`                                 | `ProblemDetail`, `ProblemStatement`, `ProblemHeaderCard`, `ProblemNav`                  | `services/queries/problemDetail.ts`, `lib/problemNav.ts`, `lib/problemVariants.ts` | `actions/problems.ts` (search/submit) |
| Problem solutions (instructor)  | `problems/[key]/solutions/`                                | `ProblemSolutions`, `SolutionCodeEditor`                                                | `services/queries/problemSolutions.ts`                                             | `actions/problemSolutions.ts`         |
| Problem test cases (instructor) | `problems/[key]/testcases/`                                | `ProblemDetail` (shell)                                                                 | `services/queries/problemDetail.ts`                                                | —                                     |
| Submissions list                | `submissions/`, `problems/[key]/submissions/`              | `SubmissionsList`, `SubmissionsListToolbar`                                             | `services/queries/submissions.ts`, `lib/submissions.ts`                            | `actions/submissions.ts`              |
| Submission detail               | `problems/[key]/submissions/[submission_id]/`              | `SubmissionDetailView`, `SubmissionAnalysisCard`, `ScoringCard`, `DebugInformationCard` | `services/queries/submissions.ts`, `lib/codeMetrics.ts`, `lib/debugInformation.ts` | `actions/submissions.ts`              |
| Submission code / diff viewers  | `.../code/view/`, `.../diffs/[testcase]/diff/view/`        | `SubmissionCodeEditor`, `SubmissionTestcaseDiffEditor`                                  | `services/queries/submissions.ts`                                                  | —                                     |
| Courses (student)               | `courses/`, `courses/[course_key]/`                        | `components/courses/`                                                                   | `services/queries/courses.ts`, `lib/courses.ts`                                    | `actions/courses.ts`                  |
| Courses (instructor)            | `instructor/courses/**`                                    | `components/instructor/courses/`                                                        | `lib/instructor/loadCourseStatisticsData.ts`, `courseStudentRanking.ts`, …         | `actions/instructor.ts`               |
| Exams                           | `exams/`, `instructor/exams/**`                            | `components/exams/`, `instructor/exams/`                                                | `services/queries/exams.ts`, `lib/exams.ts`                                        | `actions/instructor.ts`               |
| Problem authoring               | `instructor/problems/**`                                   | `components/instructor/problems/`                                                       | `lib/instructor/problems.ts`                                                       | `actions/instructor.ts`               |
| Lists                           | `instructor/lists/**`                                      | `components/instructor/lists/`                                                          | `services/queries/lists.ts`                                                        | `actions/instructor.ts`               |
| JutgeAI                         | `instructor/jutgeai/**`                                    | `components/instructor/jutgeai/`                                                        | `lib/ai-utils.ts`                                                                  | `actions/instructor.ts`               |
| Admin dashboard                 | `administrator/**`                                         | `components/administrator/`                                                             | `lib/administrator/grid-renderers.tsx`                                             | `actions/administrator.ts`            |
| Auth & session                  | —                                                          | `SignInDialog`, `AuthToolbar`, `LoginGate`                                              | `lib/auth.ts`, `lib/jutge-auth-session.ts`, `lib/jutge-client-registry.ts`         | `actions/auth.ts`                     |
| Appearance / Monaco             | —                                                          | `AppearanceSettingsDialog`, `MonacoThemeMenu`                                           | `lib/appearanceSettings.ts`, `lib/monaco/`, `lib/hljsThemes.ts`                    | —                                     |

### Problem URLs and identifiers

- URL segment `[key]` is either a **problem name** (`P68688`) or **problem id** (`P68688_en`). Parse with `parseProblemKey()` in `lib/problems.ts`.
- Resolve a concrete `problem_id` from a key with `resolveProblemId()` in `services/queries/problemDetail.ts`.
- Problem sub-routes share a shell via `ProblemDetail` + `ProblemNav`. Tab config lives in `lib/problemNav.ts` (`problemNavItems`, `problemTabFromPathname`).
- `problem_nm`, `problem_id`, `submission_id` are URL-friendly — **do not encode** them.
- `proxy.ts` rewrites submission code/diff HTML paths to their `/view` routes.

### Auth and API clients

| Function                                         | File                           | Use when                                         |
| ------------------------------------------------ | ------------------------------ | ------------------------------------------------ |
| `isAuthenticated()`                              | `lib/auth.ts`                  | Check login without throwing                     |
| `tryGetCurrentUser()`                            | `lib/auth.ts`                  | Optional session user                            |
| `getCurrentUser()`                               | `lib/auth.ts`                  | Require login (redirects)                        |
| `requireInstructor()` / `requireAdministrator()` | `lib/auth.ts`                  | Role-gated server pages                          |
| `getCurrentClient()`                             | `lib/auth.ts`                  | Authenticated `JutgeApiClient` (throws if guest) |
| `getProblemsApiClient()`                         | `lib/auth.ts`                  | Problem endpoints; works for guests too          |
| `getAnonymousJutgeClient()`                      | `lib/jutge-client-registry.ts` | Unauthenticated API access                       |

API types and client methods: `lib/jutge_api_client.ts` (generated — **do not edit**; run `bun run update-jutge-client`).

### Naming patterns (for search)

| Pattern                                                     | Meaning                       | Example                                       |
| ----------------------------------------------------------- | ----------------------------- | --------------------------------------------- |
| `fetch*` in `services/queries/`                             | Cached server read            | `fetchProblemDetail`, `fetchSubmissionDetail` |
| `*Row`, `*Data` in `lib/`                                   | View-model types and builders | `SubmissionRow`, `ProblemDetailData`          |
| `*View` in `components/`                                    | Page-level or section UI      | `SubmissionDetailView`, `ProblemsSearchView`  |
| `*Card`                                                     | Card-wrapped section          | `ScoringCard`, `ProblemHeaderCard`            |
| `*Action` in `actions/`                                     | Server action                 | `submitSolutionAction`                        |
| `renderAuthed` / `renderInstructor` / `renderAdministrator` | Auth gate wrappers            | `lib/renderAuthed.tsx`                        |

### Protected and generated files

- **Never edit:** `components/ui/**`, `lib/jutge_api_client.ts`
- **Regenerate API client:** `bun run update-jutge-client`
- **Feature migration notes:** `docs/problem-todo.md` (problem detail parity with legacy site)

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->
