import { Directive, effect, inject, input } from '@angular/core';
import { MatTooltip, TooltipPosition } from '@angular/material/tooltip';

/**
 * Shadcn-styled tooltip directive. Thin wrapper around `matTooltip` that
 * forces the shadcn panel class and sensible defaults.
 *
 * @example
 * <button ui-button [uiTooltip]="'Save changes'" uiTooltipPosition="above">Save</button>
 */
@Directive({
  selector: '[uiTooltip]',
  hostDirectives: [
    {
      directive: MatTooltip,
      inputs: [
        'matTooltipPosition: uiTooltipPosition',
        'matTooltipDisabled: uiTooltipDisabled',
        'matTooltipShowDelay: uiTooltipShowDelay',
        'matTooltipHideDelay: uiTooltipHideDelay',
        'matTooltipTouchGestures: uiTooltipTouchGestures',
      ],
    },
  ],
  exportAs: 'uiTooltip',
})
export class TooltipDirective {
  private readonly tooltip = inject(MatTooltip, { host: true });

  readonly uiTooltip = input<string>('');

  constructor() {
    this.tooltip.tooltipClass = 'ui-tooltip-panel';
    effect(() => {
      this.tooltip.message = this.uiTooltip();
    });
  }

  show(): void {
    this.tooltip.show();
  }

  hide(): void {
    this.tooltip.hide();
  }
}

export type { TooltipPosition };
