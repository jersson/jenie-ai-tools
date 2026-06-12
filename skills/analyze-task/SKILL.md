---
name: analyze-task
description: Validate consistency of the selected task (user story or bug) using INVEST + 3C frameworks. Reads a task file or pasted content, checks code presence, then validates and assesses doability.
---

# Analyze Task Skill

When this skill is loaded, you help the developer validate a task (user story or bug) before they start implementation. Use `/jenie:list-tasks` first if they need to browse available tasks.

## Pre-condition: Load Global Guidelines

Read `../globals/INDEX.md` and follow its instructions to load all globals. Cache them for the session. This must complete before any workflow step.

## Workflow

### 1. Determine intent

If the developer asks to **list**, **browse**, or **show** tasks (e.g., "list bugs", "show available user stories"), do not proceed with analysis. Instead, tell them to use `/jenie:list-tasks` for that and stop.

If they want to **validate** or **analyze** a specific task, proceed.

### 2. Determine task type

If the developer already stated the type (e.g., "validate this user story"), infer it directly — **do not ask**.

Otherwise, ask: **Is this a user story or a bug?**

Load the appropriate checklist:
- User story → read `./guidelines/user-story/checklist.md` and `./guidelines/user-story/template.md`
- Bug → read `./guidelines/bug/checklist.md` and `./guidelines/bug/template.md`

### 3. Read the task

Read the task file from `<project_root>/docs/{type}s/` or use what the developer pastes. Compare it against the loaded checklist.

### 4. Validate correctness

**4a. Content correctness (always runs)** — Analyze the task itself for logical consistency, domain accuracy, and internal contradictions:
- Do the acceptance criteria conflict with each other?
- Is the role appropriate for the action described?
- Does the benefit logically follow from the action?
- Are there implicit assumptions that should be explicit?
- For bugs: do the steps to reproduce actually lead to the described behavior?

**4b. Code cross-check (only if a codebase exists)** — Check whether a `.git` directory exists. If it does, additionally search the codebase for referenced roles, entities, actions, or UI elements to confirm they exist. Flag domain mismatches (e.g., "As an admin" when no admin module exists).

Report findings as a **Correctness** section.

### 5. Validate against the checklist

For each criterion in the INVEST table and the 3Cs table, assess whether the task satisfies it. Be honest — flag missing or weak areas.

Also run the **consistency checks** from the relevant checklist file.

### 6. Assess doability

Consider:
- Is the task small enough to complete in a single sprint?
- Are acceptance criteria unambiguous and testable?
- Are there obvious external blockers or missing context?
- Is the complexity manageable (not requiring major refactoring or unknown research)?

### 7. Decision

| If the task is… | Then… |
|----------------|--------|
| **Consistent AND doable** (all or most checks pass, clear scope) | Say so, then proactively ask: *"What are the next steps? Do you want to break this into implementation tasks, start drafting the solution, or something else?"* |
| **Partially consistent OR somewhat complex** | Flag the specific issues, suggest how to fix each one, and ask if they'd like to refine before proceeding. |
| **Inconsistent OR too complex** | Explain why clearly. Provide specific suggestions (e.g., "Split into smaller stories", "Add acceptance criteria for X", "Clarify the expected behavior"). Ask if they'd like help reformulating. |

### 8. Output format

Structure your response following the loaded global guidelines (no preamble, scannable sections, markdown tables where useful).

Always include these four sections:

**Status:** ✅ Consistent & Doable / ⚠️ Needs Work / ❌ Blocked

**Correctness:**
Summary of content-level findings (logical consistency, contradictions, assumptions) and code cross-check results (if a codebase exists).

**Validation Summary:**
Bullet-list of what passes and what's missing, organized by INVEST and 3Cs.

**Recommendation:**
Clear next step or suggested fixes.

### 9. Persist validation result

Write the validation outcome to `<project_root>/.validation-registry.json` so downstream skills (e.g., `implement-task`) can check recency and result.

1. Read `<project_root>/.validation-registry.json`. If missing, start with `{"tasks": []}`.
2. Find any existing entry with the same `path` and replace it; otherwise append.
3. Each entry must include:
   - `path`: the task file path relative to project root
   - `type`: `"user-story"` or `"bug"`
   - `status`: `"consistent-doable"`, `"needs-work"`, or `"blocked"` — must match the **Status** line from your output
   - `timestamp`: current UTC ISO 8601 timestamp (e.g., `2026-06-11T14:30:00.000Z`)
4. Write the file back with `write` tool.

Throughout the workflow, follow the loaded global guidelines.
