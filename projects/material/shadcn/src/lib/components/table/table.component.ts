import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../core/cn/cn.util';

@Component({
  selector: 'ui-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'relative w-full overflow-auto block' },
  template: `
    <table [class]="classes()">
      <ng-content />
    </table>
  `,
})
export class TableComponent {
  readonly class = input<string>('');
  protected readonly classes = computed(() => cn('w-full caption-bottom text-sm', this.class()));
}

@Component({
  selector: 'thead[ui-table-header]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
})
export class TableHeaderComponent {
  readonly class = input<string>('');
  protected readonly classes = computed(() => cn('[&_tr]:border-b', this.class()));
}

@Component({
  selector: 'tbody[ui-table-body]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
})
export class TableBodyComponent {
  readonly class = input<string>('');
  protected readonly classes = computed(() => cn('[&_tr:last-child]:border-0', this.class()));
}

@Component({
  selector: 'tfoot[ui-table-footer]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
})
export class TableFooterComponent {
  readonly class = input<string>('');
  protected readonly classes = computed(() =>
    cn('border-t bg-muted/50 font-medium [&>tr]:last:border-b-0', this.class()),
  );
}

@Component({
  selector: 'tr[ui-table-row]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
})
export class TableRowComponent {
  readonly class = input<string>('');
  protected readonly classes = computed(() =>
    cn('border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted', this.class()),
  );
}

@Component({
  selector: 'th[ui-table-head]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
})
export class TableHeadComponent {
  readonly class = input<string>('');
  protected readonly classes = computed(() =>
    cn(
      'h-10 px-2 text-left align-middle font-medium text-muted-foreground',
      '[&:has([role=checkbox])]:pr-0',
      this.class(),
    ),
  );
}

@Component({
  selector: 'td[ui-table-cell]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
})
export class TableCellComponent {
  readonly class = input<string>('');
  protected readonly classes = computed(() =>
    cn('p-2 align-middle [&:has([role=checkbox])]:pr-0', this.class()),
  );
}

@Component({
  selector: 'caption[ui-table-caption]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
})
export class TableCaptionComponent {
  readonly class = input<string>('');
  protected readonly classes = computed(() =>
    cn('mt-4 text-sm text-muted-foreground', this.class()),
  );
}
