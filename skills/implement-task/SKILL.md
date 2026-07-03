---
name: implement-task
description: Implement a validated task end-to-end. Checks that analyze-task ran within the last hour, then branches, writes tests (TDD), implements, commits, lints, and commits again.
---

# Implement Task Skill

When this skill is loaded, you help the developer implement a validated task (user story or bug) from start to finish — branching, TDD, implementation, linting, and committing.

> **Command syntax:** jenie commands are written here as `/jenie <name>`. In OpenCode use them as-is (e.g., `/jenie prepare-for-wishes`); in Claude Code they are namespaced with a colon (e.g., `/jenie:prepare-for-wishes`). Always show the developer the syntax that matches the current environment.

## Pre-condition

### 1. Load Global Guidelines

Read `../globals/INDEX.md` and follow its instructions to load all globals. Cache them for the session. This must complete before any workflow step.

### 2. Verify repository exists

Check whether a `.git` directory exists at the project root (`<project_root>/.git` — use `ls` or `test -d`). If it does not — there is no repository and no code to modify — inform the developer and **stop**. Do not proceed.

### 3. Load technical context

Check whether `<project_root>/.jenie/technical-context.md` exists (use `ls` or `test -f`).

- **If it exists:** Read the file and cache its contents as the session's technical reference. The information within (scripts, naming conventions, project structure, workflow) should guide implementation decisions throughout all subsequent steps.
- **If it does not exist:** This is a blocker. Tell the developer:
  > ⚠️ **Technical context not found.** The file `.jenie/technical-context.md` is required for implementation (it provides project structure, scripts, naming conventions, and workflow rules). Please run `/jenie prepare-for-wishes` first to generate it.

  **Stop.** Do not proceed with implementation.

## Workflow

### 1. Determine the task to implement

Ask the developer which task they want to implement — a file path or a reference to a task from `docs/`. If they're unsure, suggest using `/jenie list-tasks` first to browse and stop.

Once you have the task file path, read the full task file so you know its acceptance criteria and details. If the developer does not provide a task after the prompt, inform them that implementation cannot proceed without a task and **stop**.

### 2. Check validation recency

1. Read `<project_root>/.jenie/.validation-registry.json`. If the file does not exist or contains invalid JSON, no validation has been recorded.
2. Find an entry whose `path` matches the task file path (relative to project root).
3. Determine the current UTC time. If **no entry exists** or the entry's `timestamp` is **older than 1 hour** from the current time:
   - Tell the developer the task needs re-validation (it was never validated or the validation expired).
    - Redirect to `/jenie analyze-task` and **stop**.
4. If the entry's `status` is **not** `"consistent-doable"`:
   - Inform the developer the task did not pass validation (status: `<status>`).
   - Ask if they want to refine the task and re-validate, or stop. Do **not** proceed with implementation.
5. If the entry's `status` is `"consistent-doable"` and the timestamp is within the last hour — proceed.

### 3. Create a feature branch

Read `./guidelines/git.md` and follow its branch naming and working tree conventions. Cache the git conventions for later steps.

Before creating the branch, check whether a remote named `origin` exists (`git remote get-url origin`). If it does, check whether the branch exists on the remote (`git ls-remote --heads origin <prefix>/<description>`). If it exists, ask the developer how to proceed (reuse, rename, or delete). If no `origin` remote exists, skip the remote check and proceed.

### 4. Write test cases from acceptance criteria (TDD)

Read `./guidelines/tdd.md` and follow its TDD process: extract criteria, discover test infrastructure, write tests (red phase), then implement (green phase).

### 5. Functional commit

Once all tests are green, follow the functional commit conventions from the cached git guidelines (`./guidelines/git.md`).

### 6. Quality check

Read `./guidelines/quality-check.md` and run all checks — linting, type-checking, security, and manual code review. Fix every issue found.

### 7. Final verification

1. Run the tests again — confirm all are still green.
2. If any regression was introduced, fix before proceeding.

### 8. Quality commit

Follow the quality commit conventions from the cached git guidelines (`./guidelines/git.md`).

### 9. Report

Tell the developer:
- **Branch name**
- **What was implemented** (one-line summary)
- **Test results** (all green)
- **Linting/quality results** (what was checked, what was fixed)
- **Commit SHAs** (short form, e.g., `a1b2c3d`)

Throughout the workflow, follow the loaded global guidelines.
