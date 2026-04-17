# Tabs

Keyboard-accessible tabs with roving tabindex and a two-way bound active value.

## Import

```ts
import {
  TabsComponent,
  TabsListComponent,
  TabsTriggerComponent,
  TabsContentComponent,
} from '@ojiepermana/material/shadcn';
```

## Usage

```html
<ui-tabs [(value)]="tab">
  <ui-tabs-list>
    <button ui-tabs-trigger value="account">Account</button>
    <button ui-tabs-trigger value="password">Password</button>
  </ui-tabs-list>

  <ui-tabs-content value="account">
    <!-- account form -->
  </ui-tabs-content>
  <ui-tabs-content value="password">
    <!-- password form -->
  </ui-tabs-content>
</ui-tabs>
```

## API

### `TabsComponent`

| Input           | Type                         | Default        |
| --------------- | ---------------------------- | -------------- |
| `value` (model) | `string \| null`             | `null`         |
| `orientation`   | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `class`         | `string`                     | `''`           |

### `TabsTriggerComponent` / `TabsContentComponent`

Both take a required `value` input that links the trigger to its panel. Trigger
also accepts `disabled` and `class`.

## Keyboard

- `ArrowRight` / `ArrowLeft` on horizontal tabs (or `ArrowDown` / `ArrowUp` on
  vertical) move selection + focus.
- `Home` / `End` jump to the first / last trigger.

## Accessibility

- List is `role="tablist"` with `aria-orientation`.
- Trigger is `role="tab"` with `aria-selected` + roving `tabindex`.
- Content is `role="tabpanel"` with `tabindex="0"` and `hidden` when inactive.
