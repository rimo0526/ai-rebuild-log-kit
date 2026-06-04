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
```

Or run directly:

```bash
node src/cli.js demo
```

## Example

```bash
node src/cli.js post --topic "AI subscription cost" --lesson "Decide what the tool must save or produce before paying"
```

Output:

```text
AIに課金して分かったこと。

便利だった、で終わると普通に趣味費。
何を減らすか、何を作るか、どこで回収するかまで決めてやっと再建費になる。

派手に勝つ前に、同じミスで負けない仕組みを作ります。
```

## Commands

```bash
node src/cli.js demo
node src/cli.js log
node src/cli.js post --topic "..." --lesson "..."
node src/cli.js note --topic "..." --lesson "..."
```

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
