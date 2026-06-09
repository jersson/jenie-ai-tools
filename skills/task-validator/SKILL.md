---
name: task-validator
description: Validate user stories and bugs for consistency and doability using INVEST + 3C frameworks. Checks code presence before proceeding — offers code-level validation or warns if no repo exists.
---

# Task Validator Skill

When this skill is loaded, you help the developer validate a task (user story or bug) before they start implementation.

First, load general guidelines from `../globals/` — read `../globals/efficiency.md`, `../globals/formatting.md`, and `../globals/safety.md`. Cache these for the session.

## Workflow

### 1. Determine task type

Ask the developer: **Is this a user story or a bug?**

Based on their answer, load the appropriate checklist:
- User story → read `./guidelines/user-story/checklist.md` and `./guidelines/user-story/template.md`
- Bug → read `./guidelines/bug/checklist.md` and `./guidelines/bug/template.md`

### 2. List available tasks

Look in `docs/{type}s/` (e.g. `docs/user-stories/` or `docs/bugs/`) for existing task files. List them to the developer and ask which one they want to validate, or if they want to paste a new task instead.

If files are found, present them as a numbered list. If the folder doesn't exist or is empty, inform the developer and ask them to paste the task directly.

### 3. Read the task

Read the selected file from `docs/{type}s/` or use what the developer pastes. Compare it against the loaded checklist.

### 4. Check code presence

Determine if the project has a codebase by checking whether a `.git` directory exists (e.g. `ls .git` or `git rev-parse --git-dir`).

| If the project… | Then… |
|----------------|--------|
| **Has a git repository** | Ask the developer if they want to validate consistency against the actual code — search for existing implementations, similar patterns, relevant models/controllers/components, and check if the task aligns with the current architecture. |
| **Has no git repository** | Warn clearly: *No codebase found — there is no code to implement against. Without code, no next steps (implementation, task breakdown, or drafting) are possible.* Stop and ask them to set up a repository first. |

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

Structure your response following `../globals/formatting.md` conventions (no preamble, scannable sections, markdown tables where useful).

Always include these three sections:

**Status:** ✅ Consistent & Doable / ⚠️ Needs Work / ❌ Blocked

**Validation Summary:**
Bullet-list of what passes and what's missing, organized by INVEST and 3Cs.

**Recommendation:**
Clear next step or suggested fixes.

Throughout the workflow, follow `../globals/safety.md` — verify files exist before reading, don't assume libraries, stop on ambiguity, never propose destructive actions without confirmation. Follow `../globals/efficiency.md` — batch reads, use targeted grep over full-file scans, avoid redundant re-reads.
