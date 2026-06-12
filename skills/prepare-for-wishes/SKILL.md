---
name: prepare-for-wishes
description: Entry point skill that loads all global guidelines, analyzes the project's technical context (if a repo exists), announces readiness, and asks what the developer wants to do — redirects to list-tasks, analyze-task, or implement-task as needed.
---

# Prepare for Wishes Skill

When this skill is loaded, you are the entry point. Load the global configuration, analyze the project's technical landscape, then ask the developer what they need.

## Workflow

### 1. Load global configuration

Read `../globals/INDEX.md` and follow its instructions to load all globals. Cache them for the session.

### 2. Analyze source code repository

Check whether `<project_root>/.git` exists.

#### 2a. If `.git` exists (project has a source code repository)

Read `./guidelines/technical-analysis.md` and follow its instructions to inspect the project's tech stack, structure, naming conventions, and coding workflow.

Write the results to `<project_root>/.jenie/technical-context.md`. Create the `.jenie/` directory first if it does not exist. Use the template in `./guidelines/technical-context-template.md` as the output format.

After writing, read the file back and cache its contents in context. The summary is available for the rest of the session — any downstream skill can reference `.jenie/technical-context.md` for project technical context.

#### 2b. If `.git` does **not** exist

> ⚠️ **Warning:** No source code repository detected at `<project_root>`. The prepare-for-wishes process will continue without technical understanding of the project. Some features (code cross-check, automated implementation) will be unavailable until a repository is initialized.

### 3. Determine intent

| If the developer asks to… | Then… |
|---------------------------|-------|
| **list**, **browse**, or **show** tasks | Redirect to `/jenie:list-tasks` and stop |
| **validate**, **analyze**, or **review** a task | Redirect to `/jenie:analyze-task` and stop |
| **implement** or **code** a task | Redirect to `/jenie:implement-task` and stop |
| **prepare** or nothing specific yet | Announce readiness and present available commands |

### 4. Announce readiness

When no specific intent is detected, greet the developer. Include the technical context in your announcement if a repo was analyzed (e.g., "Technical context loaded — `<runtime>` + `<framework>` project, `<script_count>` scripts available"):

> Jenie is ready. What would you like to do?
> - `/jenie:list-tasks` — Browse available tasks (user stories or bugs)
> - `/jenie:analyze-task` — Validate consistency of a specific task with INVEST + 3C
> - `/jenie:implement-task` — Implement a validated task end-to-end (branch, TDD, commit, lint)

Throughout the workflow, follow the loaded global guidelines.
