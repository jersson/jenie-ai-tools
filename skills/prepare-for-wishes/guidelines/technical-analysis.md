# Technical Analysis Process

Analyze the project by inspecting the following. Use `grep`, `glob`, `read`, and `bash` tools — prefer parallel calls. Read files under 300 lines in full; for larger files, read only the first 60 lines and relevant sections.

## 1. Tech stack & build system

- Read `<project_root>/package.json` (or equivalent: `Cargo.toml`, `pyproject.toml`, `Gemfile`, `go.mod`, `CMakeLists.txt`).
  - Extract project name, description, language/runtime version.
  - Extract `scripts` section — note which scripts exist for `lint`, `test`, `build`, `dev`, `typecheck`, `format`.
  - Extract `dependencies` and `devDependencies` — identify major frameworks (React, Vue, Express, Axum, Django, etc.) and tools (TypeScript, Tailwind, ESLint, Prettier, etc.).
- Read `<project_root>/tsconfig.json`, `.eslintrc*`, `.prettierrc*`, `rust-toolchain.toml`, or other config files at the root to understand strictness settings.

## 2. Project structure

- List the top-level directory entries (`ls <project_root>`).
- List the contents of the main source directory (`src/`, `lib/`, `app/`, `cmd/`, etc. — whichever exists).
- Identify the folder convention: feature-based, layer-based, monorepo packages.

## 3. Naming conventions

- Sample 5–10 file names from source directories.
- Identify: kebab-case, snake_case, camelCase, PascalCase for files.
- From code samples, infer variable/function/class naming style.

## 4. Coding workflow

- Run `git log --oneline -10` to see commit message style (conventional commits? imperative?).
- Check `git branch -r` for branching strategy (main/dev/feature branches).
- Check for CI config files (`.github/workflows/`, `.gitlab-ci.yml`, `Jenkinsfile`).
