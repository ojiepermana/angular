import { ChangeDetectionStrategy, Component, computed, inject, input, type TemplateRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { SidebarComponent, type SidebarAppearance, type SidebarPosition } from '@ojiepermana/angular/navigation';
import { LayoutService } from '@ojiepermana/angular/layout';

@Component({
  selector: 'vertical',
  imports: [NgTemplateOutlet, RouterOutlet, SidebarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block h-dvh overflow-hidden',
    '[attr.data-layout-width]': 'layoutWidth()',
  },
  template: `
    <!-- prettier-ignore -->
    <div class="h-full overflow-hidden bg-neutral-200   bg-[linear-gradient(rgba(212,212,212,0.65)_1px,transparent_1px),linear-gradient(to_right,rgba(212,212,212,0.65)_1px,transparent_1px)] bg-position-[center_center] bg-size-[2.775rem_2.775rem]">
      <div [class]="shellClasses()">
        <div class="-mx-18 relative h-full border-y border-brand">
          <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 inset-y-8">
            <div class="absolute inset-x-0 top-3.75 h-px bg-brand"></div>
            <div class="absolute inset-x-0 bottom-3.75 h-px bg-brand"></div>
          </div>
          <div class="h-full px-20">
            <div [class]="gridClasses()">
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
                <sidebar
                  class="h-full"
                  [appearance]="sidebarAppearance()"
                  [position]="sidebarPosition()"
                  [ariaLabel]="ariaLabel()">
                  @if (sidebarHeaderTemplate(); as headerTemplate) {
                    <div sidebar-header class="contents">
                      <ng-container [ngTemplateOutlet]="headerTemplate" />
                    </div>
                  }
                  @if (sidebarFooterTemplate(); as footerTemplate) {
                    <div sidebar-footer class="contents">
                      <ng-container [ngTemplateOutlet]="footerTemplate" />
                    </div>
                  }
                </sidebar>
              </nav>
              <main class="relative min-w-0 overflow-y-auto">
                <router-outlet />
                <div class="pointer-events-none absolute right-4 top-4 z-30">
                  <div
                    class="inline-flex min-w-20 items-center justify-center rounded-full border border-brand bg-white/85 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-foreground shadow-sm backdrop-blur-sm"
                    aria-label="Current breakpoint identifier">
                    <span class="sm:hidden">mobile</span>
                    <span class="hidden sm:inline md:hidden">sm</span>
                    <span class="hidden md:inline lg:hidden">md</span>
                    <span class="hidden lg:inline">lg</span>
                  </div>
                </div>
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
  readonly sidebarHeaderTemplate = input<TemplateRef<unknown> | null>(null);
  readonly sidebarFooterTemplate = input<TemplateRef<unknown> | null>(null);

  protected readonly layoutWidth = this.layout.width;
  protected readonly shellClasses = computed(() => {
    switch (this.layoutWidth()) {
      case 'full':
        return 'relative isolate h-full overflow-hidden py-2';
      case 'wide':
        return 'relative isolate h-full overflow-hidden py-2 lg:py-10';
      default:
        return 'relative isolate h-full overflow-hidden py-2  lg:py-18';
    }
  });

  protected readonly gridClasses = computed(() => {
    switch (this.layoutWidth()) {
      case 'full':
        return 'relative mx-auto grid h-full w-fit max-w-full grid-cols-[auto_minmax(0,100rem)] items-stretch bg-background/65';
      case 'wide':
        return 'relative mx-auto grid h-full w-fit max-w-full grid-cols-[auto_minmax(0,100rem)] items-stretch bg-background/65  lg:grid-cols-[auto_minmax(0,95rem)]';
      default:
        return 'relative mx-auto grid h-full w-fit max-w-full grid-cols-[auto_minmax(0,100rem)] items-stretch bg-background/65  lg:grid-cols-[auto_minmax(0,65rem)]';
    }
  });
}
