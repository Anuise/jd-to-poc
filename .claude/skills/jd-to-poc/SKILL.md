```markdown
# jd-to-poc Development Patterns

> Auto-generated skill from repository analysis

## Overview

This skill provides a comprehensive guide to contributing to the `jd-to-poc` TypeScript codebase. It covers the project's coding conventions, commit patterns, and standard workflows for feature development, documentation, and input schema updates. Whether you're adding new modules, updating documentation, or maintaining input templates, this guide will help you follow the established practices for consistency and quality.

## Coding Conventions

### File Naming

- Use **camelCase** for file names.
  - Example: `dataProcessor.ts`, `userInputHandler.ts`

### Import Style

- Use **relative imports** for all modules.
  - Example:
    ```typescript
    import { processData } from './dataProcessor';
    ```

### Export Style

- Use **named exports** rather than default exports.
  - Example:
    ```typescript
    // In src/dataProcessor.ts
    export function processData(input: string): string {
      // ...
    }

    // In another file
    import { processData } from './dataProcessor';
    ```

### Commit Patterns

- Use **Conventional Commits** with the following prefixes:
  - `chore`, `feat`, `docs`, `fix`
- Keep commit messages concise (average ~37 characters).
  - Example: `feat: add user input validation`

## Workflows

### Feature Development with Tests and Docs

**Trigger:** When adding a new module, generator, or pipeline step  
**Command:** `/new-feature`

1. **Add or update implementation files** in `src/` (e.g., `src/modules/`, `src/generators/`, `src/pipeline/`).
   - Example:
     ```typescript
     // src/modules/userModule.ts
     export function createUser(name: string) {
       // implementation
     }
     ```
2. **Add or update corresponding test files** in `tests/`.
   - Example:
     ```typescript
     // tests/userModule.test.ts
     import { createUser } from '../src/modules/userModule';

     describe('createUser', () => {
       it('should create a user', () => {
         expect(createUser('Alice')).toBeDefined();
       });
     });
     ```
3. **Add or update related documentation or report files** in `.superpowers/sdd/` or `docs/`.
   - Example: `.superpowers/sdd/userModule.md`, `docs/user-guide.md`

### Documentation and Spec Update

**Trigger:** When documenting new features, updating usage guides, or maintaining specs  
**Command:** `/update-docs`

1. **Create or update markdown files** in `docs/` or `.superpowers/sdd/`.
   - Example: `docs/new-feature-guide.md`, `.superpowers/sdd/feature-spec.md`
2. **Update `README.md` or related guides** to reflect changes.
3. **Optionally update templates or example files** as needed.

### Input Schema and Example Update

**Trigger:** When introducing new input types or updating input requirements  
**Command:** `/update-input-schema`

1. **Add or update files** in `inputs/` and `examples/sample-inputs/`.
   - Example: `inputs/newInputType.md`, `examples/sample-inputs/example1.md`
2. **Update `docs/input-format.md`** to document input format changes.

## Testing Patterns

- Test files are named with the `.test.ts` suffix and are located in the `tests/` directory.
- Tests are written in TypeScript.
- The specific testing framework is not specified, but standard `describe`/`it` patterns are used.
  - Example:
    ```typescript
    // tests/sampleModule.test.ts
    import { sampleFunction } from '../src/modules/sampleModule';

    describe('sampleFunction', () => {
      it('should return expected output', () => {
        expect(sampleFunction('input')).toBe('expected');
      });
    });
    ```

## Commands

| Command              | Purpose                                                      |
|----------------------|--------------------------------------------------------------|
| /new-feature         | Start a new feature with implementation, tests, and docs     |
| /update-docs         | Update or add project documentation and usage guides         |
| /update-input-schema | Add or update input templates and input format documentation |
```