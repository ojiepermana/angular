# Button

Class-variance-authority button for both `<button>` and `<a>`.

## Import

```ts
import { ButtonComponent } from '@ojiepermana/material/shadcn';
```

## Usage

```html
<button ui-button variant="default">Save</button>
<button ui-button variant="outline" size="sm">Cancel</button>
<a ui-button variant="link" href="/learn-more">Learn more</a>
```

## API

| Input     | Type                                                                          | Default     |
| --------- | ----------------------------------------------------------------------------- | ----------- |
| `variant` | `'default' \| 'secondary' \| 'destructive' \| 'outline' \| 'ghost' \| 'link'` | `'default'` |
| `size`    | `'default' \| 'sm' \| 'lg' \| 'icon'`                                         | `'default'` |
| `class`   | `string`                                                                      | `''`        |

The selected variant + size are also exposed via `data-variant` / `data-size`
attributes on the host for styling overrides.

Re-export: `buttonVariants`, `ButtonVariant`, `ButtonSize`.

## Styling

Tokens: `--primary`, `--primary-foreground`, `--secondary`, `--destructive`,
`--border`, `--accent`, `--ring`.

Every state (hover, focus-visible, active, disabled) is covered by the variants.
Focus-visible uses a 2px `ring-ring` outline for keyboard users.

## Accessibility

Attribute selectors force you to pick a real semantic element:

- Use `<button ui-button>` for actions that don't navigate.
- Use `<a ui-button href="…">` for navigation.

Avoid faking buttons with `<div>` — keyboard and screen-reader support depend on
the native element.
