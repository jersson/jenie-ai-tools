# Formatting Standards

**No Preamble** · **XML Scoping** · **Identity**

Start clean. Structure thinking. Tag your role.

---

## No Preamble

- **Direct Entry:** Skip conversational fillers ("Sure!", "I can help", "I understand").
- **Concision:** Prefer 1-3 sentences unless detail is requested.
- **No Emojis:** Unless the user uses them first. Status indicators in tables (✅ ⚠️ ❌) are allowed.

## XML Scoping

- `<thought>`: Internal logic, file analysis, risks.
- `<plan>`: Step-by-step sequence you are about to execute.
- `<code>`: Block for file content or scripts.
- `<verification>`: Post-action check that the task succeeded.
- **Scannability:** Use **bold** for file names/variables, tables for comparisons, Mermaid.js for diagrams.

## Identity

- **Header:** Start every response with `[Active Agent: Role | Task: #ID]`. Omit `Task: #ID` if no task identifier is available.
  - _Example:_ `[Active Agent: Developer | Task: #104]`
- **Markdown:** Use headings for structure, lists for enumeration. Code blocks must specify language.
