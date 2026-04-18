import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonComponent, TooltipDirective } from '@ojiepermana/angular/component';

import { PageShellComponent } from '../../../core/page-shell/page-shell';

@Component({
  selector: 'demo-shadcn-tooltip-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageShellComponent, ButtonComponent, TooltipDirective],
  template: `
    <demo-page-shell title="Tooltip" description="Contextual hint on hover or focus — thin wrapper around matTooltip.">
      <section class="mb-10">
        <h2 class="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Positions</h2>
        <div class="flex flex-wrap items-center gap-3">
          <button ui-button variant="outline" [uiTooltip]="'Above'" uiTooltipPosition="above">Above</button>
          <button ui-button variant="outline" [uiTooltip]="'Below'" uiTooltipPosition="below">Below</button>
          <button ui-button variant="outline" [uiTooltip]="'Before'" uiTooltipPosition="before">Before</button>
          <button ui-button variant="outline" [uiTooltip]="'After'" uiTooltipPosition="after">After</button>
        </div>
      </section>
    </demo-page-shell>
  `,
})
export class TooltipPageComponent {}
