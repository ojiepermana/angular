import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SeparatorComponent } from '@ojiepermana/angular/component';

import { ShellLayoutComponent } from '@ojiepermana/angular/layout';

@Component({
  selector: 'demo-shadcn-separator-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ShellLayoutComponent, SeparatorComponent],
  template: `
    <ui-shell title="Separator" description="Thin divider with semantic role toggle.">
      <section class="mb-10 max-w-md">
        <h2 class="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Horizontal</h2>
        <div>
          <h4 class="text-sm font-medium">Radix Primitives</h4>
          <p class="text-sm text-muted-foreground">Accessible, unstyled building blocks.</p>
          <ui-separator class="my-4" />
          <div class="flex h-5 items-center gap-4 text-sm">
            <div>Blog</div>
            <ui-separator orientation="vertical" />
            <div>Docs</div>
            <ui-separator orientation="vertical" />
            <div>Source</div>
          </div>
        </div>
      </section>
    </ui-shell>
  `,
})
export class SeparatorPageComponent {}
