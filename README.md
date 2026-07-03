# @jenie/ai-tools

Skill library for task-driven development: browse, validate, and implement user stories and bugs using INVEST + 3C and TDD.

## Skills

- **prepare-for-wishes** — loads global guidelines, analyzes the project's tech stack and conventions, then asks what to do
- **list-tasks** — paginates available tasks with descriptions
- **analyze-task** — validates a task against INVEST + 3C, checks correctness, assesses doability
- **implement-task** — verifies repo + validation recency, creates a feature branch, runs TDD, implements, lints, commits


## Requirements

- Node.js >= 18
- [OpenCode](https://opencode.ai) and/or [Claude Code](https://claude.com/claude-code) — the Claude Code installer shells out to the `claude` CLI, so it must be on your `PATH`

## Installation

> **Not yet published to npm.** Until it is, install from source:
>
> ```bash
> git clone https://github.com/jersson/jenie-ai-tools.git
> cd jenie-ai-tools
> npm link
> ```

Once published:

```bash
npm install -g @jenie/ai-tools
```

### OpenCode

```bash
cd my-project
jenie install --opencode    # repository level (current directory)
```

The installer registers the plugin in the nearest `opencode.json`, walking up from the current directory — the file is created when none exists, and an `opencode.jsonc` is converted to `opencode.json`.

Restart OpenCode afterwards — plugins are loaded at startup.

**How the commands appear:** `/jenie` (entry point, defaults to prepare-for-wishes), `/jenie prepare-for-wishes`, `/jenie list-tasks`, `/jenie analyze-task`, `/jenie implement-task`.

### Claude Code

```bash
cd my-project
jenie install --claude-code             # repository level (current directory)
jenie install --claude-code --global    # global (user scope, all projects)
```

Without `--global`, the installer works at repository level: it writes `extraKnownMarketplaces` and `enabledPlugins` into `./.claude/settings.json`. Commit that file and teammates get prompted to install the plugin automatically when they open the project. With `--global`, the plugin is installed at user scope for all projects and the current directory doesn't matter.

The installer:

1. Ensures `.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json` exist in the package — created if missing; an existing `marketplace.json` gets the jenie entry merged in without touching other entries.
2. Registers the package directory as a plugin marketplace and installs `jenie@jenie` through the `claude` CLI.
3. Removes any legacy `.claude/skills/jenie` install left by older versions (only after the plugin install succeeds).

Restart Claude Code afterwards (exit and run `claude` again) — plugins are discovered at startup.

**How the commands appear:** the command picker lists skills by their short name with the plugin as a label — `/prepare-for-wishes (jenie)`, `/list-tasks (jenie)`, `/analyze-task (jenie)`, `/implement-task (jenie)`. The namespaced form `/jenie:<skill-name>` also works when typed, but Claude Code only *displays* it when another plugin defines a skill with the same name.

Alternatively, without npm or the `jenie` CLI (requires the `.claude-plugin/` manifests to be committed to the repo):

```bash
claude plugin marketplace add jersson/jenie-ai-tools
claude plugin install jenie@jenie
```

## Uninstall

```bash
jenie uninstall --opencode                # repository level (current directory)
jenie uninstall --claude-code             # repository level (current directory)
jenie uninstall --claude-code --global    # global (user scope)
```

The Claude Code variant uninstalls the plugin, removes the marketplace registration, and cleans up legacy installs.

## Project structure

Tasks live in `<project_root>/docs/user-stories/` and `<project_root>/docs/bugs/`. Technical context is generated into `<project_root>/.jenie/technical-context.md`, validation results into `<project_root>/.jenie/.validation-registry.json`.

