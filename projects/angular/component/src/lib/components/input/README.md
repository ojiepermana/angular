# Input

Styled native `<input>` that works with both `ngModel` and reactive forms.

## Import

```ts
import { InputComponent } from '@ojiepermana/angular/component';
```

## Usage

```html
<ui-label for="email">Email</ui-label>
<input id="email" ui-input type="email" [(ngModel)]="email" placeholder="you@example.com" />
```

Reactive forms:

```ts
form = new FormGroup({ name: new FormControl('') });
```

```html
<input ui-input [formControl]="form.controls.name" />
```

## API

| Input   | Type     | Default |
| ------- | -------- | ------- |
| `class` | `string` | `''`    |

Additionally: all native `<input>` attributes (`type`, `placeholder`, `required`,
`disabled`, …) work as usual.

## Styling

Tokens: `--border`, `--input`, `--foreground`, `--muted-foreground`, `--ring`,
`--destructive`. When `aria-invalid="true"` is present the border and ring turn
destructive.

## Accessibility

- Use `<ui-label>` with `[for]` matching the input's `id`.
- Announce validation errors via `aria-describedby` pointing at a message, and
  set `aria-invalid="true"` when invalid.
- Don't remove the focus ring — the component uses `focus-visible:ring-1` for
  keyboard users only.
