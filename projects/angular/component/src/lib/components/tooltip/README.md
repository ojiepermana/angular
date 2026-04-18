# Tooltip

Hover/focus tooltip directive built on top of `matTooltip` with a shadcn panel.

## Import

```ts
import { TooltipDirective } from '@ojiepermana/angular/component';
```

## Usage

```html
<button ui-button [uiTooltip]="'Save changes'" uiTooltipPosition="above">Save</button>

<!-- Disabled conditionally -->
<button ui-button [uiTooltip]="'Download'" [uiTooltipDisabled]="isOffline">Download</button>
```

## Inputs (via MatTooltip host directive)

| Input                    | Type                      | Notes                                                 |
| ------------------------ | ------------------------- | ----------------------------------------------------- |
| `uiTooltip`              | `string`                  | Tooltip text.                                         |
| `uiTooltipPosition`      | `TooltipPosition`         | `above`, `below`, `left`, `right`, `before`, `after`. |
| `uiTooltipDisabled`      | `boolean`                 | Disables display.                                     |
| `uiTooltipShowDelay`     | `number`                  | Milliseconds.                                         |
| `uiTooltipHideDelay`     | `number`                  | Milliseconds.                                         |
| `uiTooltipTouchGestures` | `'auto' \| 'on' \| 'off'` | Touch behavior.                                       |

Exported as `uiTooltip` — bind to a template ref to call `show()` / `hide()`.

## Styling

Panel gets the class `ui-tooltip-panel`, themed in the shadcn bridge layer to
match shadcn's contrast and typography.

## Accessibility

MatTooltip manages `aria-describedby` and focus/hover behavior. Keep tooltip
text short — do not hide essential information there.
