---
name: list-tasks
description: Browse available tasks (user story or bug) from the project's docs/ folder. Lists them for selection, then hands off to analyze-task for deeper validation.
---

# List Tasks Skill

When this skill is loaded, you help the developer browse available tasks (user stories or bugs) stored in `<project_root>/docs/` folder.

> **Command syntax:** jenie commands are written here as `/jenie <name>`. In OpenCode use them as-is (e.g., `/jenie analyze-task`); in Claude Code they are namespaced with a colon (e.g., `/jenie:analyze-task`). Always show the developer the syntax that matches the current environment.

## Pre-condition

### 1. Load Global Guidelines

Read `../globals/INDEX.md` and follow its instructions to load all globals. Cache them for the session. This must complete before any workflow step.

## Workflow

### 1. Determine intent

If the developer asks to **validate** or **analyze** a specific task (e.g., "validate this user story", "analyze bug"), do not proceed with listing. Instead, tell them to use `/jenie analyze-task` for that and stop.

If they want to **list**, **browse**, or **show** tasks, proceed.

### 2. Determine task type

If the developer already stated the type (e.g., "list available bugs"), infer it directly — **do not ask**.

Otherwise, ask: **Is this a user story or a bug?**

### 3. Locate tasks folder

Look in `<project_root>/docs/{type}s/` (e.g. `<project_root>/docs/user-stories/` or `<project_root>/docs/bugs/`). If the folder doesn't exist or is empty, ask the developer for an alternative location to browse (e.g., another directory or a specific file path). If they provide one, update the search path and continue. If they don't, inform them no tasks can be listed and **stop**.

### 4. List available tasks

Read the files found in the folder (use `glob` to list them, then `read` each). For each file, extract a short description — read the first 5 lines or until the first blank line to get the title or narrative (e.g., the "As a… I want…" line). Present them as a numbered list with the description.

**Pagination:**
- If there are **more than 5 items**, show the first 5 and ask: *"Show the next 5?"* Repeat until all are shown.
- If there are **more than 15 items**, after paginating, suggest: *"There are many tasks — consider using a more specific search (e.g., grep for a keyword) inside the folder to narrow down."*

### 5. Next steps

After listing, ask: **Which task would you like to analyze?** When they pick one, suggest using `/jenie analyze-task` to validate it with INVEST + 3C.

Throughout the workflow, follow the loaded global guidelines.
