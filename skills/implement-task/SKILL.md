---
name: implement-task
description: Implement a validated task end-to-end. Checks that analyze-task ran within the last hour, then branches, writes tests (TDD), implements, commits, lints, and commits again.
---

# Implement Task Skill

When this skill is loaded, you help the developer implement a validated task (user story or bug) from start to finish — branching, TDD, implementation, linting, and committing.

## Pre-condition: 

### 1. Load Global Guidelines

Read `../globals/INDEX.md` and follow its instructions to load all globals. Cache them for the session. This must complete before any workflow step.

### 2. Verify repository exists

Check whether a `.git` directory exists at the project root (`<project_root>/.git`). If it does not — there is no repository and no code to modify — inform the developer and **stop**. Do not proceed.

## Workflow

### 1. Determine the task to implement

Ask the developer which task they want to implement — a file path or a reference to a task from `docs/`. If they're unsure, suggest using `/jenie:list-tasks` first to browse and stop.

Once you have the task file path, read the full task file so you know its acceptance criteria and details.

### 2. Check validation recency

1. Read `<project_root>/.validation-registry.json`. If the file does not exist, no validation has been recorded.
2. Find an entry whose `path` matches the task file path (relative to project root).
3. Determine the current UTC time. If **no entry exists** or the entry's `timestamp` is **older than 1 hour** from the current time:
   - Tell the developer the task needs re-validation (it was never validated or the validation expired).
   - Redirect to `/jenie:analyze-task` and **stop**.
4. If the entry's `status` is **not** `"consistent-doable"`:
   - Inform the developer the task did not pass validation (status: `<status>`).
   - Ask if they want to refine the task and re-validate, or stop. Do **not** proceed with implementation.
5. If the entry's `status` is `"consistent-doable"` and the timestamp is within the last hour — proceed.

### 3. Create a feature branch

1. Check the current git branch: `git branch --show-current`.
2. If the working tree has uncommitted changes, ask the developer to commit or stash them first. Do not proceed until clean.
3. Derive the task type from the file path (e.g., `docs/user-stories/` → `user-story`, `docs/bugs/` → `bug`). Derive a short kebab-case description from the filename (strip extension).
4. Create a new branch:
   ```
   git checkout -b feature/<type>-<description>
   ```
   Example: `feature/user-story-add-login`, `feature/bug-fix-null-pointer`.
5. If the branch already exists, ask the developer how to proceed.

### 4. Write test cases from acceptance criteria (TDD)

1. Extract the **acceptance criteria** from the task. Each criterion becomes at least one test.
2. Discover the project's test infrastructure:
   - Look for a `tests/` or `test/` directory at project root.
   - Check `package.json` for a `test` script.
   - Look for `*.test.*` or `*.spec.*` files adjacent to source code.
   - If none found, ask the developer where tests should live.
3. Write tests that cover **every** acceptance criterion **before** writing any implementation code.
4. Run the tests to confirm they **fail** (red phase):
   ```
   npm test
   ```
   (or the project's equivalent test command)
5. If the tests pass without implementation (feature already exists), inform the developer and stop.

### 5. Implement

1. Write the minimum code needed to make the failing tests pass.
2. Run the tests after each meaningful change.
3. Repeat until **all** tests pass (green phase).

### 6. Functional commit

Once all tests are green:

```
git add -A
git commit -m "feat: <short description of what was implemented>"
```

Use conventional commit format (e.g., `feat:`, `fix:`, `refactor:`).

### 7. Quality check

1. Run **linting** — detect the project's linter:
   - `npm run lint` (Node.js)
   - `ruff check .` or `pylint` (Python)
   - `cargo clippy` (Rust)
   - etc.
2. Run **type-checking** if a script exists (e.g., `npm run typecheck`, `mypy`).
3. Run **security checks** if a script exists.
4. Even without automated tooling, scan your own code for:
   - Bad practices or anti-patterns
   - Code smells
   - Security vulnerabilities
   - Missing error handling
5. Fix **every** issue found.

### 8. Final verification

1. Run the tests again — confirm all are still green.
2. If any regression was introduced, fix before proceeding.

### 9. Quality commit

```
git add -A
git commit -m "chore: fix linting and quality issues"
```

### 10. Report

Tell the developer:
- **Branch name**
- **What was implemented** (one-line summary)
- **Test results** (all green)
- **Linting/quality results** (what was checked, what was fixed)
- **Commit SHAs** (short form, e.g., `a1b2c3d`)

Throughout the workflow, follow the loaded global guidelines.
