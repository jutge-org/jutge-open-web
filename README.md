# Jutge Open Web

The open-source web client for [Jutge.org](https://jutge.org) — the virtual learning environment for computer programming at UPC.

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)

Students solve programming problems, submit code, take exams, and follow courses. Instructors manage rosters, problem lists, and rankings. Administrators monitor platform health. This repository is the modern Next.js frontend; the backend is the [Jutge API](https://api.jutge.org/documentation).

## Features

| Area               | What it covers                                                          |
| ------------------ | ----------------------------------------------------------------------- |
| **Students**       | Problems, submissions, diffs, exams, courses, activity, awards, profile |
| **Instructors**    | Courses, lists, exams, problem authoring, semantic search, JutgeAI      |
| **Administrators** | Users, statistics, heatmaps, queue, rankings                            |
| **Platform**       | Auth, command palette, accessibility, theming, Monaco editor, xterm     |

## Tech stack

- **Runtime:** [Bun](https://bun.sh)
- **Framework:** Next.js 16 (App Router), React 19
- **Styling:** Tailwind CSS 4, shadcn-style UI
- **Notable libraries:** Monaco, xterm, ag-grid, recharts
- **API:** Generated TypeScript client via `@jutge.org/cli` (do not hand-edit `lib/jutge_api_client.ts`)

## Project layout

```
app/           → routes (App Router)
components/    → UI by domain (problems, instructor, exams, …)
services/      → queries and mutations against the API
actions/       → server actions
lib/           → shared utilities and generated API client
content/       → markdown (about, documentation)
```

See [AGENTS.md](AGENTS.md) for coding conventions.

## Quick start

### Prerequisites

You need [Bun](https://bun.sh) installed.

### 1. Install dependencies

```bash
bun install
```

Install the Jutge API client CLI (needed to regenerate the TypeScript client):

```bash
bun add -g @jutge.org/cli
```

### 2. Configure environment

Copy [env.example](env.example) to `.env` in the project root and adjust as needed:

- **`AUTH_SECRET`**: Secret (≥ 32 chars) to sign session JWTs.
- **`JUTGE_API_URL`**: Jutge API base URL (default: `https://api.jutge.org/api`).
- **`JUTGE_DOMAIN`**: Optional forwarded host header for API requests.
- **`NODE_ENV`**: Set by Next.js (`development` / `production`).

### 3. Update the API client and run

```bash
bun run update-jutge-client
bun run dev
```

Open [http://localhost:3000](http://localhost:3000). The page auto-updates as you edit files.

## Development

### Format the code

```bash
bun run format
```

### Lint

```bash
bun run lint
```

### Find unused dependencies

```bash
bun run knip
```

### Before opening a pull request

```bash
bun run format && bun run lint && bun run build
```

## Production

Build the production version:

```bash
bun run build
```

Start the production server:

```bash
bun run start
```

## Contributing

We welcome contributions. You can:

- Pick a [good first issue](https://github.com/jutge-org/jutge-open-web/issues?q=is%3Aissue+is%3Aopen+label%3A%22good%20first%20issue%22)
- Fix bugs and polish the UI
- Improve accessibility
- Improve docs and onboarding
- Report issues with clear reproduction steps

Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request. Open an issue before large refactors; small, focused pull requests are easier to review.

## Related projects

- [Jutge API](https://api.jutge.org/documentation) — backend API and documentation
- [jutge-vscode](https://github.com/jutge-org/jutge-vscode) — VS Code extension
- [jutge-toolkit](https://github.com/jutge-org/jutge-toolkit) — official Jutge toolkit
- [jutge-org on GitHub](https://github.com/jutge-org/) — all Jutge.org repositories
- [Publications about Jutge.org](https://jutge.org/about/publications) — research and papers

## Documentation

- [AGENTS.md](AGENTS.md) — project rules for contributors and coding agents
- [CONTRIBUTING.md](CONTRIBUTING.md) — how to contribute
- [Jutge API documentation](https://api.jutge.org/documentation)
- In-app docs at `/documentation` when running locally

## Contributors

Jutge.org has been built and maintained over many years by a large team. See [Credits on Jutge.org](https://jutge.org/about/credits) for the full list.

Current maintenance:

- [Jordi Petit](https://github.com/jordi-petit)
- [Pau Fernández](https://github.com/pauek)

## License

Copyright © Universitat Politècnica de Catalunya — BarcelonaTech, 2026.

Licensed under the [Apache License, Version 2.0](LICENSE).
