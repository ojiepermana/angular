# Scroll Area

Lightweight scroll region using native scrollbars styled with tokens.

## Import

```ts
import { ScrollAreaComponent } from '@ojiepermana/angular/component';
```

## Usage

```html
<ui-scroll-area class="h-72 w-48 rounded-md border">
  <div class="p-4">
    @for (item of items; track item) {
    <div class="py-1 text-sm">{{ item }}</div>
    }
  </div>
</ui-scroll-area>
```

## API

| Input   | Type     | Default |
| ------- | -------- | ------- |
| `class` | `string` | `''`    |

## Styling

Tokens consumed: `--border`, `--muted-foreground`. Uses real scrollbars
(webkit pseudo-elements + Firefox `scrollbar-color`) so keyboard, wheel, and
momentum scrolling all work.

## Accessibility

Uses native overflow — screen readers and keyboard users get the full browser
behavior. Give the host a sensible height and width via `class`.
