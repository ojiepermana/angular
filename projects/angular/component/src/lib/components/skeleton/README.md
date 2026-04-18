# Skeleton

Low-contrast placeholder for content that's still loading.

## Import

```ts
import { SkeletonComponent } from '@ojiepermana/angular/component';
```

## Usage

```html
<div class="flex items-center gap-4">
  <ui-skeleton class="h-12 w-12 rounded-full" />
  <div class="space-y-2">
    <ui-skeleton class="h-4 w-[250px]" />
    <ui-skeleton class="h-4 w-[200px]" />
  </div>
</div>
```

## API

| Input   | Type     | Default | Description                                |
| ------- | -------- | ------- | ------------------------------------------ |
| `class` | `string` | `''`    | Sizing + radius classes. Required to show. |

## Styling

Tokens consumed: `--muted`. Base: `animate-pulse rounded-md bg-muted`.

## Accessibility

Emits `aria-hidden="true"` — screen readers skip it. Pair with a live region or
meaningful status text if loading should be announced.
