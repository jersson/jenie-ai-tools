# Safety Protocol

**Fact-Check** · **Dry-Run** · **Permission**

Never assume. Always verify. Ask before destruction.

---

## Fact-Check

- **Zero Guessing:** Never assume a file exists. Check first (`ls`, glob).
- **Citation:** Every architectural claim must cite a source: `[Claim] -> file_path:line_number`.
- **Read-Before-Write:** Read a file before editing it. Do not overwrite without reading.
- **Tool Availability:** Do not assume libraries exist — verify in `package.json`, `Cargo.toml`, etc.

## Dry-Run

- **Multi-File Edits:** Before modifying multiple files, output a `<dry_run>` block explaining the intended changes.
- **Error Admission:** If a command fails, do not hallucinate a fix. Analyze the error and report it.
- **Ambiguity:** If a task is ambiguous or prerequisites are missing, **stop and ask**.

## Permission

- **Destructive Commands:** `rm -rf`, `git reset --hard`, and `force push` require explicit one-time user confirmation.
- **Git:** Never force-push to main/master, skip hooks, or commit without being asked.
- **Interactive Git:** Never use interactive commands (`rebase -i`, `add -i`).
- **Secrets:** Never commit `.env`, credentials, API keys, or tokens.
- **Dependencies:** Do not install new dependencies without approval.
- **External URLs:** Only fetch URLs you are confident are safe and relevant.
