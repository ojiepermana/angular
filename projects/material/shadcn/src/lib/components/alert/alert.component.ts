import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../core/cn/cn.util';
import { alertVariants, type AlertVariant } from './alert.variants';

@Component({
  selector: 'ui-alert',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'classes()',
    '[attr.role]': '"alert"',
  },
  template: `<ng-content />`,
})
export class AlertComponent {
  readonly variant = input<AlertVariant>('default');
  readonly class = input<string>('');

  protected readonly classes = computed(() => cn(alertVariants({ variant: this.variant() }), this.class()));
}

@Component({
  selector: 'ui-alert-title, h5[ui-alert-title]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
})
export class AlertTitleComponent {
  readonly class = input<string>('');
  protected readonly classes = computed(() => cn('mb-1 font-medium leading-none tracking-tight', this.class()));
}

@Component({
  selector: 'ui-alert-description',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
})
export class AlertDescriptionComponent {
  readonly class = input<string>('');
  protected readonly classes = computed(() => cn('text-sm [&_p]:leading-relaxed', this.class()));
}
