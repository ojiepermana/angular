---
name: material-harness-testing
description: 'Use when writing or reviewing tests for Angular Material based components, wrappers, or design-system primitives. Triggers: component harness, material harness, mat harness, wrapper component test, interaction test, keyboard test, focus test.'
---

# Material Harness Testing

Use this skill for Angular Material components or design-system components built on top of Material behavior.

## Goals

- Prefer resilient tests over brittle DOM assertions
- Verify public behavior rather than internal markup
- Cover keyboard, focus, disabled, validation, and async interaction states

## Instructions

1. Prefer Angular CDK and Angular Material harness APIs over CSS selectors whenever a harness exists.
2. Use `TestbedHarnessEnvironment` to drive interactions in component tests.
3. If a wrapper component exposes behavior that is more important than the underlying Material DOM, create a custom harness for the wrapper instead of asserting against internal structure.
4. Assert on public outputs, form values, ARIA state, text content, disabled state, and error presentation rather than implementation details.
5. Cover keyboard and focus flows explicitly, especially for menus, dialogs, selects, autocomplete, tabs, and composite inputs.
6. Exercise loading, empty, error, and validation states when the component supports them.
7. Keep mocks minimal. Prefer realistic providers and test doubles that preserve interaction behavior.
8. When async behavior is involved, use consistent async patterns with `await`, `fakeAsync`, or `tick`, and avoid timing-dependent assertions.
9. Run the affected test target after changes and fix failures before finishing.
