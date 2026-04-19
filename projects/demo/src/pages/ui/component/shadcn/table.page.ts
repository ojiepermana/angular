import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  TableBodyComponent,
  TableCaptionComponent,
  TableCellComponent,
  TableComponent,
  TableHeadComponent,
  TableHeaderComponent,
  TableRowComponent,
} from '@ojiepermana/angular/component';

import { PageShellComponent } from '../../../core/page-shell/page-shell';

interface Invoice {
  readonly invoice: string;
  readonly status: 'Paid' | 'Pending' | 'Unpaid';
  readonly method: string;
  readonly amount: string;
}

@Component({
  selector: 'demo-shadcn-table-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageShellComponent,
    TableBodyComponent,
    TableCaptionComponent,
    TableCellComponent,
    TableComponent,
    TableHeadComponent,
    TableHeaderComponent,
    TableRowComponent,
  ],
  template: `
    <demo-page-shell title="Table" description="Semantic table with shadcn styling — head, body, footer, caption.">
      <section class="mb-10">
        <ui-table>
          <caption ui-table-caption>
            A list of your recent invoices.
          </caption>
          <thead ui-table-header>
            <tr ui-table-row>
              <th ui-table-head>Invoice</th>
              <th ui-table-head>Status</th>
              <th ui-table-head>Method</th>
              <th ui-table-head class="text-right">Amount</th>
            </tr>
          </thead>
          <tbody ui-table-body>
            @for (inv of invoices; track inv.invoice) {
              <tr ui-table-row>
                <td ui-table-cell class="font-medium">{{ inv.invoice }}</td>
                <td ui-table-cell>{{ inv.status }}</td>
                <td ui-table-cell>{{ inv.method }}</td>
                <td ui-table-cell class="text-right">{{ inv.amount }}</td>
              </tr>
            }
          </tbody>
        </ui-table>
      </section>
    </demo-page-shell>
  `,
})
export class TablePageComponent {
  protected readonly invoices: Invoice[] = [
    { invoice: 'INV001', status: 'Paid', method: 'Credit Card', amount: '$250.00' },
    { invoice: 'INV002', status: 'Pending', method: 'PayPal', amount: '$150.00' },
    { invoice: 'INV003', status: 'Unpaid', method: 'Bank Transfer', amount: '$350.00' },
    { invoice: 'INV004', status: 'Paid', method: 'Credit Card', amount: '$450.00' },
  ];
}
