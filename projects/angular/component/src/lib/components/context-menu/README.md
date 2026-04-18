# Context Menu

Right-click / long-press menu positioned at the cursor. Reuses the same
`ui-menu-surface` / `ui-menu-item` primitives as [Dropdown Menu](../dropdown-menu/README.md).

## Import

```ts
import { ContextMenuTriggerDirective } from '@ojiepermana/angular/component';
import {
  MenuContentDirective,
  MenuSurfaceComponent,
  MenuItemComponent,
  MenuSeparatorComponent,
} from '@ojiepermana/angular/component';
```

## Usage

```html
<div class="border p-12 rounded" [uiContextMenuTrigger]="menu">Right-click anywhere inside</div>

<ng-template uiMenuContent #menu="uiMenuContent">
  <ui-menu-surface>
    <button ui-menu-item (selected)="copy()">Copy</button>
    <button ui-menu-item (selected)="paste()">Paste</button>
    <ui-menu-separator />
    <button ui-menu-item (selected)="delete()">Delete</button>
  </ui-menu-surface>
</ng-template>
```

## API

### `[uiContextMenuTrigger]`

| Input                  | Type                   | Default    |
| ---------------------- | ---------------------- | ---------- |
| `uiContextMenuTrigger` | `MenuContentDirective` | _required_ |
| `disabled`             | `boolean`              | `false`    |

Output: `openedChange: boolean`. Method: `openAt(x, y)`, `close()`.

## Accessibility

- Native `contextmenu` event is captured and its default prevented.
- Surface uses the same menu a11y contract: `role="menu"`, arrow-key nav, Escape
  and outside click close the overlay.
