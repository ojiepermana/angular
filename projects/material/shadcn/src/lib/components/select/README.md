# Select

shadcn-styled wrapper around `mat-select` for single or multiple choice.

## Import

```ts
import { SelectComponent } from '@ojiepermana/material/shadcn';
import { MatOption } from '@angular/material/core';
```

## Usage

```html
<ui-select placeholder="Select a plan" [(ngModel)]="plan" aria-label="Plan">
  <mat-option value="free">Free</mat-option>
  <mat-option value="pro">Pro</mat-option>
  <mat-option value="enterprise">Enterprise</mat-option>
</ui-select>

<!-- multiple -->
<ui-select multiple [(ngModel)]="interests" aria-label="Interests">
  @for (i of all; track i) {
  <mat-option [value]="i">{{ i }}</mat-option>
  }
</ui-select>
```

## API

| Input             | Type             | Default |
| ----------------- | ---------------- | ------- |
| `placeholder`     | `string`         | `''`    |
| `multiple`        | `boolean`        | `false` |
| `required`        | `boolean`        | `false` |
| `aria-label`      | `string \| null` | `null`  |
| `aria-labelledby` | `string \| null` | `null`  |
| `class`           | `string`         | `''`    |

| Output         | Payload   |
| -------------- | --------- |
| `valueChange`  | `unknown` |
| `openedChange` | `boolean` |

Public methods: `open()`, `close()`, `focus()`.

## Styling

Panel is tagged with `panelClass="ui-select-panel"` so the Material bridge
layer can restyle options & container. Local overrides live in
`select.component.css`.

## Accessibility

Built on `mat-select`, which exposes the proper listbox/combobox ARIA contract.
Always pair with a `<ui-label>` (preferred) or pass `aria-label` to give the
control an accessible name.
