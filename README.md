# jutge-web-games

This file describes how to set up the project and how to use it.

## Run time dependencies

You need [bun](https://bun.sh) installed.

## Environment

Put these in a `.env` file in the project root (there are some examples in the `env.example` file):

- **`DATABASE_URL`**: SQLite URL for Prisma (e.g. `file:/Users/me/Databases/games.db`).
- **`AUTH_SECRET`**: Secret (≥ 32 chars) to sign session JWTs.
- **`COMPETITIONS_TOKEN`**: Jutge API token for server-side calls and `god` imports.
- **`DATA_DIR`**: Root folder for assets.
- **`JUTGE_API_URL`**: Jutge API base URL for server-side routes (default: `https://api.jutge.org/api`).
- **`NEXT_PUBLIC_JUTGE_API_URL`**: Jutge API base URL for the browser client (defaults to `JUTGE_API_URL` or `https://api.jutge.org/api`).
- **`NODE_ENV`**: Set by Next.js (`development` / `production`).
- **`JUTGE_EMAIL`**: Default email for Jutge API calls.
- **`JUTGE_PASSWORD`**: Default password for Jutge API calls.

## Dependencies

Install the dependencies:

```bash
bun install
```

Install the Jutge API client CLI:

```bash
bun add -g @jutge.org/cli
```

Update the Jutge API TypeScript client:

```bash
bun run update-jutge-client
```

## Bootstraping

Place the exported data from Jutge at `~/Databases/games/export` as json files.

Bootstrap the database (warning: this will delete the database and recreate it):

```bash
./scripts/reset.sh
```

## Development

### Start the development server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. The page auto-updates as you edit the files.

### Update the Jutge client

```bash
bun run update-jutge-client
```

### Format the code

```bash
bun run format
```

### Inspect the code

```bash
bun run lint
```

### Find unused dependencies

```bash
bun run knip
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

## Documentation

- [AGENTS.md](AGENTS.md): Project rules.
- [docs/schema.md](docs/schema.md): Database schema.
- [docs/competitions.md](docs/competitions.md): Competition UI, rounds, turns, and elimination.
- [docs/architecture.md](docs/architecture.md): Architecture of the project.
- [Jutge API](https://api.jutge.org/documentation): Jutge API documentation.

## Contributors

- [Jordi Petit](https://github.com/jordi-petit)

## Copyright

© Universitat Politècnica de Catalunya — BarcelonaTech, 2026.
