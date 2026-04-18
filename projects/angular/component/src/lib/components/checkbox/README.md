# Checkbox

shadcn-styled wrapper over `mat-checkbox` with full `ControlValueAccessor`.

## Import

```ts
import { CheckboxComponent } from '@ojiepermana/angular/component';
```

## Usage

```html
<ui-checkbox [(ngModel)]="accepted">I accept the terms</ui-checkbox>

<ui-checkbox [indeterminate]="true" aria-label="Select all" />
```

With reactive forms:

```html
<ui-checkbox [formControl]="form.controls.accepted">Subscribe to newsletter</ui-checkbox>
```

## API

| Input             | Type             | Default |
| ----------------- | ---------------- | ------- |
| `indeterminate`   | `boolean`        | `false` |
| `required`        | `boolean`        | `false` |
| `aria-label`      | `string \| null` | `null`  |
| `aria-labelledby` | `string \| null` | `null`  |
| `class`           | `string`         | `''`    |

| Output          | Payload   |
| --------------- | --------- |
| `checkedChange` | `boolean` |

Public method: `focus()`.

## Styling

The component uses a Material bridge so Angular Material's design tokens are
mapped through CSS cascade layer `tokens` into shadcn-friendly visuals. Extra
customization belongs in `checkbox.component.css` inside the library.

## Accessibility

- Always give it an accessible name via projected label, `aria-label`, or
  `aria-labelledby`.
- Use `indeterminate` for tri-state list headers.
- `required` is forwarded to the underlying input.
