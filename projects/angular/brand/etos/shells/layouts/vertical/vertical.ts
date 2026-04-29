import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { SidebarComponent, type SidebarAppearance, type SidebarPosition } from '@ojiepermana/angular/navigation';
import { LayoutService } from '@ojiepermana/angular/layout';

@Component({
  selector: 'vertical',
  imports: [SidebarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block h-dvh overflow-hidden',
    '[attr.data-layout-width]': 'layoutWidth()',
  },
  template: `
    <div
      class="h-full overflow-hidden bg-neutral-200 text-neutral-600 bg-[linear-gradient(rgba(212,212,212,0.65)_1px,transparent_1px),linear-gradient(to_right,rgba(212,212,212,0.65)_1px,transparent_1px)] bg-position-[center_center] bg-size-[2.775rem_2.775rem]">
      <div class="relative isolate h-full overflow-hidden py-18">
        <div class="-mx-18 relative h-full border-y border-brand">
          <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 inset-y-8">
            <div class="absolute inset-x-0 top-3.75 h-px bg-brand"></div>
            <div class="absolute inset-x-0 bottom-3.75 h-px bg-brand"></div>
          </div>
          <div class="h-full px-20">
            <div
              class="relative mx-auto grid h-full w-fit max-w-full grid-cols-[auto_minmax(0,80rem)] items-stretch bg-background/65">
              <div
                aria-hidden="true"
                class="pointer-events-none absolute bottom-[-100vh] left-0 top-[-100vh] z-20 w-px bg-brand"></div>
              <div
                aria-hidden="true"
                class="pointer-events-none absolute bottom-[-100vh] right-0 top-[-100vh] z-20 w-px bg-brand"></div>
              <nav class="relative h-full min-h-0 shrink-0 overflow-visible border-r border-brand">
                <div
                  aria-hidden="true"
                  class="pointer-events-none absolute bottom-[-100vh] left-full top-[-100vh] -z-10 w-px bg-brand"></div>
                <ui-sidebar
                  class="h-full"
                  [appearance]="sidebarAppearance()"
                  [position]="sidebarPosition()"
                  [ariaLabel]="ariaLabel()" />
              </nav>
              <main class="min-w-0 overflow-y-auto">
                <!-- <router-outlet /> -->
              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class VerticalLayout {
  private readonly layout = inject(LayoutService);

  readonly sidebarAppearance = input<SidebarAppearance>('default');
  readonly sidebarPosition = input<SidebarPosition>('left');
  readonly ariaLabel = input<string>('Primary');

  protected readonly layoutWidth = this.layout.width;
}
