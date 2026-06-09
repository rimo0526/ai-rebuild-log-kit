# AI Rebuild Log Kit

AI Rebuild Log Kit is a small local-first toolkit for people who are using AI to rebuild messy personal workflows: debt recovery, spending reviews, side-project logs, writing drafts, and social updates.

It does not auto-post. It generates reviewable drafts so a human can edit before publishing.

## Why this exists

Many AI productivity examples assume a clean starting point. This project is for the opposite case: rebuilding from debt, failed routines, scattered notes, and unfinished experiments.

The first use case is simple:

- Record a daily recovery log.
- Convert it into a short X post draft.
- Convert it into a longer note outline.
- Keep the tone honest, useful, and not overhyped.

## Features

- X post draft generator
- Daily rebuilding log template
- Note/article outline generator
- Safety guardrails for claims and tone
- Local-only CLI with no account connection

## Quick Start

```bash
npm install
npm run demo
npm start -- guardrails
npm start -- review --text "I earned instant passive income with one prompt"
npm start -- review --text "I earned instant passive income with one prompt" --json
npm start -- version
```

Or run directly:

```bash
node src/cli.js demo
node src/cli.js guardrails
node src/cli.js review --text "I earned instant passive income with one prompt"
node src/cli.js review --text "I earned instant passive income with one prompt" --json
node src/cli.js version
```

## Example

```bash
node src/cli.js post --topic "AI subscription cost" --lesson "Decide what the tool must save or produce before paying"
```

Output:

```text
AI subscription costについて書いてみて思ったこと。

勢いだけで増やすと、あとから苦しくなります。
Decide what the tool must save or produce before paying.

派手な話より先に、まずは小さく続けられる形に戻します。
```

## Commands

```bash
node src/cli.js demo
node src/cli.js guardrails
node src/cli.js review --text "..."
node src/cli.js review --text "..." --json
node src/cli.js version
node src/cli.js log
node src/cli.js post --topic "..." --lesson "..."
node src/cli.js note --topic "..." --lesson "..."
```

`guardrails` prints the safety constraints by themselves so they can be reviewed or reused in another local workflow.
`review` runs a lightweight local check against obvious risky claims before a human approves the draft for posting or publishing.
`review --json` prints the same review result as structured JSON so local scripts can consume it without parsing the human-readable report.
`version` prints the current CLI package version so releases and bug reports can reference the exact installed build.

## Project Principles

- Human review before publishing
- No fake income claims
- No get-rich-quick framing
- No shame-based advice
- Prefer small repeatable systems over dramatic promises

## Open Source Maintenance Use

This repository is intended to be maintained as a small public toolkit. Codex can help with:

- improving templates
- reviewing pull requests
- adding tests
- maintaining release notes
- documenting new workflows

## License

MIT
