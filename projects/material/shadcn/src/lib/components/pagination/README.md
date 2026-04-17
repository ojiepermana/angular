# Pagination

Accessible page navigation with previous / next and windowed page numbers.

## Import

```ts
import { PaginationComponent } from '@ojiepermana/material/shadcn';
```

## Usage

```html
<ui-pagination
  [(page)]="currentPage"
  [total]="totalPages"
  [siblingCount]="1"
  (pageChange)="load($event)"
/>
```

## API

| Input          | Type     | Default | Description                                   |
| -------------- | -------- | ------- | --------------------------------------------- |
| `page` (model) | `number` | `1`     | Two-way bound current page (1-indexed).       |
| `total`        | `number` | `1`     | Total number of pages.                        |
| `siblingCount` | `number` | `1`     | Page buttons shown on either side of current. |
| `class`        | `string` | `''`    | Extra container classes.                      |

| Output       | Payload  |
| ------------ | -------- |
| `pageChange` | `number` |

## Styling

Reuses `buttonVariants` so page buttons match the Button component. Current
page uses the `outline` variant, others use `ghost`. Ellipses are rendered
as aria-hidden spans.

## Accessibility

- Root is `<nav role="navigation" aria-label="pagination">`.
- Current page is marked with `aria-current="page"`.
- Previous / next have `aria-label` and are disabled at the boundaries.
- Ellipses are `aria-hidden="true"`.
