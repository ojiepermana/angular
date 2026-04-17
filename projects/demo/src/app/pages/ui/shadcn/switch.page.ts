import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LabelComponent, SwitchComponent } from '@ojiepermana/material/shadcn';

import { PageShellComponent } from '../../../core/page-shell/page-shell';

@Component({
  selector: 'demo-shadcn-switch-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageShellComponent, FormsModule, LabelComponent, SwitchComponent],
  template: `
    <demo-page-shell title="Switch" description="Shadcn-styled slide toggle. Works with ngModel.">
      <section class="mb-10">
        <h2 class="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">States</h2>
        <div class="flex flex-col gap-3">
          <label ui-label class="flex items-center gap-2">
            <ui-switch [(ngModel)]="enabled" />
            <span>Airplane mode</span>
          </label>
          <label ui-label class="flex items-center gap-2 opacity-60">
            <ui-switch [ngModel]="true" [disabled]="true" />
            <span>Disabled + on</span>
          </label>
        </div>
        <p class="mt-3 text-sm text-muted-foreground">Airplane mode: {{ enabled() ? 'on' : 'off' }}</p>
      </section>
    </demo-page-shell>
  `,
})
export class SwitchPageComponent {
  protected readonly enabled = signal(false);
}
