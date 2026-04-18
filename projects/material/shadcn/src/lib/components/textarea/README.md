# Textarea

Styled native `<textarea>`.

## Import

```ts
import { TextareaComponent } from '@ojiepermana/material/shadcn';
```

## Usage

```html
<ui-label for="bio">Bio</ui-label>
<textarea id="bio" ui-textarea [(ngModel)]="bio" rows="4" placeholder="Tell us about yourself"></textarea>
```

## API

| Input   | Type     | Default |
| ------- | -------- | ------- |
| `class` | `string` | `''`    |

## Styling

Tokens: `--border`, `--input`, `--foreground`, `--muted-foreground`, `--ring`,
`--destructive`. Minimum height is `60px` to avoid visual collapse.

## Accessibility

Same as the Input component — pair with `<ui-label>` and use `aria-describedby`
for helper or error text. Allow vertical resize via the native handle.
