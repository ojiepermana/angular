import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../core/cn/cn.util';

@Component({
  selector: 'ui-dialog-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
})
export class DialogHeaderComponent {
  readonly class = input<string>('');
  protected readonly classes = computed(() => cn('flex flex-col gap-1.5 text-center sm:text-left', this.class()));
}

@Component({
  selector: 'ui-dialog-title, h2[ui-dialog-title]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
})
export class DialogTitleComponent {
  readonly class = input<string>('');
  protected readonly classes = computed(() => cn('text-lg font-semibold leading-none tracking-tight', this.class()));
}

@Component({
  selector: 'ui-dialog-description, p[ui-dialog-description]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
})
export class DialogDescriptionComponent {
  readonly class = input<string>('');
  protected readonly classes = computed(() => cn('text-sm text-muted-foreground', this.class()));
}

@Component({
  selector: 'ui-dialog-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
})
export class DialogContentComponent {
  readonly class = input<string>('');
  protected readonly classes = computed(() => cn('grid gap-4', this.class()));
}

@Component({
  selector: 'ui-dialog-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
})
export class DialogFooterComponent {
  readonly class = input<string>('');
  protected readonly classes = computed(() =>
    cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-2', this.class()),
  );
}
