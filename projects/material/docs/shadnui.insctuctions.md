# ng-shadcn — Build Instructions

> Instruction document for building **shadcn/ui-style components** on top of **Angular Material M3**.
> This is the source of truth. Every component MUST follow these rules to keep the library consistent, accessible, and maintainable.

---

## 0. Philosophy

We are building a component library that **looks and feels like shadcn/ui** but is powered by **Angular Material M3** where it makes sense. The goal:

- **Visual identity:** shadcn/ui (minimal, token-driven, no ripples, no elevation theater).
- **Engineering foundation:** Angular Material CDK (a11y, overlays, focus management, keyboard nav).
- **Developer experience:** Tailwind v4 + CVA (class-variance-authority) + `cn()` utility.
- **Theming:** CSS custom properties (shadcn tokens) bridged to Material M3 system tokens.

**We are NOT:**

- A thin Material skin. If the component is better written from scratch, write it from scratch.
- A pixel-perfect shadcn clone. We adapt where Angular idioms are stronger.
- Opinionated about business logic. Components are primitives.

---

## 1. Tech Stack (Non-Negotiable)

| Layer            | Choice                           | Version         |
| ---------------- | -------------------------------- | --------------- |
| Framework        | Angular                          | >= 20.0.0       |
| Material         | @angular/material + @angular/cdk | >= 20.0.0 (M3)  |
| Styling          | Tailwind CSS                     | >= 4.2.0        |
| Variants         | class-variance-authority         | >= 0.7.0        |
| Class merge      | clsx + tailwind-merge            | latest          |
| Packaging        | ng-packagr                       | matches Angular |
| Change detection | `OnPush` only                    | —               |
| Components       | `standalone: true`               | —               |
| State            | `signal()` / `computed()`        | —               |
| Inputs           | `input()` function signal        | —               |
| Outputs          | `output()` function signal       | —               |

**Forbidden:**

- `@Input()` / `@Output()` decorators (use function signals)
- `NgModule` (use standalone)
- `ChangeDetectionStrategy.Default`
- `any` in public API types
- Inline `style="..."` bindings (use classes)
- `!important` (unless overriding `--mdc-*` token internals)

---

## 2. Folder Structure (Per Component)

Every component lives at `src/lib/components/[name]/` with this exact structure:

```
components/[name]/
├── index.ts                      ← barrel export
├── [name].component.ts           ← main component
├── [name].component.html         ← template (if > 10 lines)
├── [name].component.css          ← styles (only if wrapping Material)
├── [name].variants.ts            ← CVA definitions
├── [name].types.ts               ← public types, enums
├── [name].spec.ts                ← unit tests
└── README.md                     ← usage + props + a11y
```

**Composite components** (e.g., Card with Header/Title/Content/Footer) have one file per sub-component:

```
components/card/
├── index.ts
├── card.component.ts
├── card-header.component.ts
├── card-title.component.ts
├── card-description.component.ts
├── card-content.component.ts
├── card-footer.component.ts
└── card.css
```

---

## 3. Decision Tree — Wrap Material or Write from Scratch?

For every component, answer in order:

### Q1: Does it need overlay/portal rendering?

Dialog, Select, Menu, Tooltip, Datepicker, Autocomplete, Popover, Sheet
→ **Wrap Material CDK.** Use `panelClass` + global CSS in `@layer components`.

### Q2: Does it need complex a11y / keyboard navigation?

Tabs, Accordion, Radio Group, Slider, Datepicker
→ **Wrap Material component.** Override styling aggressively.

### Q3: Is Material's DOM over-engineered for this use case?

Input, Button, Card, Badge, Label, Separator, Skeleton, Alert, Avatar
→ **Write from scratch** with native HTML + Tailwind + tokens. Cleaner.

### Q4: Does Material add NO value?

Card, Alert, Badge, Skeleton
→ **Write from scratch.** Do not import Material.

**Rule of thumb:** ~40% of shadcn components should be written from scratch. Resist the urge to wrap Material for everything.

---

## 4. Component Template (Copy-Paste Starter)

### 4.1 Simple component (no Material)

```typescript
// components/badge/badge.component.ts
import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { cn } from '../../core/cn/cn.util';
import { badgeVariants, type BadgeVariant } from './badge.variants';

@Component({
  selector: 'ui-badge, span[ui-badge]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span [class]="classes()">
      <ng-content />
    </span>
  `,
})
export class BadgeComponent {
  variant = input<BadgeVariant>('default');
  class = input<string>('');

