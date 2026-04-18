# Dropdown Menu

Accessible menu rendered in a CDK overlay with keyboard navigation (arrow keys,
Home/End, type-ahead, Escape).

## Import

```ts
import {
  MenuTriggerDirective,
  MenuContentDirective,
  MenuSurfaceComponent,
  MenuItemComponent,
  MenuSeparatorComponent,
  MenuLabelComponent,
  MenuShortcutComponent,
} from '@ojiepermana/angular/component';
```

## Usage

```html
<button ui-button [uiMenuTrigger]="menu" side="bottom" align="end">Open</button>

<ng-template uiMenuContent #menu="uiMenuContent">
  <ui-menu-surface>
    <ui-menu-label>My account</ui-menu-label>
    <button ui-menu-item (selected)="onProfile()">Profile <span ui-menu-shortcut>⌘P</span></button>
    <button ui-menu-item (selected)="onSettings()">Settings</button>
    <ui-menu-separator />
    <button ui-menu-item disabled>Disabled</button>
  </ui-menu-surface>
</ng-template>
```

## API

### `[uiMenuTrigger]`

| Input           | Type                                     | Default    |
| --------------- | ---------------------------------------- | ---------- |
| `uiMenuTrigger` | `MenuContentDirective`                   | _required_ |
| `side`          | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` |
| `align`         | `'start' \| 'center' \| 'end'`           | `'start'`  |
| `disabled`      | `boolean`                                | `false`    |

Output: `openedChange: boolean`. Methods: `open()`, `close()`, `toggle()`.

### `ui-menu-surface`

Container with `role="menu"` and arrow key navigation wired through
`FocusKeyManager` (wrapping + type-ahead). Emits `closeRequested` on Tab.

### `ui-menu-item`

`role="menuitem"`. Inputs: `disabled`, `inset`, `class`. Output: `selected`.

### Auxiliary

- `ui-menu-separator` → `role="separator"`.
- `ui-menu-label` — non-interactive label row.
- `ui-menu-shortcut` — right-aligned shortcut badge.

## Accessibility

- Trigger: `aria-haspopup="menu"`, `aria-expanded` reflects state.
- Surface: `role="menu"`, items receive `role="menuitem"`, disabled items get
  `aria-disabled="true"`.
- Close on outside click, Escape, or Tab. Focus returns to the trigger.
