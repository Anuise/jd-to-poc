---
name: documentation-and-spec-update
description: Workflow command scaffold for documentation-and-spec-update in jd-to-poc.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /documentation-and-spec-update

Use this workflow when working on **documentation-and-spec-update** in `jd-to-poc`.

## Goal

Adds or updates project documentation, specs, and guides to reflect new features or changes.

## Common Files

- `docs/**/*.md`
- `.superpowers/sdd/*.md`
- `README.md`
- `templates/**/*.md`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Create or update markdown files in docs/ or .superpowers/sdd/
- Update README.md or related guides
- Optionally update templates or example files

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.