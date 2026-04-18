# Popover

Anchored floating panel with CDK overlay. Click the trigger to toggle.

## Import

```ts
import { PopoverTriggerDirective, PopoverContentDirective } from '@ojiepermana/material/shadcn';
```

## Usage

```html
<button ui-button [uiPopoverTrigger]="content" side="bottom" align="start">Open</button>

<ng-template uiPopoverContent #content="uiPopoverContent">
  <div class="w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md">Popover body</div>
</ng-template>
```

## API

### `PopoverTriggerDirective` (`[uiPopoverTrigger]`)

| Input              | Type                                     | Default    |
| ------------------ | ---------------------------------------- | ---------- |
| `uiPopoverTrigger` | `PopoverContentDirective`                | —          |
| `side`             | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` |
| `align`            | `'start' \| 'center' \| 'end'`           | `'center'` |
| `disabled`         | `boolean`                                | `false`    |

Exposes `isOpen()` signal. Trigger automatically sets `aria-haspopup="dialog"`
and `aria-expanded` on the host.

### `PopoverContentDirective` (`ng-template[uiPopoverContent]`)

Marker directive that exposes the template via `exportAs="uiPopoverContent"`.

## Accessibility

- Close on `Escape`.
- Close on backdrop click.
- Trigger reflects state via `aria-expanded` and `aria-haspopup`.
