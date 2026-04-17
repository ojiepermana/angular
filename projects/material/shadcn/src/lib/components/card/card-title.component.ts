import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../core/cn/cn.util';

@Component({
  selector: 'ui-card-title, h3[ui-card-title]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
})
export class CardTitleComponent {
  readonly class = input<string>('');
  protected readonly classes = computed(() =>
    cn('text-lg font-semibold leading-none tracking-tight', this.class()),
  );
}
