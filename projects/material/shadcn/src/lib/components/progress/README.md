# Progress

Determinate or indeterminate progress bar.

## Import

```ts
import { ProgressComponent } from '@ojiepermana/material/shadcn';
```

## Usage

```html
<ui-progress [value]="60" aria-label="Uploading" /> <ui-progress indeterminate aria-label="Loading" />
```

## API

| Input             | Type             | Default |
| ----------------- | ---------------- | ------- |
| `value`           | `number \| null` | `0`     |
| `max`             | `number`         | `100`   |
| `indeterminate`   | `boolean`        | `false` |
| `aria-label`      | `string \| null` | `null`  |
| `aria-labelledby` | `string \| null` | `null`  |
| `class`           | `string`         | `''`    |

## Styling

Tokens consumed: `--secondary` (track), `--primary` (indicator). Indeterminate
state is animated via a CSS keyframe that respects `prefers-reduced-motion`.

## Accessibility

Host is `role="progressbar"` with:

- `aria-valuemin="0"`, `aria-valuemax="max"`, `aria-valuenow="clamped value"`
  when determinate.
- `aria-valuenow` omitted and `data-state="indeterminate"` when loading with no
  known progress.

Always provide an accessible name via `aria-label` or `aria-labelledby`.
