# Sheet

Edge-anchored modal drawer — slides in from top, right, bottom, or left.

## Import

```ts
import {
  SheetComponent,
  SheetHeaderComponent,
  SheetTitleComponent,
  SheetDescriptionComponent,
  SheetFooterComponent,
} from '@ojiepermana/material/shadcn';
```

## Usage

```html
<button ui-button (click)="open.set(true)">Edit profile</button>

<ui-sheet [(open)]="open" side="right" aria-labelledby="st">
  <ui-sheet-header>
    <ui-sheet-title id="st">Edit profile</ui-sheet-title>
    <ui-sheet-description>Make changes to your profile here.</ui-sheet-description>
  </ui-sheet-header>
  <!-- form body -->
  <ui-sheet-footer>
    <button ui-button (click)="save()">Save</button>
  </ui-sheet-footer>
</ui-sheet>
```

## API

| Input                  | Type                                     | Default   |
| ---------------------- | ---------------------------------------- | --------- |
| `open` (model)         | `boolean`                                | `false`   |
| `side`                 | `'top' \| 'right' \| 'bottom' \| 'left'` | `'right'` |
| `closeOnEscape`        | `boolean`                                | `true`    |
| `closeOnBackdropClick` | `boolean`                                | `true`    |
| `aria-labelledby`      | `string \| null`                         | `null`    |
| `aria-describedby`     | `string \| null`                         | `null`    |
| `class`                | `string`                                 | `''`      |

## Styling

Surface animates in from the appropriate edge via `--ui-sheet-from`. Animation
duration honors `prefers-reduced-motion`.

## Accessibility

- `role="dialog"` + `aria-modal="true"`.
- Focus trapped via `FocusTrap` and restored on close.
- Close on `Escape` or backdrop click (configurable).
