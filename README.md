# jutge-web-games

This file describes how to set up the project and how to use it.

## Run time dependencies

You need [bun](https://bun.sh) installed.

## Environment

Put these in a `.env` file in the project root (there are some examples in the `env.example` file):

- **`AUTH_SECRET`**: Secret (≥ 32 chars) to sign session JWTs.
- **`JUTGE_API_URL`**: Jutge API base URL (default: `https://api.jutge.org/api`).
- **`NODE_ENV`**: Set by Next.js (`development` / `production`).

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
- [Jutge API](https://api.jutge.org/documentation): Jutge API documentation.

## Contributors

- [Jordi Petit](https://github.com/jordi-petit)

## Copyright

© Universitat Politècnica de Catalunya — BarcelonaTech, 2026.
