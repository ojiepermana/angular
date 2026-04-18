# Separator

Visual divider between content regions. Horizontal or vertical.

## Import

```ts
import { SeparatorComponent } from '@ojiepermana/angular/component';
```

## Usage

```html
<ui-separator />
<ui-separator orientation="vertical" class="mx-4" />
<ui-separator [decorative]="false" />
```

## API

| Input         | Type                         | Default        | Description                                                 |
| ------------- | ---------------------------- | -------------- | ----------------------------------------------------------- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Axis of the divider.                                        |
| `decorative`  | `boolean`                    | `true`         | When `false`, sets `role="separator"` + `aria-orientation`. |
| `class`       | `string`                     | `''`           | Extra Tailwind classes.                                     |

## Styling

Tokens consumed: `--border`. Horizontal = `h-px w-full`, vertical = `h-full w-px`.

## Accessibility

The separator is decorative by default (`role="none"`). If the divider conveys a
structural break that assistive technology should announce, set
`[decorative]="false"` and it will expose `role="separator"` with the correct
`aria-orientation`.
