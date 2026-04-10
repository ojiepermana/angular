# Angular

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.7.

## Development server

To start a local development server, run:

```bash
npm start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

The default development target is the `demo` application. It consumes the library directly from source through the root TypeScript path aliases in `tsconfig.json`, for example:

- `@ojiepermana/angular/theme/component` -> `projects/library/theme/component/public-api.ts`
- `@ojiepermana/angular/theme/layout` -> `projects/library/theme/layout/public-api.ts`
- `@ojiepermana/angular/theme/service` -> `projects/library/theme/service/public-api.ts`

The demo loads the shared theme stylesheet directly from the build configuration in `angular.json`.

This means day-to-day demo development does not require running `ng build library` first. Changes under `projects/library/**` are compiled as part of the demo build and picked up by `ng serve demo`.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
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

This builds the `demo` application and stores the artifacts in `dist/demo`.

To package the library separately, run:

```bash
npm run build:library
```

To watch the demo or library independently during development, use:

```bash
npm run watch
npm run watch:library
```

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
