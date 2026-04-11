# Angular

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.7.

## Development server

This workspace is now library-only, so there is no demo application or local dev server target.

To keep the library rebuilding in development mode, run:

```bash
npm start
```

This watches the `library` build with the development configuration and recompiles when source files change.

The root TypeScript path aliases in `tsconfig.json` still point directly at the library source entry points, for example:

- `@ojiepermana/angular/layout` -> `projects/library/layout/public-api.ts`
- `@ojiepermana/angular/theme/component` -> `projects/library/theme/component/public-api.ts`
- `@ojiepermana/angular/theme/service` -> `projects/library/theme/service/public-api.ts`

If you add a consuming application later, register `projects/library/styles/index.css` for the combined theme and layout bundle.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name --project library
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
npm run build
```

This builds the `library` package and stores the artifacts in `dist/library`.

To package the library separately, run:

```bash
npm run build:library
```

To watch the library explicitly during development, use:

```bash
npm run watch
npm run watch:library
```

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
npm test
```

## Running end-to-end tests

There is no end-to-end target configured because this workspace no longer includes a demo application.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
