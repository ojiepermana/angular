import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../core/cn/cn.util';

@Component({
  selector: 'ui-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
})
export class CardComponent {
  readonly class = input<string>('');
  protected readonly classes = computed(() =>
    cn('rounded-lg border bg-card text-card-foreground shadow-sm', this.class()),
  );
}
