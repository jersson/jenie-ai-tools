# Quality Check

Run all available automated checks, then manually scan for issues.

## 1. Linting

Detect the project's linter (from `technical-context.md` or by probing):
- `npm run lint` (Node.js)
- `ruff check .` or `pylint` (Python)
- `cargo clippy` (Rust)

## 2. Type-checking

Run if a script exists (e.g., `npm run typecheck`, `mypy`, `cargo check`).

## 3. Security checks

Run built-in security audits regardless of script entries:
- `npm audit` (Node.js — built-in, no script needed)
- `cargo audit` (Rust — requires `cargo install cargo-audit`)
- `pip audit` or `safety check` (Python)

## 4. Manual code review

Even without automated tooling, scan your own code for:
- Bad practices or anti-patterns
- Code smells
- Security vulnerabilities
- Missing error handling
- Accidentally committed secrets, API keys, or tokens
- Hardcoded credentials or connection strings

Fix **every** issue found before proceeding.
