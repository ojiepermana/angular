import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../core/cn/cn.util';

@Component({
  selector: 'ui-card-description, p[ui-card-description]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
})
export class CardDescriptionComponent {
  readonly class = input<string>('');
  protected readonly classes = computed(() => cn('text-sm text-muted-foreground', this.class()));
}
