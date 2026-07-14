# TDD Workflow

## 1. Extract acceptance criteria

Each acceptance criterion from the task becomes at least one test. Read the full task file and create one test function/method per "Condition of satisfaction". Use the project's existing test framework (from `technical-context.md` or by inspecting existing tests) and follow its conventions for file naming, test structure, and assertions.

## 2. Discover test infrastructure

**If MCP available** (check `MCP Status` in `technical-context.md`):
- Use `search_graph(label="Function", name_pattern=".*test.*")` to find existing test functions
- Use `search_graph(label="File", name_pattern=".*test.*|.*spec.*")` to find test files
- Use `get_code_snippet()` to read test patterns from found functions

**Else (fallback):**
- Look for a `tests/` or `test/` directory at project root.
- Check `package.json` for a `test` script.
- Look for `*.test.*` or `*.spec.*` files adjacent to source code.
- If none found, ask the developer where tests should live.

## 3. Red phase

Write tests that cover **every** acceptance criterion **before** writing any implementation code. Run the tests to confirm they **fail**:

```
npm test
```
(or the equivalent test command from `technical-context.md`)

If the tests pass without implementation (feature already exists), inform the developer and stop.

## 4. Green phase

1. Write the minimum code needed to make the failing tests pass.
2. Run the tests after each meaningful change.
3. Repeat until **all** tests pass.
