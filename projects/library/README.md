# Library

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.0.

## Layouts

The library exposes reusable shell components for the two legacy layouts through the theme layout entry point:

- `LayoutHorizontalComponent`
- `LayoutVerticalComponent`

### Usage Rule

Layout shell components must be imported from `@ojiepermana/angular/theme/layout`.

- Do use `@ojiepermana/angular/theme/layout` for `LayoutHorizontalComponent` and `LayoutVerticalComponent`.
- Do not import layout shell components from `@ojiepermana/angular` root.

Use the selectors in consuming apps:

```ts
import {
  LayoutHorizontalComponent,
  LayoutVerticalComponent,
} from '@ojiepermana/angular/theme/layout';
```

```html
<horizontal>
  <div headerBrand>...</div>
  <nav headerNavigation>...</nav>
  <div headerActions>...</div>
</horizontal>

<vertical>
  <nav navigation>...</nav>
</vertical>
```

These layout components are intended to be wrapped by an application shell component that projects navigation and header content into the slots above. The shell's child route is then rendered by the internal `<router-outlet />` inside the layout component.

Import the library styles once in the consuming application so the theme tokens and layout variables are available:

```css
@import 'tailwindcss';
@import '@ojiepermana/angular/theme/styles/index.css';
```

Provide the theme service at application bootstrap:

```ts
import { provideNgTheme } from '@ojiepermana/angular/theme/service';

export const appConfig: ApplicationConfig = {
  providers: [provideNgTheme()],
};
```

## Library Pattern

The library public APIs are organized by domain and must be imported from their dedicated entry points:

- `@ojiepermana/angular/theme/service` for theme services, providers, tokens, and types.
- `@ojiepermana/angular/theme/component` for theme switchers and presentational controls.
- `@ojiepermana/angular/theme/directive` for theme directives.
- `@ojiepermana/angular/theme/layout` for layout shell components.
- `@ojiepermana/angular/theme/styles/index.css` for shared theme tokens and layout variables.

Do not import those APIs from `@ojiepermana/angular` root.
Do not create broad type-based entry points like `@ojiepermana/angular/components` when the APIs belong to a domain such as theme.
Prefer the narrowest feature entry point available.
For library source files, omit the `.component` suffix from component filenames and use names like `appearance-switcher.ts`, `horizontal.ts`, and `vertical.ts`.

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

To build the library, run:

```bash
ng build library
```

This command will compile your project, and the build artifacts will be placed in the `dist/` directory.

### Publishing the Library

Once the project is built, you can publish your library by following these steps:

1. Navigate to the `dist` directory:

   ```bash
   cd dist/library
   ```

2. Run the `npm publish` command to publish your library to the npm registry:

```bash
npm publish
```

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

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
