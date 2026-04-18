import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import {
  TableBodyComponent,
  TableCaptionComponent,
  TableCellComponent,
  TableComponent,
  TableFooterComponent,
  TableHeadComponent,
  TableHeaderComponent,
  TableRowComponent,
} from './table.component';

@Component({
  imports: [
    TableComponent,
    TableHeaderComponent,
    TableBodyComponent,
    TableFooterComponent,
    TableRowComponent,
    TableHeadComponent,
    TableCellComponent,
    TableCaptionComponent,
  ],
  template: `
    <ui-table>
      <caption ui-table-caption>
        Invoices
      </caption>
      <thead ui-table-header>
        <tr ui-table-row>
          <th ui-table-head>ID</th>
        </tr>
      </thead>
      <tbody ui-table-body>
        <tr ui-table-row>
          <td ui-table-cell>INV-001</td>
        </tr>
      </tbody>
      <tfoot ui-table-footer>
        <tr ui-table-row>
          <td ui-table-cell>Total</td>
        </tr>
      </tfoot>
    </ui-table>
  `,
})
class Host {}

describe('Table primitives', () => {
  it('renders a full table with header, body, footer, caption', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const table = root.querySelector('ui-table table') as HTMLTableElement;
    expect(table.className).toContain('caption-bottom');
    expect(root.querySelector('caption')!.textContent).toContain('Invoices');
    expect(root.querySelector('thead')!.className).toContain('border-b');
    expect(root.querySelector('tfoot')!.className).toContain('bg-muted/50');
    expect(root.querySelector('tbody td')!.textContent).toContain('INV-001');
  });
});
