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
        <div [class]="frameClasses()">
          <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 inset-y-8">
            <div class="absolute inset-x-0 top-3.75 h-px bg-brand"></div>
            <div class="absolute inset-x-0 bottom-3.75 h-px bg-brand"></div>
          </div>
          <div [class]="frameBodyClasses()">
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
              <main class="relative min-h-0 min-w-0 overflow-y-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-primary/10">
                <router-outlet />
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

  protected readonly frameClasses = computed(() => {
    if (this.layoutWidth() === 'wide') {
      return 'relative h-full border-y border-brand';
    }

    return '-mx-18 relative h-full border-y border-brand';
  });

  protected readonly frameBodyClasses = computed(() => {
    if (this.layoutWidth() === 'wide') {
      return 'h-full lg:px-10';
    }

    return 'h-full px-20';
  });

  protected readonly gridClasses = computed(() => {
    const classes = [
      'relative',
      'mx-auto',
      'grid',
      'h-full',
      'w-full',
      'max-w-full',
      'grid-cols-[auto_minmax(0,1fr)]',
      'items-stretch',
      'bg-background/65',
    ];

    switch (this.layoutWidth()) {
      case 'container':
        classes.push('lg:max-w-[var(--layout-vertical-shell-max-width)]');
        break;
      default:
        break;
    }

    return classes.join(' ');
  });
}
