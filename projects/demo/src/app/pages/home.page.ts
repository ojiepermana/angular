import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PageShellComponent } from '../core/page-shell/page-shell';

@Component({
  selector: 'demo-home-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageShellComponent, RouterLink],
  template: `
    <demo-page-shell
      title="@ojiepermana/material"
      description="Design tokens, layouts, navigation, and shadcn-styled components for Angular — all theme-aware via a shared token system.">
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <a
          class="group rounded-lg border border-border bg-card p-5 transition-colors hover:border-foreground/40"
          [routerLink]="'/ui/chart'">
          <h3 class="text-sm font-semibold text-foreground">Charts</h3>
          <p class="mt-1 text-xs text-muted-foreground">
            Cartesian and polar chart primitives with scoped themes, legends, and tooltips.
          </p>
        </a>
        <a
          class="group rounded-lg border border-border bg-card p-5 transition-colors hover:border-foreground/40"
          [routerLink]="'/ui/shadcn/button'">
          <h3 class="text-sm font-semibold text-foreground">shadcn/ui showcase</h3>
          <p class="mt-1 text-xs text-muted-foreground">
            34 components with variants and states that follow the active theme.
          </p>
        </a>
        <a
          class="group rounded-lg border border-border bg-card p-5 transition-colors hover:border-foreground/40"
          [routerLink]="'/ui/material/button'">
          <h3 class="text-sm font-semibold text-foreground">Angular Material</h3>
          <p class="mt-1 text-xs text-muted-foreground">
            Material M3 components, themed through the shared token bridge.
          </p>
        </a>
        <a
          class="group rounded-lg border border-border bg-card p-5 transition-colors hover:border-foreground/40"
          [routerLink]="'/ui/cdk/a11y'">
          <h3 class="text-sm font-semibold text-foreground">Angular CDK</h3>
          <p class="mt-1 text-xs text-muted-foreground">Headless primitives for a11y, overlays, layouts, and more.</p>
        </a>
      </div>
    </demo-page-shell>
  `,
})
export class HomePageComponent {}
