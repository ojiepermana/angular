import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../core/cn/cn.util';

@Component({
  selector: 'ui-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'classes()',
    '[attr.aria-hidden]': '"true"',
  },
  template: '',
})
export class SkeletonComponent {
  readonly class = input<string>('');

  protected readonly classes = computed(() => cn('animate-pulse rounded-md bg-muted', this.class()));
}
