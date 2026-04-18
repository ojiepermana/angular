import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../core/cn/cn.util';

@Component({
  selector: 'ui-sheet-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
})
export class SheetHeaderComponent {
  readonly class = input<string>('');
  protected readonly classes = computed(() => cn('flex flex-col gap-2 text-center sm:text-left', this.class()));
}

@Component({
  selector: 'ui-sheet-title, h2[ui-sheet-title]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
})
export class SheetTitleComponent {
  readonly class = input<string>('');
  protected readonly classes = computed(() => cn('text-lg font-semibold text-foreground', this.class()));
}

@Component({
  selector: 'ui-sheet-description, p[ui-sheet-description]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
})
export class SheetDescriptionComponent {
  readonly class = input<string>('');
  protected readonly classes = computed(() => cn('text-sm text-muted-foreground', this.class()));
}

@Component({
  selector: 'ui-sheet-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
})
export class SheetContentComponent {
  readonly class = input<string>('');
  protected readonly classes = computed(() => cn('flex-1 overflow-auto', this.class()));
}

@Component({
  selector: 'ui-sheet-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
})
export class SheetFooterComponent {
  readonly class = input<string>('');
  protected readonly classes = computed(() =>
    cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', this.class()),
  );
}
