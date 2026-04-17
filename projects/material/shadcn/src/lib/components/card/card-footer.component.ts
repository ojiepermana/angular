import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../core/cn/cn.util';

@Component({
  selector: 'ui-card-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
})
export class CardFooterComponent {
  readonly class = input<string>('');
  protected readonly classes = computed(() => cn('flex items-center p-6 pt-0', this.class()));
}
