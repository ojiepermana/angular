import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../core/cn/cn.util';

export type SeparatorOrientation = 'horizontal' | 'vertical';

@Component({
  selector: 'ui-separator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'classes()',
    '[attr.role]': 'decorative() ? "none" : "separator"',
    '[attr.aria-orientation]': 'decorative() ? null : orientation()',
    '[attr.data-orientation]': 'orientation()',
  },
  template: '',
})
export class SeparatorComponent {
  readonly orientation = input<SeparatorOrientation>('horizontal');
  readonly decorative = input<boolean>(true);
  readonly class = input<string>('');

  protected readonly classes = computed(() =>
    cn(
      'shrink-0 bg-border',
      this.orientation() === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
      this.class(),
    ),
  );
}
