# Command

Searchable command palette primitive — a listbox with keyboard navigation and
type-ahead filtering. Used on its own or as the building block for
[Combobox](../combobox/README.md) and command-palette dialogs.

## Import

```ts
import {
  CommandComponent,
  CommandInputComponent,
  CommandListComponent,
  CommandEmptyComponent,
  CommandGroupComponent,
  CommandItemComponent,
  CommandSeparatorComponent,
} from '@ojiepermana/material/shadcn';
```

## Usage

```html
<ui-command>
  <input ui-command-input placeholder="Type a command…" />
  <ui-command-list>
    <ui-command-empty>No results found.</ui-command-empty>

    <ui-command-group heading="Suggestions">
      <button ui-command-item value="Calendar" (selected)="open('calendar')">Calendar</button>
      <button ui-command-item value="Search Emoji" (selected)="open('emoji')">Search Emoji</button>
    </ui-command-group>

    <ui-command-separator />

    <ui-command-group heading="Settings">
      <button ui-command-item value="Profile" (selected)="open('profile')">Profile</button>
    </ui-command-group>
  </ui-command-list>
</ui-command>
```

## API

### `ui-command`

| Input / Model | Type     | Default |
| ------------- | -------- | ------- |
| `query`       | `string` | `''`    |
| `class`       | `string` | `''`    |

### `input[ui-command-input]`

`role="combobox"`, `aria-autocomplete="list"`. Input: `placeholder`. Arrow keys
move active item, Enter selects.

### `ui-command-list`

`role="listbox"`. Scroll container.

### `ui-command-item`

`role="option"`. Inputs: `value`, `disabled`, `class`. Output: `selected`.
Items hide automatically when the query doesn't match.

### Auxiliary

- `ui-command-empty` — shown when no items match.
- `ui-command-group` — `role="group"`, optional `heading` input.
- `ui-command-separator` — `role="separator"`.

## Accessibility

- Listbox semantics with `role="listbox"` + `role="option"` per item.
- Active descendant mirrored via `aria-selected` + `data-active`.
- Disabled items get `data-disabled="true"` and are skipped by keyboard.
