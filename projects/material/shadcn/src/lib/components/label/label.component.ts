import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../core/cn/cn.util';

@Component({
  selector: 'ui-label, label[ui-label]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'classes()',
    '[attr.for]': 'for() || null',
  },
  template: `<ng-content />`,
})
export class LabelComponent {
  readonly for = input<string | null>(null);
  readonly class = input<string>('');

  protected readonly classes = computed(() =>
    cn(
      'text-sm font-medium leading-none text-foreground',
      'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      this.class(),
    ),
  );
}