  classes = computed(() => cn(badgeVariants({ variant: this.variant() }), this.class()));
}
```

### 4.2 Component wrapping Material + form control

```typescript
// components/checkbox/checkbox.component.ts
import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  forwardRef,
  signal,
  computed,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatCheckboxModule, MatCheckboxChange } from '@angular/material/checkbox';
import { cn } from '../../core/cn/cn.util';

@Component({
  selector: 'ui-checkbox',
  standalone: true,
  imports: [MatCheckboxModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
  template: `
    <mat-checkbox
      disableRipple
      [class]="classes()"
      [checked]="checked()"
      [disabled]="disabled()"
      [indeterminate]="indeterminate()"
      (change)="handleChange($event)"
    >
      <ng-content />
    </mat-checkbox>
  `,
  styleUrl: './checkbox.component.css',
})
export class CheckboxComponent implements ControlValueAccessor {
  indeterminate = input<boolean>(false);
  class = input<string>('');

  readonly checkedChange = output<boolean>();

  checked = signal<boolean>(false);
  disabled = signal<boolean>(false);

  classes = computed(() => cn('ui-checkbox', this.class()));

  private onChange: (v: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  handleChange(e: MatCheckboxChange): void {
    this.checked.set(e.checked);
    this.onChange(e.checked);
    this.checkedChange.emit(e.checked);
  }

  writeValue(v: boolean): void {
    this.checked.set(!!v);
  }
  registerOnChange(fn: (v: boolean) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(d: boolean): void {
    this.disabled.set(d);
  }
}
```

---

## 5. Required API Contract

Every component MUST expose these standard inputs when applicable:

| Input      | Type                        | Required for                      | Description                             |
| ---------- | --------------------------- | --------------------------------- | --------------------------------------- |
| `variant`  | string literal              | components with visual variations | default / outline / ghost / destructive |
| `size`     | `'sm' \| 'default' \| 'lg'` | sized components                  | Scale of component                      |
| `class`    | `string`                    | **all components**                | Extra classes merged via `cn()`         |
| `disabled` | `boolean`                   | interactive components            | Disable state                           |

Form controls MUST additionally:

- Implement `ControlValueAccessor`
- Provide `NG_VALUE_ACCESSOR` in `providers`
- Support `[(ngModel)]` and `FormControl`
- Emit `{name}Change` output via `output()`
- Expose public `focus()` method
- Honor `setDisabledState()` for reactive forms
- Set `aria-invalid` based on validation state

**Naming conventions:**

- Selector: `ui-[name]` + attribute selector `[ui-name]` when applicable
- Component class: `[Name]Component` (no `Sc` prefix in class name)
- Variants file: `[name].variants.ts`
- CVA function: `[name]Variants`

---

## 6. CVA (Class Variance Authority) Pattern

Every component with visual variations MUST define variants in a separate file.

### Template

```typescript
// components/button/button.variants.ts
import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
  // Base classes — always applied
  [
    'inline-flex items-center justify-center gap-2',
    'whitespace-nowrap rounded-md text-sm font-medium',
    'transition-colors',
    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
    'disabled:pointer-events-none disabled:opacity-50',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>['variant']>;
export type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>['size']>;
```

### Rules

1. Base classes as array joined with space (readable, diff-friendly).
2. Always define `defaultVariants`.
3. Always export variant types with `NonNullable<VariantProps<...>>`.
4. Never put variant logic inside component — only in `.variants.ts`.
5. Never use Tailwind `@apply` — variants must be class strings.

---

## 7. Token Strategy — Three Levels

When styling Material components, always attempt the highest level first.

### Level 1 — M3 System Tokens (preferred)

Override `--mat-sys-*` in `_material-bridge.css`. One-time setup, affects all Material components.

```css
:root {
  --mat-sys-primary: var(--primary);
  --mat-sys-on-primary: var(--primary-foreground);
  --mat-sys-surface: var(--background);
  --mat-sys-on-surface: var(--foreground);
  /* ... */
}
```

### Level 2 — MDC Component Tokens

Override `--mdc-[component]-*` when system tokens don't reach the specific aspect.

```css
:host ::ng-deep .mat-mdc-checkbox {
  --mdc-checkbox-state-layer-size: 1rem;
  --mdc-checkbox-selected-icon-color: hsl(var(--primary));
  --mdc-checkbox-selected-focus-icon-color: hsl(var(--primary));
  --mdc-checkbox-selected-hover-icon-color: hsl(var(--primary));
}
```

### Level 3 — CSS Selector Override (last resort)

Only when no token exists (ripple removal, padding hardcoded in MDC, touch targets).

```css
:host ::ng-deep .mat-mdc-checkbox .mdc-checkbox__ripple {
  display: none;
}
```

**Never jump to Level 3 first.** If you find yourself writing >10 lines of CSS selectors per component, revisit Levels 1-2.

---

## 8. Cascade Layer Setup (Critical)

In `src/lib/styles/_layers.css`:

```css
@layer reset, base, mat-mdc, tokens, components, utilities;
```

**Order matters:**

- `reset` — normalize defaults
- `base` — our foundational styles
- `mat-mdc` — Angular Material injects here automatically
- `tokens` — our shadcn CSS variables (overrides `mat-mdc`)
- `components` — component-specific overrides
- `utilities` — Tailwind utilities (always wins)

With this setup, you almost never need `!important`. If you do, it's a smell — re-examine tokens first.

---

## 9. Material Neutralization Checklist

For every Material component you wrap, you MUST neutralize these defaults:

### ✅ Ripple effects

```typescript
// Global (recommended)
import { MAT_RIPPLE_GLOBAL_OPTIONS } from '@angular/material/core';

providers: [
  { provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: { disabled: true } },
]

// Per-component
<mat-button disableRipple>
```

### ✅ Touch target (48x48 minimum)

```css
:host ::ng-deep .mat-mdc-button-touch-target,
:host ::ng-deep .mat-mdc-checkbox-touch-target {
  display: none !important;
}
```

### ✅ Elevation / shadows

Override via `--mat-sys-level*` tokens. shadcn uses Tailwind's `shadow-sm/md/lg/xl`.

### ✅ Border radius

Map M3 shape scale to single `--radius`:

```css
--mat-sys-corner-extra-small: calc(var(--radius) - 4px);
--mat-sys-corner-small: calc(var(--radius) - 4px);
--mat-sys-corner-medium: calc(var(--radius) - 2px);
--mat-sys-corner-large: var(--radius);
--mat-sys-corner-extra-large: calc(var(--radius) + 4px);
```

### ✅ Typography

Do not fight Material typography scale. Override font tokens to match body text; let Tailwind utilities handle typography at usage site.

### ✅ Animation duration

```css
--mat-sys-motion-duration-short4: 150ms;
--mat-sys-motion-easing-standard: cubic-bezier(0.4, 0, 0.2, 1);
```

---

## 10. Overlay / Portal Styling

Dialog, Select, Menu, Tooltip, Autocomplete render OUTSIDE the component tree via CDK Overlay. `:host` scoping does NOT reach them.

**Rule:** overlay styling MUST be in `@layer components` in global CSS, scoped via `panelClass`.

```typescript
// Component
template: `
  <mat-select panelClass="ui-select-panel" ...>
    <ng-content />
  </mat-select>
`;
```

```css
/* styles/_material-bridge.css */
@layer components {
  .ui-select-panel.mat-mdc-select-panel {
    padding: 0.25rem;
    background: hsl(var(--popover));
    border: 1px solid hsl(var(--border));
    border-radius: calc(var(--radius) - 2px);
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  }

  .ui-select-panel .mat-mdc-option {
    min-height: 2rem;
    padding: 0.375rem 0.5rem;
    border-radius: calc(var(--radius) - 4px);
    font-size: 0.875rem;
    color: hsl(var(--popover-foreground));
  }

  .ui-select-panel .mat-mdc-option:hover:not(.mdc-list-item--disabled),
  .ui-select-panel .mat-mdc-option.mat-mdc-option-active {
    background: hsl(var(--accent));
    color: hsl(var(--accent-foreground));
  }
}
```

---

## 11. Accessibility Checklist (Non-Negotiable)

Every component must pass this checklist before merge:

- [ ] Full keyboard navigation (Tab, Shift+Tab, Arrow keys, Enter, Escape, Space)
- [ ] Focus ring visible (override, but NEVER remove)
- [ ] `aria-*` attributes preserved (when wrapping Material) or added (when custom)
- [ ] Screen reader announces role + state correctly
- [ ] `prefers-reduced-motion` respected
- [ ] Color contrast meets WCAG AA (4.5:1 text, 3:1 UI)
- [ ] Focus trap in modal/dialog/sheet
- [ ] Focus restoration on close
- [ ] Disabled state not focusable via Tab (but announced by SR)

**Focus ring standard:**

```css
focus-visible:outline-none
focus-visible:ring-1
focus-visible:ring-ring
focus-visible:ring-offset-0
```

---

## 12. Form Integration Requirements

Every form control MUST:

- [ ] Implement `ControlValueAccessor`
- [ ] Register `NG_VALUE_ACCESSOR` provider with `forwardRef`
- [ ] Work with `[(ngModel)]`
- [ ] Work with `FormControl` / `FormGroup`
- [ ] Honor `setDisabledState()` from form API
- [ ] Set `aria-invalid="true"` when form control is invalid + touched
- [ ] Set `aria-describedby` to error message ID when provided
- [ ] Emit value change via `output()` named `{property}Change`
- [ ] Expose public `focus()` method
- [ ] Support `required` attribute
- [ ] Support `readonly` where applicable

---

## 13. File Conventions

### Barrel exports (`index.ts`)

```typescript
// components/button/index.ts
export * from './button.component';
export * from './button.variants';
export * from './button.types';
```

### Public API (`src/public-api.ts`)

```typescript
// Core
export * from './lib/core/theme/theme.service';
export * from './lib/core/theme/theme.provider';
export * from './lib/core/cn/cn.util';

// Components (alphabetical)
export * from './lib/components/accordion';
export * from './lib/components/alert';
export * from './lib/components/avatar';
export * from './lib/components/badge';
export * from './lib/components/button';
// ...
```

### Import paths (internal)

Always use relative imports within the library:

```typescript
// ✅ Correct
import { cn } from '../../core/cn/cn.util';
import { buttonVariants } from './button.variants';

// ❌ Wrong — don't self-import
import { cn } from 'ng-shadcn';
```

---

## 14. Testing Requirements

Every component MUST have:

### Unit tests (`*.spec.ts`)

- Renders without error with default inputs
- Applies variant classes correctly
- Applies size classes correctly
- Disabled state prevents interaction
- Emits output events with correct payload
- `ControlValueAccessor` integration (for form controls)
- `class` input merges correctly

### Visual regression (recommended)

- Storybook or Ladle stories for each variant
- Chromatic / Percy snapshot per variant × size combination

### Example minimum test

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let fixture: ComponentFixture<ButtonComponent>;
  let component: ButtonComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
  });

  it('renders with default variant', () => {
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.className).toContain('bg-primary');
  });

  it('applies variant classes', () => {
    fixture.componentRef.setInput('variant', 'outline');
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.className).toContain('border');
  });
});
```

---

## 15. Documentation Per Component

Every component folder MUST include `README.md` with:

````markdown
# Button

Button component styled like shadcn/ui, built on Angular Material.

## Import

```typescript
import { ButtonComponent } from 'ng-shadcn';
```

## Usage

```html
<ui-button variant="default" size="default">Click me</ui-button>
<ui-button variant="outline" size="sm">Small outline</ui-button>
<button ui-button variant="ghost">Native button</button>
```

## Props

| Prop       | Type                                                                          | Default     | Description         |
| ---------- | ----------------------------------------------------------------------------- | ----------- | ------------------- |
| `variant`  | `'default' \| 'destructive' \| 'outline' \| 'secondary' \| 'ghost' \| 'link'` | `'default'` | Visual style        |
| `size`     | `'default' \| 'sm' \| 'lg' \| 'icon'`                                         | `'default'` | Button size         |
| `disabled` | `boolean`                                                                     | `false`     | Disable interaction |
| `type`     | `'button' \| 'submit' \| 'reset'`                                             | `'button'`  | HTML button type    |
| `class`    | `string`                                                                      | `''`        | Additional classes  |

## Accessibility

- Fully keyboard accessible (Tab, Enter, Space)
- `aria-disabled` set when disabled
- Focus ring visible via `focus-visible`

## When NOT to use

- For navigation between pages, use a styled anchor instead.
- For icon-only toggles that maintain state, use `<ui-toggle>`.
````

---

## 16. Build Priority Order

Follow this order to minimize inter-component dependencies:

### Phase 1 — Foundation (no Material)

Label → Separator → Skeleton → Badge → Card → Alert → Avatar

### Phase 2 — Simple Material wrappers

Button → Input → Textarea → Checkbox → Switch → Radio

### Phase 3 — Form primitives

Select → Slider → Progress → Form (validation wrapper)

### Phase 4 — Overlays

Tooltip → Popover → Dialog → Sheet → Dropdown Menu → Context Menu

### Phase 5 — Composite

Tabs → Accordion → Table → Pagination → Breadcrumb → Scroll Area

### Phase 6 — Advanced

Calendar → Date Picker → Command → Combobox → Toast/Sonner

**Phases 1–2 solve 70% of ERP use cases.** Resist building phase 4+ before 1–2 are rock solid.

---

## 17. provideNgShadcn() Setup

Consumers bootstrap the library via a single provider:

```typescript
// core/theme/theme.provider.ts
import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { MAT_RIPPLE_GLOBAL_OPTIONS } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { NG_SHADCN_CONFIG, type NgShadcnConfig } from './theme.tokens';

export function provideNgShadcn(config: NgShadcnConfig = {}): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: NG_SHADCN_CONFIG, useValue: config },

    // Kill Material ripples globally
    { provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: { disabled: true } },

    // Force form-field appearance to outline (we restyle it fully)
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline', subscriptSizing: 'dynamic' },
    },
  ]);
}
```

Consumer usage:

```typescript
// app.config.ts
import { provideNgShadcn } from 'ng-shadcn';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideNgShadcn({
      defaultTheme: 'zinc',
      defaultScheme: 'system',
    }),
  ],
};
```

---

## 18. Red Flags — Stop and Refactor

If you encounter any of these, halt and rework the approach:

- [ ] `!important` appears in >5% of CSS → cascade layer setup is wrong
- [ ] Component CSS file exceeds 200 lines → skip `mat-form-field` or rewrite native
- [ ] `::ng-deep` nesting depth > 3 → styling too internal; check tokens
- [ ] Component breaks on Material minor version upgrade → not using tokens
- [ ] Consumer needs to know Material API to use component → abstraction is leaky
- [ ] `any` appears in public API → refine types
- [ ] Component template exceeds 30 lines → split into sub-components
- [ ] More than 3 `@if` / `@for` nested → extract logic to computed

---

## 19. PR Checklist (Before Merging Any Component)

Copy this into every PR:

```markdown
## Component PR Checklist

- [ ] Follows folder structure (`index.ts`, `.component.ts`, `.variants.ts`, `.types.ts`, `.spec.ts`, `README.md`)
- [ ] `ChangeDetectionStrategy.OnPush`
- [ ] `standalone: true`
- [ ] Uses `input()` / `output()` function signals
- [ ] Uses `signal()` / `computed()` for state
- [ ] CVA variants in separate file
- [ ] `class` input present and merged via `cn()`
- [ ] Selector follows `ui-[name]` convention
- [ ] Material neutralization applied (ripple, touch target, elevation)
- [ ] Cascade layers respected (no `!important` unless justified)
- [ ] Overlay styling (if any) in global `@layer components`
- [ ] `ControlValueAccessor` implemented (if form control)
- [ ] Full keyboard navigation works
- [ ] Focus ring visible on `focus-visible`
- [ ] `aria-*` attributes correct
- [ ] Unit tests pass (render, variants, disabled, events)
- [ ] README.md with props table and a11y notes
- [ ] Playground story added
- [ ] Exported from `public-api.ts`
- [ ] No `any` in public API
- [ ] No `@Input()` / `@Output()` decorators
- [ ] No `NgModule`
```

---

## 20. Quick Reference — Shadcn Token Names

These are the CSS variables you will use in every component. Never invent new ones without updating the token spec.

```css
--background       --foreground
--card             --card-foreground
--popover          --popover-foreground
--primary          --primary-foreground
--secondary        --secondary-foreground
--muted            --muted-foreground
--accent           --accent-foreground
--destructive      --destructive-foreground
--border
--input
--ring
--radius
```

Use in Tailwind via the `@theme` mapping in `_theme.css`:

- `bg-primary`, `text-primary-foreground`
- `border-border`, `border-input`
- `ring-ring`
- `rounded-md`, `rounded-lg` (derived from `--radius`)

---

## 21. Commit Message Convention

```
feat(button): add loading state with spinner
fix(select): overlay panel respects radius token
refactor(checkbox): migrate to signal inputs
docs(card): add composition examples
test(input): cover CVA integration
chore(deps): bump @angular/material to 20.1
```

Prefixes: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `style`, `perf`.

---

## End

This document is the contract. When building a component, open this file first. When reviewing a PR, check against Section 19. When in doubt, default to **simplicity + consistency** over cleverness.

Version: 1.0.0
Last updated: 2026-04-17
