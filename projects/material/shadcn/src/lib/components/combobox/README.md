# Combobox

Button trigger that opens a CDK overlay with a searchable option list
(powered by [Command](../command/README.md)).

## Import

```ts
import { ComboboxComponent, type ComboboxOption } from '@ojiepermana/material/shadcn';
```

## Usage

```ts
frameworks: ComboboxOption<string>[] = [
  { value: 'ng', label: 'Angular' },
  { value: 'rx', label: 'React' },
  { value: 'vue', label: 'Vue' },
];
value: string | null = null;
```

```html
<ui-combobox
  [options]="frameworks"
  [(value)]="value"
  placeholder="Select framework"
  searchPlaceholder="Search framework…"
/>
```

## API

| Input / Model       | Type                               | Default               |
| ------------------- | ---------------------------------- | --------------------- |
| `options`           | `ReadonlyArray<ComboboxOption<T>>` | `[]`                  |
| `value`             | `T \| null`                        | `null`                |
| `placeholder`       | `string`                           | `'Select…'`           |
| `searchPlaceholder` | `string`                           | `'Search…'`           |
| `emptyText`         | `string`                           | `'No results found.'` |
| `disabled`          | `boolean`                          | `false`               |
| `class`             | `string`                           | `''`                  |

Output: `valueChange: T | null`. Implements `ControlValueAccessor` —
compatible with reactive forms.

### `ComboboxOption<T>`

```ts
interface ComboboxOption<T = unknown> {
  value: T;
  label: string;
  disabled?: boolean;
}
```

## Styling

- Trigger uses the `outline` button variant.
- Overlay panel class: `ui-combobox-panel`.
- Popover matches trigger width via `--ui-combobox-trigger-width`.

## Accessibility

- Trigger has `role="combobox"` and reflects `aria-expanded` / `aria-controls`.
- Panel contains a `ui-command` with full listbox semantics.
- Escape and outside click close the panel; focus returns to the trigger.
- Selecting the active item again clears the selection.
