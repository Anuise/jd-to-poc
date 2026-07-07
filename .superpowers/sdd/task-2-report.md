# Task 2 Report: Domain Types 與 Input Reader

## Status

Completed.

## Scope

- Added domain input document types in `src/domain/inputDocuments.ts`.
- Added POC-related domain interfaces in `src/domain/poc.ts`.
- Added skill evidence interface in `src/domain/skill.ts`.
- Added Markdown input reader in `src/io/readInputs.ts`.
- Added input reader tests in `tests/readInputs.test.ts`.

## Verification

- RED: `npm test` failed with `TS2307: Cannot find module '../src/io/readInputs.js'`.
- GREEN:
  - `npm run build` completed during `npm test`.
  - `node --test dist/tests/readInputs.test.js` passed: 3 tests, 0 failures.

## Concerns

- `npm test` currently fails on Windows after build because `node --test dist/tests/*.test.js` treats the glob as a literal path and reports `Could not find '...\dist\tests\*.test.js'`.
- The repository did not have local npm dependencies installed. I temporarily installed dependencies to verify, then removed generated `node_modules`, `dist`, and `package-lock.json` before committing because they are outside Task 2 scope.
