import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonComponent } from '@ojiepermana/angular/component';

import { ShellLayoutComponent } from '@ojiepermana/angular/layout';

@Component({
  selector: 'demo-shadcn-button-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ShellLayoutComponent, ButtonComponent],
  template: `
    <ui-shell
      title="Button"
      description="Native <button> / <a> styled through cva variants. Supports default, secondary, destructive, outline, ghost, link, plus 4 sizes.">
      <section class="mb-10">
        <h2 class="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Variants</h2>
        <div class="flex flex-wrap items-center gap-3">
          <button ui-button variant="default">Default</button>
          <button ui-button variant="secondary">Secondary</button>
          <button ui-button variant="destructive">Destructive</button>
          <button ui-button variant="outline">Outline</button>
          <button ui-button variant="ghost">Ghost</button>
          <button ui-button variant="link">Link</button>
        </div>
      </section>

      <section class="mb-10">
        <h2 class="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Sizes</h2>
        <div class="flex flex-wrap items-center gap-3">
          <button ui-button size="sm">Small</button>
          <button ui-button size="default">Default</button>
          <button ui-button size="lg">Large</button>
          <button ui-button size="icon" aria-label="Star">★</button>
        </div>
      </section>

      <section class="mb-10">
        <h2 class="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">States</h2>
        <div class="flex flex-wrap items-center gap-3">
          <button ui-button variant="default" disabled>Disabled</button>
          <button ui-button variant="outline" disabled>Outline disabled</button>
          <a ui-button variant="link" href="#">Link anchor</a>
        </div>
      </section>
    </ui-shell>
  `,
})
export class ButtonPageComponent {}
