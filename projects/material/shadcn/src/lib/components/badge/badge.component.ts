import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../core/cn/cn.util';
import { badgeVariants, type BadgeVariant } from './badge.variants';

@Component({
  selector: 'ui-badge, span[ui-badge]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
})
export class BadgeComponent {
  readonly variant = input<BadgeVariant>('default');
  readonly class = input<string>('');

  protected readonly classes = computed(() =>
    cn(badgeVariants({ variant: this.variant() }), this.class()),
  );
}
