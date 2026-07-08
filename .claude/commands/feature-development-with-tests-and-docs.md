---
name: feature-development-with-tests-and-docs
description: Workflow command scaffold for feature-development-with-tests-and-docs in jd-to-poc.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /feature-development-with-tests-and-docs

Use this workflow when working on **feature-development-with-tests-and-docs** in `jd-to-poc`.

## Goal

Implements a new feature by adding implementation files, corresponding tests, and updating documentation or reports.

## Common Files

- `src/modules/*.ts`
- `src/generators/*.ts`
- `src/pipeline/*.ts`
- `tests/*.test.ts`
- `.superpowers/sdd/*.md`
- `docs/*.md`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Add or update implementation files in src/ (e.g., modules, generators, pipeline)
- Add or update corresponding test files in tests/
- Add or update related documentation or report files (e.g., .superpowers/sdd/, docs/)

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.