# Card

Bordered surface container with header/title/description/content/footer regions.

## Import

```ts
import {
  CardComponent,
  CardHeaderComponent,
  CardTitleComponent,
  CardDescriptionComponent,
  CardContentComponent,
  CardFooterComponent,
} from '@ojiepermana/material/shadcn';
```

## Usage

```html
<ui-card>
  <ui-card-header>
    <ui-card-title>Create project</ui-card-title>
    <ui-card-description>Deploy your new project in one click.</ui-card-description>
  </ui-card-header>
  <ui-card-content>
    <!-- form here -->
  </ui-card-content>
  <ui-card-footer class="flex justify-between">
    <button ui-button variant="outline">Cancel</button>
    <button ui-button>Deploy</button>
  </ui-card-footer>
</ui-card>
```

## API

All card primitives accept a single optional input `class`. No behavior.

| Primitive                  | Selector              | Base classes                                               |
| -------------------------- | --------------------- | ---------------------------------------------------------- |
| `CardComponent`            | `ui-card`             | `rounded-lg border bg-card text-card-foreground shadow-sm` |
| `CardHeaderComponent`      | `ui-card-header`      | `flex flex-col space-y-1.5 p-6`                            |
| `CardTitleComponent`       | `ui-card-title`       | `text-2xl font-semibold leading-none tracking-tight`       |
| `CardDescriptionComponent` | `ui-card-description` | `text-sm text-muted-foreground`                            |
| `CardContentComponent`     | `ui-card-content`     | `p-6 pt-0`                                                 |
| `CardFooterComponent`      | `ui-card-footer`      | `flex items-center p-6 pt-0`                               |

## Styling

Tokens consumed: `--card`, `--card-foreground`, `--border`, `--muted-foreground`.

## Accessibility

The card root is a non-interactive region. If the whole card is clickable, wrap
the content in a `<button>` or an anchor with visible focus rings; do not add
click handlers to the card root.
