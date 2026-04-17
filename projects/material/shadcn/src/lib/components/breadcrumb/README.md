# Breadcrumb

Hierarchical navigation trail.

## Import

```ts
import {
  BreadcrumbComponent,
  BreadcrumbListComponent,
  BreadcrumbItemComponent,
  BreadcrumbLinkComponent,
  BreadcrumbPageComponent,
  BreadcrumbSeparatorComponent,
  BreadcrumbEllipsisComponent,
} from '@ojiepermana/material/shadcn';
```

## Usage

```html
<nav ui-breadcrumb>
  <ol ui-breadcrumb-list>
    <li ui-breadcrumb-item>
      <a ui-breadcrumb-link href="/">Home</a>
    </li>
    <li ui-breadcrumb-separator></li>
    <li ui-breadcrumb-item>
      <a ui-breadcrumb-link href="/components">Components</a>
    </li>
    <li ui-breadcrumb-separator></li>
    <li ui-breadcrumb-item>
      <span ui-breadcrumb-page>Breadcrumb</span>
    </li>
  </ol>
</nav>
```

## API

Each primitive is attribute-styled and takes an optional `class` input.

## Styling

Tokens consumed: `--muted-foreground`, `--foreground`.

## Accessibility

- Root `<nav>` exposes `aria-label="breadcrumb"`.
- The current page uses `<span ui-breadcrumb-page>` which emits
  `role="link"`, `aria-current="page"`, and `aria-disabled="true"` so the
  trail announces the current location.
- Separators and ellipses are `aria-hidden` and `role="presentation"`.
