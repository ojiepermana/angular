import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ButtonComponent, ProgressComponent } from '@ojiepermana/material/shadcn';

import { PageShellComponent } from '../../../core/page-shell/page-shell';

@Component({
  selector: 'demo-shadcn-progress-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageShellComponent, ButtonComponent, ProgressComponent],
  template: `
    <demo-page-shell title="Progress" description="Determinate and indeterminate progress indicators.">
      <section class="mb-10 grid max-w-lg gap-4">
        <h2 class="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Determinate</h2>
        <ui-progress class="h-2 overflow-hidden rounded-full bg-secondary" [value]="value()" />
        <div class="flex items-center gap-2">
          <button ui-button size="sm" variant="outline" (click)="dec()">-10</button>
          <button ui-button size="sm" variant="outline" (click)="inc()">+10</button>
          <span class="text-sm text-muted-foreground">{{ value() }}%</span>
        </div>
      </section>

      <section class="mb-10 grid max-w-lg gap-3">
        <h2 class="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Indeterminate</h2>
        <ui-progress class="h-2 overflow-hidden rounded-full bg-secondary" [indeterminate]="true" />
      </section>
    </demo-page-shell>
  `,
})
export class ProgressPageComponent {
  protected readonly value = signal(40);
  protected inc(): void {
    this.value.update((v) => Math.min(100, v + 10));
  }
  protected dec(): void {
    this.value.update((v) => Math.max(0, v - 10));
  }
}
