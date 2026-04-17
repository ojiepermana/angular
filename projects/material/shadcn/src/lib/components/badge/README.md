# Badge

Small rounded pill for status, labels, counts.

## Import

```ts
import { BadgeComponent } from '@ojiepermana/material/shadcn';
```

## Usage

```html
<ui-badge>New</ui-badge>
<ui-badge variant="secondary">Secondary</ui-badge>
<ui-badge variant="destructive">Error</ui-badge>
<ui-badge variant="outline">Outline</ui-badge>

<!-- As an attribute on span -->
<span ui-badge variant="secondary">v1.0</span>
```

## API

| Input     | Type                                                     | Default     |
| --------- | -------------------------------------------------------- | ----------- |
| `variant` | `'default' \| 'secondary' \| 'destructive' \| 'outline'` | `'default'` |
| `class`   | `string`                                                 | `''`        |

## Variants

Powered by `class-variance-authority`. Re-export: `badgeVariants` + `BadgeVariant`.

```ts
import { badgeVariants } from '@ojiepermana/material/shadcn';
const className = badgeVariants({ variant: 'outline' });
```

## Styling

Tokens consumed: `--primary`, `--secondary`, `--destructive`, `--foreground`,
`--border`. Base: `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold`.

## Accessibility

Purely presentational. If the badge conveys state an assistive technology must
announce (e.g. "5 unread"), pair it with accessible text nearby or inside the
badge and avoid relying on color alone.
