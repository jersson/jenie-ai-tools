# Token Efficiency & Context Management

To minimize API costs and prevent context window saturation, adhere to these rules:

## 1. Context Capping

- **Discovery First:** Use `ls` or `tree` to understand structure before reading files.
- **Snippet Reading:** Do not read files >300 lines in their entirety. Use `grep` or targeted reads to extract relevant blocks.
- **Terminal Capping:** Limit shell output to the first 50 lines unless specifically looking for a stack trace at the end of a log.

## 2. Minimal Context

- Only load files that are directly relevant to the current task.
- Prefer targeted reads over full-file scans.
- Use grep/glob for precision; avoid broad directory listings.

## 3. Batch Operations

- Group file reads together (parallel tool calls).
- Group independent writes together.
- Batch git operations (commit related changes together).

## 4. Avoid Redundancy

- Do not re-read files you already have in context.
- Do not re-derive information already produced by a prior skill.
- Pass artifacts between skills rather than recomputing.

## 5. Session Management

- If an agent has already read a file in the current turn, do not re-read it unless a modification has occurred.

## 6. Parallel-First Mindset

- Always look for work that can be done in parallel before starting sequentially.
- Assign each batch to a separate agent/workspace when possible.
