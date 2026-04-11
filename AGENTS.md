You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Treat Angular Material as the behavior layer and the library theme as the visual source of truth.
- In application code, prefer Tailwind CSS utility classes in templates for layout, spacing, typography, sizing, and interaction states.
- In library code, choose styling by scope: shared or global styling belongs in `.css` files, while small local cases may use inline class or style bindings, or local component styles, when that is clearer and more maintainable.
- Use theme variables for design values such as color, surface, border, shadow, and radius instead of hardcoded visual values.
- Dark mode must be controlled by global theme variables, not inline Tailwind `dark:` utilities or component-local dark-mode classes.
- Put shared theme primitives in `projects/library/theme/styles/_*.css` and Angular Material overrides in `projects/library/theme/styles/overrides/*.css`.
- Prefer Angular Material or MDC tokens, CSS custom properties, and supported selectors before using deep overrides.
- Public library APIs must be imported from domain-based secondary entry points: `@ojiepermana/angular/theme/service`, `@ojiepermana/angular/theme/component`, `@ojiepermana/angular/theme/directive`, and `@ojiepermana/angular/layout`. Import the aggregate styles from `@ojiepermana/angular/styles/index.css`, or import theme-only styles from `@ojiepermana/angular/theme/styles/index.css`. Do not import these APIs from the root package.
- In this library, component source filenames must omit the `.component` suffix. Use names like `appearance-switcher.ts`, `horizontal.ts`, and `vertical.ts`.
- In this library, all icons must use `@lucide/angular`; do not use Material icons or other icon sets.
- In this library, every Lucide icon must set `absoluteStrokeWidth`.
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection
