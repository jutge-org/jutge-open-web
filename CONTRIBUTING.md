# Contributing to Jutge Open Web

Thank you for helping improve the open web client for [Jutge.org](https://jutge.org).

## Ways to contribute

- **Code** — bug fixes, UI polish, new features, accessibility improvements
- **Documentation** — README, in-app docs under `content/`, clearer onboarding
- **Issues** — reproducible bug reports and focused feature proposals
- **Review** — thoughtful feedback on open pull requests

## Getting started

1. Fork the repository and clone your fork.
2. Follow the [Quick start](README.md#quick-start) in the README.
3. Create a branch from `main` for your work.
4. Make focused changes that match existing conventions.

## Coding conventions

Read [AGENTS.md](AGENTS.md) before editing. In short:

- Component names use PascalCase.
- Lucide icons use an `Icon` suffix (for example, `SendIcon`).
- All icon buttons must have a tooltip.
- Ensure standard accessibility on pages and components.
- Problem ids and submission ids are URL-friendly; do not encode them.
- Do not use a monospace font for ids.
- Prefer `fs/promises` over `fs` for file I/O.

## Files you should not edit

- **`components/ui/`** — shared shadcn UI primitives; do not modify them in this repo.
- **`lib/jutge_api_client.ts`** — generated from the Jutge API; regenerate instead of editing by hand.

To refresh the API client:

```bash
bun run update-jutge-client
```

This requires the global `@jutge.org/cli` package (see README).

## Pull request guidelines

1. **Scope** — one logical change per pull request when possible.
2. **Describe** — explain what changed and why. Link related issues.
3. **Check** — run before pushing:

    ```bash
    bun run format && bun run lint && bun run build
    ```

4. **Discuss first** — open an issue before large refactors or architectural changes.

## Reporting bugs

Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.yml) and include:

- Steps to reproduce
- Expected vs actual behavior
- Browser and environment when relevant

## Proposing features

Use the [feature request template](.github/ISSUE_TEMPLATE/feature_request.yml). Explain the user problem, not only the solution you have in mind.

## Accessibility

If you report an accessibility barrier, use the [accessibility issue template](.github/ISSUE_TEMPLATE/accessibility.yml). Improvements that meet WCAG expectations are especially welcome.

## Academic integrity

Jutge.org is an educational platform. Contributions must respect the [Honor Code](https://jutge.org/about/honor-code). Do not add features that undermine fair use in courses or exams.

## License

By contributing, you agree that your contributions will be licensed under the same [Apache License 2.0](LICENSE) as the project.
