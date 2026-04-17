# Toast

Imperative notification service wrapping `MatSnackBar` with shadcn styling.

## Import

```ts
import { ToastService } from '@ojiepermana/material/shadcn';
```

The underlying `MatSnackBar` requires `provideAnimationsAsync()` or
`provideNoopAnimations()` to be configured in the app.

## Usage

```ts
import { inject } from '@angular/core';
import { ToastService } from '@ojiepermana/material/shadcn';

export class SaveButton {
  private readonly toast = inject(ToastService);

  save() {
    this.toast.success({
      title: 'Saved',
      description: 'Your changes have been saved.',
      action: 'Undo',
    });
  }

  explode() {
    this.toast.error({ title: 'Upload failed', description: 'Check your connection.' });
  }
}
```

## API

### `ToastService`

| Method                               | Returns                   |
| ------------------------------------ | ------------------------- |
| `show(options: ToastOptions)`        | `MatSnackBarRef<unknown>` |
| `success(options)`                   | `MatSnackBarRef<unknown>` |
| `error(options)` (alias destructive) | `MatSnackBarRef<unknown>` |
| `dismiss()`                          | `void`                    |

### `ToastOptions`

| Field                | Type                                      | Default     |
| -------------------- | ----------------------------------------- | ----------- |
| `title`              | `string`                                  | —           |
| `description`        | `string`                                  | —           |
| `action`             | `string`                                  | `''`        |
| `variant`            | `'default' \| 'destructive' \| 'success'` | `'default'` |
| `durationMs`         | `number`                                  | `5000`      |
| `horizontalPosition` | `MatSnackBarConfig['horizontalPosition']` | `'end'`     |
| `verticalPosition`   | `MatSnackBarConfig['verticalPosition']`   | `'bottom'`  |

## Styling

Panel gets classes `ui-toast-panel` and `ui-toast-<variant>`. Style variants
through the `tokens` cascade layer:

```css
@layer tokens {
  .ui-toast-panel.ui-toast-destructive {
    --mdc-snackbar-container-color: hsl(var(--destructive));
    --mat-snack-bar-button-color: hsl(var(--destructive-foreground));
  }
}
```

## Accessibility

`MatSnackBar` manages live-region announcements automatically. Keep titles
short and use `action` for a single primary action.
