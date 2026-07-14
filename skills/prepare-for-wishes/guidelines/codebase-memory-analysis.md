# Codebase-Memory-Accelerated Analysis

Uses [codebase-memory-mcp](https://github.com/DeusData/codebase-memory-mcp) to analyze the project via graph queries instead of file-by-file reads. This is faster and cheaper — but optional. If the MCP server is not available, fall back to `./technical-analysis.md`.

## 0. Availability check

### Step A: Binary check

Run `which codebase-memory-mcp` (or `command -v codebase-memory-mcp`) via bash. If the command exits non-zero, the binary is not installed — ask the developer:

> 💡 codebase-memory-mcp is not installed. It replaces file-by-file reads with graph queries (~120x fewer tokens).
> Install it now? (yes/no)

If the developer says **yes**, run:
```
curl -fsSL https://raw.githubusercontent.com/DeusData/codebase-memory-mcp/main/install.sh | bash
```
Then tell the developer to **restart their coding agent** and run this skill again. Stop — do not continue.

If the developer says **no**, ask:

> Continue without it using manual analysis? (yes/no)

If **yes**, fall back to `./technical-analysis.md` and follow its instructions.
If **no**, stop:
> Install later when ready:
> ```
> curl -fsSL https://raw.githubusercontent.com/DeusData/codebase-memory-mcp/main/install.sh | bash
> ```

### Step B: MCP server connection check

If the binary exists, call `list_projects` (no arguments). This confirms the MCP server is running and returns indexed project names.

Three outcomes:
- **Success** (returns a list of projects): find the entry matching `<project_root>` (the project name is the repo path slugified, e.g. `Users-jersson-src-sandbox-api-testing-example`). Store this name — use it for all subsequent MCP calls. Proceed to step 1.
- **Unknown tool** (the agent doesn't recognize `list_projects`): the MCP server is not connected. Ask:

  > 💡 codebase-memory-mcp binary is installed but the MCP server is not connected.
  > Continue with manual analysis? (yes/no)

  If **yes**, fall back to `./technical-analysis.md`.
  If **no**, stop:
  > Restart your coding agent to enable MCP, then run this skill again.

- **Error** (tool exists but call fails): same as above — offer manual fallback or stop.

## 1. Ensure the project is indexed

Call `index_status` with `{"project": "<project_name>"}` (use the name from step B). If it reports the project isn't indexed, call `index_repository` with `{"repo_path": "<project_root>"}` before continuing.

## 2. Pull the architecture in two calls

- `get_architecture` with `{"project": "<project_name>"}` — languages, packages, entry points, routes, hotspots, layers, and clusters, in a single call.
- `get_graph_schema` with `{"project": "<project_name>"}` — node/edge counts and per-language breakdown, confirming what `get_architecture` reported.

## 3. Naming conventions

Use `search_graph` with `{"project": "<project_name>", "name_pattern": ".*", "label": "Function", "limit": 10}` to sample real function names. Do the same for `"label": "Class"` and `"label": "File"`. Infer kebab-case/snake_case/camelCase/PascalCase from the actual identifiers returned — do not guess from directory listings.

## 4. Coding workflow

Unchanged regardless of path — codebase-memory-mcp does not cover git history or CI. Run the same steps as `technical-analysis.md` section 4: `git log --oneline -10`, `git branch -r`, and check for `.github/workflows/`, `.gitlab-ci.yml`, or `Jenkinsfile`.

## 5. Map into the shared template

Fill `./technical-context-template.md` exactly as `technical-analysis.md` would (Tech Stack, Scripts, Project Structure, Naming Conventions, Workflow, Config & Tooling, Key Paths), plus the two optional sections the template reserves for this path: **Architecture Hotspots** and **Entry Points & Routes**, populated from `get_architecture`'s `hotspots`/`entry_points`/`routes` output.
