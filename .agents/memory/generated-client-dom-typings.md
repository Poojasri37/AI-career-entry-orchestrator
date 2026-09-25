---
name: Generated client DOM typings
description: Compatibility note for generated fetch clients in this workspace
---

Generated API clients use iterable DOM collection methods such as `Headers.entries()`. Shared TypeScript library configs that compile those clients must include both `dom` and `dom.iterable` in `compilerOptions.lib`.

**Why:** The generated client can compile at runtime but fail the workspace typecheck when iterable DOM typings are omitted.

**How to apply:** If codegen begins failing on `Headers.entries()` or similar DOM iterator members, update the consuming library TypeScript config rather than editing generated output.