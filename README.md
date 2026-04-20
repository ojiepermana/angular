# Angular

This workspace contains the `@ojiepermana/angular` library sources built with Angular CLI 21.

## Package manager

This workspace uses Bun as the package manager.

```bash
bun install
```

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component in the library, run:

```bash
bun run ng generate component component-name --project angular
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
bun run ng --help
```

## Building The Library

To build the published library artifacts, run:

```bash
bun run build
```

This compiles the `@ojiepermana/angular` library and writes the output to `dist/angular`.

## Publishing To npm

The published package is the scoped public package `@ojiepermana/angular`.

Log in to npm first:

```bash
npm login
```

Then publish from the workspace root with:

```bash
npm run publish
```

This command rebuilds the library and publishes `dist/angular` to the public npm registry.

## Running unit tests

To execute the library unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
bun run test
```

## Generating an SDK from OpenAPI

The workspace ships with an SDK generator that is published as the secondary
entrypoint `@ojiepermana/angular/generator/api`. It turns an OpenAPI 3.x spec
into a lightweight Angular SDK (typed services + tree-shakeable fn modules).
See [`projects/angular/generator/api/README.md`](projects/angular/generator/api/README.md)
for the full reference.

```bash
# local development inside this repo
bun run gen:sdk:init
bun run gen:sdk

# consumer after installing @ojiepermana/angular
ng generate @ojiepermana/angular/generator/api:init
ng generate @ojiepermana/angular/generator/api:sdk
```

Generated SDKs use same-origin requests by default when `targets[].rootUrl` is
omitted or set to `""`. Consumer apps can override the backend base URL at
runtime with `provideApiConfiguration(...)`. See
[`projects/angular/generator/api/README.md`](projects/angular/generator/api/README.md)
for the full configuration and runtime examples.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
