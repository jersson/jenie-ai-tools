# Git Conventions

## 1. Working tree check

Before branching, check the current git branch and working tree:
- `git branch --show-current`
- If the working tree has uncommitted changes, ask the developer to commit or stash them first. Do not proceed until clean.

## 2. Branch naming

Derive the task type from the file path (e.g., `docs/user-stories/` → `user-story`, `docs/bugs/` → `bug`). Derive a short kebab-case description from the filename (strip extension).

```
git checkout -b feature/<type>-<description>
```

Example: `feature/user-story-add-login`, `feature/bug-fix-null-pointer`.

If the branch already exists locally, ask the developer how to proceed.

## 3. Staging

Before staging, run `git status` and verify no sensitive files (`.env`, credentials, API keys, tokens, build artifacts) are present. Stage changes with:

```
git add -A
```

## 4. Functional commit

Once all tests are green, commit the implementation:

```
git add -A
git commit -m "feat: <short description of what was implemented>"
```

Use conventional commit format (`feat:`, `fix:`, `refactor:`).

## 5. Quality commit

After linting, type-checking, and fixes are complete:

```
git add -A
git commit -m "chore: fix linting and quality issues"
```
