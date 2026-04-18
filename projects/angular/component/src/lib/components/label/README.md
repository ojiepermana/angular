# Label

Accessible text label bound to a form control via `for`.

## Import

```ts
import { LabelComponent } from '@ojiepermana/angular/component';
```

## Usage

```html
<ui-label for="email">Email address</ui-label> <input id="email" ui-input />
```

You can also decorate a native `<label>`:

```html
<label ui-label for="email">Email address</label>
```

## API

| Input   | Type             | Default | Description                                 |
| ------- | ---------------- | ------- | ------------------------------------------- |
| `for`   | `string \| null` | `null`  | Mirrors the native `for` attribute.         |
| `class` | `string`         | `''`    | Extra Tailwind classes (merged via `cn()`). |

## Styling

Tokens consumed: `--foreground`. Base classes: `text-sm font-medium leading-none`.
When a sibling `input` has `peer disabled`, the label dims to `peer-disabled:opacity-70`.

## Accessibility

Always set `for` to match the associated input's `id` so screen readers announce the label when the input gets focus.
