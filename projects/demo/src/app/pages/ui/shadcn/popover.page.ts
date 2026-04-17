import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonComponent, PopoverContentDirective, PopoverTriggerDirective } from '@ojiepermana/material/shadcn';

import { PageShellComponent } from '../../../core/page-shell/page-shell';

@Component({
  selector: 'demo-shadcn-popover-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageShellComponent, ButtonComponent, PopoverContentDirective, PopoverTriggerDirective],
  template: `
    <demo-page-shell title="Popover" description="Floating panel anchored to a trigger with positioning and dismiss.">
      <section class="mb-10">
        <button ui-button variant="outline" [uiPopoverTrigger]="pop">Open popover</button>
        <ng-template uiPopoverContent #pop="uiPopoverContent">
          <div class="w-72 rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-md">
            <h3 class="text-sm font-semibold">Dimensions</h3>
            <p class="mt-1 text-xs text-muted-foreground">Set the dimensions for the layer.</p>
            <div class="mt-3 grid gap-2 text-xs">
              <div class="flex items-center justify-between"><span>Width</span><span class="font-mono">100%</span></div>
              <div class="flex items-center justify-between">
                <span>Max width</span><span class="font-mono">400px</span>
              </div>
              <div class="flex items-center justify-between">
                <span>Height</span><span class="font-mono">auto</span>
              </div>
            </div>
          </div>
        </ng-template>
      </section>
    </demo-page-shell>
  `,
})
export class PopoverPageComponent {}
