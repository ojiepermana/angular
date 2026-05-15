import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../core/cn/cn.util';

/**
 * Lightweight scroll area using native scrollbars styled via CSS.
 * Fully accessible — real scrolling, keyboard, wheel, momentum.
 */
@Component({
  selector: 'ui-scroll-area',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'classes()',
  },
  template: `<div [class]="viewportClasses()"><ng-content /></div>`,
  styles: [
    `
      :host {
        display: block;
        overflow: hidden;
        position: relative;
      }
      .ui-scroll-area-viewport {
        overflow: auto;
        scrollbar-width: thin;
        scrollbar-color: var(--tw-scrollbar-thumb, hsl(var(--border))) var(--tw-scrollbar-track, transparent);
      }
      .ui-scroll-area-viewport::-webkit-scrollbar {
        width: 10px;
        height: 10px;
      }
      .ui-scroll-area-viewport::-webkit-scrollbar-track {
        background: var(--tw-scrollbar-track, transparent);
      }
      .ui-scroll-area-viewport::-webkit-scrollbar-thumb {
        background: var(--tw-scrollbar-thumb, hsl(var(--border)));
        border: var(--border-width) solid transparent;
        background-clip: padding-box;
        border-radius: var(--radius-lg);
      }
      .ui-scroll-area-viewport::-webkit-scrollbar-thumb:hover {
        background: var(--ui-scrollbar-thumb-hover, var(--tw-scrollbar-thumb, hsl(var(--muted-foreground))));
        background-clip: padding-box;
      }
      @media (forced-colors: active) {
        .ui-scroll-area-viewport {
          scrollbar-width: auto;
          scrollbar-color: auto;
        }
        .ui-scroll-area-viewport::-webkit-scrollbar-thumb {
          background: CanvasText;
          border-color: transparent;
        }
      }
    `,
  ],
})
export class ScrollAreaComponent {
  readonly class = input<string>('');
  readonly viewportClass = input<string>('');
  protected readonly classes = computed(() => cn('relative overflow-hidden', this.class()));
  protected readonly viewportClasses = computed(() =>
    cn('ui-scroll-area-viewport h-full w-full', this.viewportClass()),
  );
}
