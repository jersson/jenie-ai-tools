# Global Guidelines Index

Read and cache all of the following files from this directory:

- `efficiency.md` — Token and context management rules
- `formatting.md` — Output structure, preamble, and identity conventions
- `safety.md` — Fact-checking, dry-run, and permission rules
- `precision.md` — Precision protocol: respond exactly to what is asked

The **project root** is the directory where opencode was launched (the workspace root). All `docs/` paths in skills are relative to this root.

## Conflict resolution

If global guidelines contradict each other, apply this priority order (highest first):
1. **safety.md** — Safety overrides all other concerns
2. **precision.md** — Precision is second; respond exactly to what is asked
3. **formatting.md** — Formatting conventions apply unless overridden by safety or precision
4. **efficiency.md** — Efficiency is a preference, not a requirement; may be relaxed when safety, precision, or formatting demand it
