import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  CardComponent,
  CardContentComponent,
  CardDescriptionComponent,
  CardFooterComponent,
  CardHeaderComponent,
  CardTitleComponent,
} from '@ojiepermana/material/shadcn';

@Component({
  selector: 'demo-chart-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CardComponent,
    CardContentComponent,
    CardDescriptionComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleComponent,
  ],
  host: { class: 'block h-full' },
  template: `
    <ui-card class="h-full overflow-hidden rounded-[1.75rem] border border-border/70 bg-card shadow-sm">
      <ui-card-header class="gap-4 p-5 pb-0">
        <div class="flex items-start justify-between gap-3">
          <div>
            <h3 ui-card-title class="text-lg font-semibold text-foreground">{{ title() }}</h3>
            <p ui-card-description class="mt-1 max-w-xl text-sm text-muted-foreground">{{ description() }}</p>
          </div>
          @if (badge()) {
            <span
              class="rounded-full border border-border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {{ badge() }}
            </span>
          }
        </div>
        <ng-content select="[demo-card-toolbar]" />
      </ui-card-header>

      <ui-card-content class="p-5">
        <div [class]="panelClassName()">
          <div [class]="chartClassName()">
            <ng-content />
          </div>
        </div>
        <ng-content select="[demo-card-after]" />
      </ui-card-content>

      @if (footerTrend() || footerMeta()) {
        <ui-card-footer class="flex-col items-start gap-1 border-t border-border/60 px-5 py-4 text-sm">
          @if (footerTrend()) {
            <p class="font-medium text-foreground">{{ footerTrend() }}</p>
          }
          @if (footerMeta()) {
            <p class="text-muted-foreground">{{ footerMeta() }}</p>
          }
        </ui-card-footer>
      }
    </ui-card>
  `,
})
export class ChartDemoCardComponent {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly badge = input<string>('');
  readonly footerTrend = input<string>('');
  readonly footerMeta = input<string>('');
  readonly chartClassName = input<string>('aspect-[5/3] w-full');
  readonly panelClassName = input<string>(
    'flex items-center justify-center rounded-[1.35rem] border border-border/60 bg-linear-to-br from-background to-muted/25 p-3',
  );
}
