# Apex Feature Kit

> by [Abdo AR](https://abdoar.com)

[![npm version](https://img.shields.io/npm/v/@abdoar/apex-feature-kit.svg)](https://www.npmjs.com/package/@abdoar/apex-feature-kit) [![license](https://img.shields.io/npm/l/@abdoar/apex-feature-kit.svg)](https://github.com/AbdoAR/apex-feature-kit/blob/main/LICENSE)

Feature-Driven Development CLI for AI-agent execution — empowering startups to ship production-ready features, fast.

---

## Overview

Feature-Driven Development (FDD) is a structured approach to building software where every piece of work is defined as a self-contained feature spec before a single line of code is written. Apex Feature Kit brings this discipline to AI-agent workflows: instead of prompting an AI with vague instructions and hoping for the best, you give it a precise, exhaustive blueprint that any developer — junior or senior, human or AI — can pick up and implement immediately.

The CLI itself is intentionally minimal. Two commands: `init` to scaffold the `.features/` directory and inject slash commands into your IDE, and `sync` to auto-complete features when all tasks are verified done. Everything else — creating specs, implementing features, verifying implementations, updating requirements — is handled by the AI agent through slash commands inside your editor.

Why does this exist? Because startups need to move fast without sacrificing quality. When AI agents write code from unstructured prompts, the result is unpredictable. FDD gives the agent a structured, self-contained spec so every feature is spec'd, implementable, and verifiable by anyone. No ambiguity, no guesswork — just a clear path from idea to production-ready code.

---

## Quick Start

```bash
npm install -g @abdoar/apex-feature-kit
apex-feature-kit init all
```

This scaffolds the `.features/` directory and injects slash commands into both Kilo Code and Cursor. Your project will look like this:

```
your-project/
├── .features/
│   ├── tree.yaml           # Master index of all features
│   ├── instructions.md     # AI protocol & spec format rules
│   └── specs/              # Feature spec files live here
├── .kilo/commands/         # Slash commands for Kilo Code
│   ├── new-feature.md
│   ├── implement-feature.md
│   ├── verify-feature.md
│   └── update-feature.md
└── .cursor/commands/       # Slash commands for Cursor
    ├── new-feature.md
    ├── implement-feature.md
    ├── verify-feature.md
    └── update-feature.md
```

---

## CLI Commands

### `init <platform>`

Scaffolds the `.features/` directory and injects slash commands into the target IDE platform.

**Platforms:**

| Platform | Directory | Description |
|---|---|---|
| `kilo` | `.kilo/commands/` | Kilo Code IDE |
| `cursor` | `.cursor/commands/` | Cursor IDE |
| `all` | Both | Inject into both platforms |

**Idempotent:** Running `init` multiple times will not overwrite existing files. If a slash command or config file already exists, it is skipped.

```bash
apex-feature-kit init kilo
apex-feature-kit init cursor
apex-feature-kit init all
```

### `sync`

Scans all spec files in `.features/specs/`, cross-references them with `.features/tree.yaml`, and auto-completes any feature where all implementation tasks are marked `[x]`. This is the only mechanism that sets `completed_at` — the AI never writes it manually.

```bash
apex-feature-kit sync
```

Output:

```
════════════════════════════════════
  APEX FEATURE KIT — SYNC
════════════════════════════════════

  Synced 5 features
  ✓ 2 completed  |  ○ 3 in progress  |  +1 new spec indexed
```

---

## Slash Commands

These are AI agent commands invoked inside your IDE's chat, not terminal commands. They live in `.kilo/commands/` or `.cursor/commands/` and are discovered automatically by the IDE.

| Command | Description |
|---|---|
| `/new-feature` | Create a comprehensive feature spec from context and codebase analysis |
| `/implement-feature` | Build the feature from its spec, marking tasks complete as you go |
| `/verify-feature` | Audit the implementation against the spec — find gaps and regressions |
| `/update-feature` | Modify an existing spec's details, files, schema, or tasks |

Usage: type the command followed by your context. The AI never asks for additional input — it extracts everything from your message.

```text
/new-feature I need an auth system with OAuth2 support for Google and GitHub
/implement-feature auth system
/verify-feature auth system
/update-feature auth system — add password reset flow
```

---

## FDD Workflow

1. **Create** — `/new-feature {context}` — The AI analyzes your codebase, then writes a comprehensive spec covering files, schemas, APIs, dependencies, and ordered implementation tasks. The spec is self-contained: a junior developer or a different AI can implement the feature by reading it alone.

2. **Implement** — `/implement-feature {context}` — The AI reads the spec and builds the feature in task order, marking each `[x]` as it's verified.

3. **Verify** — `/verify-feature {context}` — The AI audits the implementation against the spec: are all files created? Do types match? Do endpoints match? Are there regressions? Falsely completed tasks get unmarked.

4. **Update** — `/update-feature {context}` — Modify the spec when requirements change. The AI re-analyzes the codebase to keep the spec grounded in reality.

5. **Complete** — `apex-feature-kit sync` — The CLI scans specs and auto-stamps `completed_at` in `tree.yaml` when all tasks are checked. This is the only way completion is recorded — no manual edits.

---

## Directory Structure

After running `apex-feature-kit init all`:

```
.features/
├── tree.yaml              # Master index — tracks all features, IDs, and completion status
├── instructions.md        # AI protocol — rules for how the AI operates within FDD
└── specs/                 # Feature spec files (YYYYMMDDHHmm-slug-name.md)

.kilo/commands/            # Slash commands for Kilo Code
├── new-feature.md
├── implement-feature.md
├── verify-feature.md
└── update-feature.md

.cursor/commands/          # Slash commands for Cursor
├── new-feature.md
├── implement-feature.md
├── verify-feature.md
└── update-feature.md
```

Spec filenames use a timestamp-prefix convention to prevent merge conflicts and ensure sortability: `202605121730-auth-system.md`, `202605140930-user-profile-page.md`.

---

## Feature Spec Format

Every feature spec follows the same structure — no exceptions. A spec is a self-contained blueprint that anyone can implement from:

| Section | Purpose |
|---|---|
| **Overview** | What the feature does and why — plain English |
| **Technical Context** | Tech stack, project structure, existing patterns — grounded in the real codebase |
| **Files to Create** | Every new file with full path and purpose |
| **Files to Modify** | Every existing file with specific changes |
| **Data Schema** | Database models, TypeScript types, interfaces |
| **API / Interface** | Endpoints, function signatures, public APIs |
| **Dependencies** | New packages needed (only what's not already installed) |
| **Implementation Tasks** | Ordered checklist grouped by phase — specific enough for a junior developer |
| **Definition of Done** | Quality gates that must all pass before the feature is complete |
| **Notes** | Constraints, decisions, pitfalls |

The AI writes specs by first analyzing the codebase, then producing content that reflects the actual project — not assumptions. No placeholder sections, no vague tasks.

---

## Development

```bash
npm run build          # Compile TypeScript to dist/
npm run dev            # Run via tsx (no compile step)
npm link               # Global symlink for local testing
```

After `npm link`, the `apex-feature-kit` command is available globally. Test against a sample project:

```bash
mkdir /tmp/test-project && cd /tmp/test-project
npm init -y
apex-feature-kit init all
apex-feature-kit sync
```

---

## Author & Links

**Abdo AR** — Co-Founder & CTO | Software Engineer & UI/UX Expert

Empowering startups to build market-ready digital products — fast, scalable, and cost-effective.

- [abdoar.com](https://abdoar.com)
- [GitHub](https://github.com/AbdoAR)
- [LinkedIn](https://linkedin.com/in/abdoar)
- [Upwork](https://www.upwork.com/freelancers/abdoar) — Top Rated (top 10%)

---

## License

[MIT](https://github.com/AbdoAR/apex-feature-kit/blob/main/LICENSE)
