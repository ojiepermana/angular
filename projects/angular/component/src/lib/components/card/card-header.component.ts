import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../core/cn/cn.util';

@Component({
  selector: 'ui-card-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
})
export class CardHeaderComponent {
  readonly class = input<string>('');
  protected readonly classes = computed(() => cn('flex flex-col gap-1.5 p-6', this.class()));
}
