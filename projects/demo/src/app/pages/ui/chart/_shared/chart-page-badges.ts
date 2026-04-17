import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'demo-chart-page-badges',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-wrap gap-2' },
  template: `
    @for (label of labels(); track label) {
      <span
        class="rounded-full border border-border bg-background px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {{ label }}
      </span>
    }
  `,
})
export class ChartPageBadgesComponent {
  readonly labels = input.required<readonly string[]>();
}
