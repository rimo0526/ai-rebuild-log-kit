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
npm start -- review --file ./draft.txt
npm start -- review --stdin
npm start -- review --text "I earned instant passive income with one prompt" --json
npm start -- version
```

Or run directly:

```bash
node src/cli.js demo
node src/cli.js guardrails
node src/cli.js review --text "I earned instant passive income with one prompt"
node src/cli.js review --file ./draft.txt
node src/cli.js review --stdin
node src/cli.js review --text "I earned instant passive income with one prompt" --json
node src/cli.js version
```

Pipe saved or generated drafts into the reviewer:

```bash
cat draft.txt | node src/cli.js review --stdin
```

## Example

```bash
node src/cli.js review --file ./draft.txt
```

Output:

```text
Status: WARN
Summary: 2 review warning(s) found.

[WARN] Avoid invented income or results claims
  - Remove or verify any claim about money, sales, or outcomes.
[PASS] Avoid invented approval or endorsement claims
[WARN] Avoid get-rich-quick framing
  - Replace hype with a concrete, reviewable lesson.
[PASS] Avoid shame-based advice
```

## Commands

```bash
node src/cli.js demo
node src/cli.js guardrails
node src/cli.js review --text "..."
node src/cli.js review --file ./draft.txt
node src/cli.js review --stdin
node src/cli.js review --text "..." --json
node src/cli.js version
node src/cli.js log
node src/cli.js post --topic "..." --lesson "..."
node src/cli.js note --topic "..." --lesson "..."
```

`guardrails` prints the safety constraints by themselves so they can be reviewed or reused in another local workflow.
`review` runs a lightweight local check against obvious risky claims before a human approves the draft for posting or publishing.
`review --file` reads a saved local draft file, strips an optional UTF-8 BOM, and reviews that content with the same guardrails.
`review --stdin` reads piped draft text from standard input so other local scripts can send content directly into the same review flow.
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
