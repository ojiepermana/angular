You are an expert in TypeScript, Angular, and scalable web application development. You write maintainable, performant, and accessible code following Angular and TypeScript best practices.

## Project Context: @ojiepermana/angular Library

Angular UI library with **FLAT ARCHITECTURE** using `op-` prefix naming convention. This is a dual-purpose project:
- **Library Development** (`projects/kit/`): Core UI library published to npm
- **Demo Application** (`src/`): Showcase app deployed to Firebase (angular-kit.web.app)

### CRITICAL Library Structure

```txt
projects/kit/src/lib/
├── components/          # All UI components (op-button, op-navigation, etc.)
├── services/           # Services (NavigationService, ThemeService)
├── pipes/             # All pipes
├── directives/        # All directives
├── utils/             # Utility functions
├── types/             # Type definitions (NavigationItem, etc.)
└── kit.ts             # Main library component
```

### Demo App Architecture

```txt
src/app/
├── layouts/            # Layout components (empty, default, modern)
├── pages/             # Route-based pages (demo/, website/)
├── services/          # App-specific services (LayoutService)
└── styles/           # Global theme CSS
```

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain
- Define union types for component variants (see `ButtonVariant`, `ThemeVariant`)

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default.
- Use signals for state management (see `ThemeService`, `LayoutService`)
- Use `inject()` function instead of constructor injection
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

## Library Development Rules (CRITICAL)

### Component Naming (MANDATORY)
- **Selector**: `op-` prefix (e.g., `op-button`, `op-card`)
- **Class**: Simple PascalCase without prefix (e.g., `Button`, `Card`)
- **File**: kebab-case (e.g., `button.ts`, `theme-selector.ts`)

### Architecture Patterns
- **Navigation System**: Components register with `NavigationService` using component registry pattern
- **Theme System**: CSS variables with signal-based state management in `ThemeService`
- **Layout System**: App-level `LayoutService` manages layout types (empty, default, modern)
- **Host Bindings**: Use `host` object in decorators, not `@HostBinding` (see `Button` component)

### Export Management
- Each folder MUST have an `index.ts` file with barrel exports
- Always update `public-api.ts` when adding new files
- Update package.json exports for subpath imports

### Development Workflow
1. Create component/service in appropriate flat folder
2. Add export to folder's `index.ts`
3. Verify `public-api.ts` exports the folder
4. Update package.json exports if needed
5. Build and test: `ng build kit`

### Build & Deploy Commands
- `npm start` - Demo app development server
- `ng build kit` - Build library
- `npm run deploy` - Build production & deploy to Firebase
- `npm run firebase:serve` - Local Firebase preview

### Import/Export Patterns
```typescript
// Export from component file
export class Button { }  // NOT OpButton
export class Card { }    // NOT OpCard

// Import patterns (multiple levels supported):

// 1. Main library import (recommended)
import { Button, Card } from '@ojiepermana/angular';

// 2. Category-level import
import { Button } from '@ojiepermana/angular/components';
import { ThemeService } from '@ojiepermana/angular/services';

// 3. Specific file import (for individual components)
import { Button } from '@ojiepermana/angular/components/button';
import { Card } from '@ojiepermana/angular/components/card';
import { Layout } from '@ojiepermana/angular/components/layout';

// 4. Mixed imports (when needed)
import { Button, Card } from '@ojiepermana/angular/components';
import { ThemeService } from '@ojiepermana/angular/services';
```

## NEVER DO
- Use the old `/ui/component/` nested structure
- Create component folders inside components/
- Put services outside `/services/` folder
- Use NgModules (standalone only)
- Forget op- prefix for components
- Export classes with Op prefix (use simple names like `Button`, not `OpButton`)
- Use constructor injection (use `inject()` function instead)
- Set `standalone: true` explicitly (it's the default)
- Use `ngClass`/`ngStyle` (use direct bindings instead)

## Error Handling Guidelines

### IGNORE Errors in Development Folders
- **Ignore all errors** from `projects/contekan/` folder - this is a personal development/notes folder
- Focus only on errors from main library (`projects/kit/`) and demo app (`src/`)
- Do not attempt to fix or report issues in the contekan folder
