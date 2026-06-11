# Bug Validation Checklist

## INVEST (adapted for bugs)

| Criterion | Check |
|-----------|-------|
| **I**ndependent | Can the fix be delivered standalone? No external blockers? |
| **N**egotiable | Is the fix approach open to discussion? |
| **V**aluable | Does fixing this deliver clear user/business value? |
| **E**stimable | Is the root cause understood well enough to estimate? |
| **S**mall | Can the fix fit within a single sprint? |
| **T**estable | Are acceptance criteria for the fix explicit and verifiable? |

## 3Cs (adapted for bugs)

| Element | Check |
|---------|-------|
| **C**ard | Is the bug narrative clear? (As a… I want… so that…) |
| **C**onversation | Are reproduction steps, environment, and context documented? |
| **C**onfirmation | Are the criteria to verify the fix clearly defined? |

## Consistency Checks

- [ ] Steps to reproduce are precise and repeatable
- [ ] Expected vs actual behavior is clearly contrasted
- [ ] Environment details are sufficient to replicate
- [ ] Acceptance criteria are objectively pass/fail
- [ ] Root cause is identified or hypothesized
- [ ] No hidden assumptions about the fix scope
- [ ] Impact radius is assessed (what else could break)
