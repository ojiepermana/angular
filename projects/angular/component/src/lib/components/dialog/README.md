# Dialog

Declarative modal dialog driven by a two-way bound `open` model input.

## Import

```ts
import {
  DialogComponent,
  DialogHeaderComponent,
  DialogTitleComponent,
  DialogDescriptionComponent,
  DialogFooterComponent,
} from '@ojiepermana/angular/component';
```

## Usage

```html
<button ui-button (click)="open.set(true)">Open</button>

<ui-dialog [(open)]="open" aria-labelledby="confirm-title">
  <ui-dialog-header>
    <ui-dialog-title id="confirm-title">Are you sure?</ui-dialog-title>
    <ui-dialog-description> This action cannot be undone. </ui-dialog-description>
  </ui-dialog-header>

  <ui-dialog-footer>
    <button ui-button variant="outline" (click)="open.set(false)">Cancel</button>
    <button ui-button variant="destructive" (click)="confirm()">Delete</button>
  </ui-dialog-footer>
</ui-dialog>
```

## API

### `DialogComponent`

| Input                  | Type             | Default |
| ---------------------- | ---------------- | ------- |
| `open` (model)         | `boolean`        | `false` |
| `closeOnEscape`        | `boolean`        | `true`  |
| `closeOnBackdropClick` | `boolean`        | `true`  |
| `aria-labelledby`      | `string \| null` | `null`  |
| `aria-describedby`     | `string \| null` | `null`  |
| `class`                | `string`         | `''`    |

Output: `openedChange: boolean`. Method: `close()`.

## Parts

`DialogHeaderComponent`, `DialogTitleComponent`, `DialogDescriptionComponent`,
`DialogFooterComponent` — layout-only components that follow shadcn spacing.

## Styling

Tokens: `--background`, `--border`, `--foreground`, `--popover`. Backdrop
uses `ui-dialog-backdrop`; panel uses `ui-dialog-panel`.

## Accessibility

- `role="dialog"` + `aria-modal="true"` on the surface.
- Focus is trapped inside using `FocusTrap` from `@angular/cdk/a11y`.
- Focus returns to the element that opened the dialog on close.
- Close on `Escape` or backdrop click (configurable).
