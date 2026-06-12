# @jenie/ai-tools

OpenCode skill library for task-driven development: browse, validate, and implement user stories and bugs using INVEST + 3C and TDD.

## Installation

```bash
npm install @jenie/ai-tools
```

## Configuration

Add the plugin to your opencode configuration (`opencode.json` or `opencode.jsonc`):

```json
{
  "plugin": ["./node_modules/@jenie/ai-tools/plugin.mjs"]
}
```

This auto-registers the skills directory and four `/jenie:*` commands.

## Commands

| Command | Description |
|---------|-------------|
| `/jenie:prepare-for-wishes` | Entry point — loads global config, analyzes project technical context |
| `/jenie:list-tasks` | Browse available tasks (user stories or bugs) from `docs/` |
| `/jenie:analyze-task` | Validate a task with INVEST + 3C consistency checks |
| `/jenie:implement-task` | Implement a validated task — branch, TDD, commit, lint |

## Project structure

Tasks live in `<project_root>/docs/user-stories/` and `<project_root>/docs/bugs/`. Technical context is generated into `<project_root>/.jenie/technical-context.md`, validation results into `<project_root>/.jenie/.validation-registry.json`.

## Skills

- **prepare-for-wishes** — loads global guidelines, analyzes the project's tech stack and conventions, then asks what to do
- **list-tasks** — paginates available tasks with descriptions
- **analyze-task** — validates a task against INVEST + 3C, checks correctness, assesses doability
- **implement-task** — verifies repo + validation recency, creates a feature branch, runs TDD, implements, lints, commits
