import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../core/cn/cn.util';

@Component({
  selector: 'ui-progress',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'classes()',
    '[attr.role]': '"progressbar"',
    '[attr.aria-valuemin]': '0',
    '[attr.aria-valuemax]': 'max()',
    '[attr.aria-valuenow]': 'indeterminate() ? null : clamped()',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.aria-labelledby]': 'ariaLabelledby()',
    '[attr.data-state]': 'indeterminate() ? "indeterminate" : "determinate"',
  },
  template: `
    <div
      class="ui-progress-indicator h-full w-full flex-1 bg-primary transition-transform"
      [style.transform]="indicatorTransform()"
    ></div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      :host[data-state='indeterminate'] .ui-progress-indicator {
        animation: ui-progress-indeterminate 1.5s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
      }
      @keyframes ui-progress-indeterminate {
        0% {
          transform: translateX(-100%);
        }
        100% {
          transform: translateX(100%);
        }
      }
      @media (prefers-reduced-motion: reduce) {
        :host[data-state='indeterminate'] .ui-progress-indicator {
          animation: none;
        }
      }
    `,
  ],
})
export class ProgressComponent {
  readonly value = input<number | null>(0);
  readonly max = input<number>(100);
  readonly indeterminate = input<boolean>(false);
  readonly ariaLabel = input<string | null>(null, { alias: 'aria-label' });
  readonly ariaLabelledby = input<string | null>(null, { alias: 'aria-labelledby' });
  readonly class = input<string>('');

  protected readonly clamped = computed(() => {
    const v = this.value() ?? 0;
    return Math.max(0, Math.min(this.max(), v));
  });

  protected readonly indicatorTransform = computed(() => {
    if (this.indeterminate()) return 'translateX(-100%)';
    const pct = (this.clamped() / this.max()) * 100;
    return `translateX(-${100 - pct}%)`;
  });

  protected readonly classes = computed(() =>
    cn('relative h-2 w-full overflow-hidden rounded-full bg-secondary', this.class()),
  );
}
