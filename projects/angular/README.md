# @ojiepermana/angular

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.0.

## Package manager

Install dependencies from the workspace root with Bun:

```bash
bun install
```

## Consumer installation

Install the published package into a consumer Angular workspace with Angular
CLI so the required peer dependencies are added to the app's `package.json`
and installed in the same flow:

```bash
ng add @ojiepermana/angular
```

When updating the library later, use Angular CLI as well:

```bash
ng update @ojiepermana/angular
```

The package ships `ng-add` and `ng-update` metadata so Angular and RxJS
companions stay aligned with the supported versions of the library.

If you install the package with `npm install`, `bun add`, `pnpm add`, or `yarn
add` directly, peer dependency installation falls back to the package
manager's own behavior.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
bun run ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
bun run ng --help
```

## Building

To build the library, run:

```bash
bun run build
```

This command will compile your project, and the build artifacts will be placed in the `dist/` directory.

### Publishing the Library

Publish the scoped package to the public npm registry from the workspace root.

First, log in to npm:

```bash
npm login
```

Then run:

```bash
npm run publish
```

This command rebuilds the library and publishes the generated `dist/angular` package with public access.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
bun run test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
bun run ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
