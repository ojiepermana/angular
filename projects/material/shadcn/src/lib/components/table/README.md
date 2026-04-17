# Table

Styled `<table>` primitives for data display.

## Import

```ts
import {
  TableComponent,
  TableHeaderComponent,
  TableBodyComponent,
  TableFooterComponent,
  TableRowComponent,
  TableHeadComponent,
  TableCellComponent,
  TableCaptionComponent,
} from '@ojiepermana/material/shadcn';
```

## Usage

```html
<ui-table>
  <caption ui-table-caption>
    Recent invoices
  </caption>
  <thead ui-table-header>
    <tr ui-table-row>
      <th ui-table-head>Invoice</th>
      <th ui-table-head>Status</th>
      <th ui-table-head class="text-right">Amount</th>
    </tr>
  </thead>
  <tbody ui-table-body>
    <tr ui-table-row>
      <td ui-table-cell>INV-001</td>
      <td ui-table-cell>Paid</td>
      <td ui-table-cell class="text-right">$250.00</td>
    </tr>
  </tbody>
</ui-table>
```

## API

Each primitive accepts an optional `class` input. Attribute-selector primitives
must be applied to their semantic tag (`th`, `td`, `tr`, `thead`, …).

## Styling

Tokens consumed: `--muted-foreground`, `--muted`, `--border`. Rows highlight on
hover (`hover:bg-muted/50`) and when selected via `data-[state=selected]`.

## Accessibility

Uses the native `<table>` contract — screen readers get proper row/column
semantics automatically. Always set a `<caption ui-table-caption>` for tables
conveying meaningful data.
