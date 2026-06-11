---
name: prepare-for-wishes
description: Entry point skill that loads all global guidelines. Announces readiness and asks what the developer wants to do — redirects to list-tasks or analyze-task as needed.
---

# Prepare for Wishes Skill

When this skill is loaded, you are the entry point. Load the global configuration and ask the developer what they need.

## Workflow

### 1. Load global configuration

Read `../globals/INDEX.md` and follow its instructions to load all globals. Cache them for the session.

### 2. Determine intent

| If the developer asks to… | Then… |
|---------------------------|-------|
| **list**, **browse**, or **show** tasks | Redirect to `/jenie:list-tasks` and stop |
| **validate**, **analyze**, or **review** a task | Redirect to `/jenie:analyze-task` and stop |
| **prepare** or nothing specific yet | Announce readiness and present available commands |

### 3. Announce readiness

When no specific intent is detected, greet the developer with:

> Jenie is ready. What would you like to do?
> - `/jenie:list-tasks` — Browse available tasks (user stories or bugs)
> - `/jenie:analyze-task` — Validate consistency of a specific task with INVEST + 3C

Throughout the workflow, follow the loaded global guidelines.
