import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, type TemplateRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutService } from '@ojiepermana/angular/layout';
import { TopbarComponent } from '@ojiepermana/angular/navigation';

@Component({
  selector: 'horizontal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, RouterOutlet, TopbarComponent],
  host: {
    class: 'block',
    '[attr.data-layout-width]': 'layoutWidth()',
  },
  template: `
    <div
      class="min-h-screen bg-neutral-200 text-neutral-600 bg-[linear-gradient(rgba(212,212,212,0.45)_1px,transparent_1px),linear-gradient(to_right,rgba(212,212,212,0.45)_1px,transparent_1px)] bg-position-[center_center] bg-size-[2.775rem_2.775rem]">
      <div [class]="shellClasses()">
        <div aria-hidden="true" [class]="railOverlayClasses()">
          <div [class]="railGuideClasses()">
            <div class="absolute inset-y-0 left-0 w-px bg-brand"></div>
            <div class="absolute inset-y-0 right-0 w-px bg-brand"></div>
          </div>
        </div>

        <div [class]="frameClasses()">
          <div aria-hidden="true" class="pointer-events-none absolute inset-0 z-0">
            <div class="absolute inset-x-0 top-11 h-px bg-brand"></div>
            <div class="absolute inset-x-0 bottom-11 h-px bg-brand"></div>
          </div>
          <div aria-hidden="true" class="pointer-events-none absolute inset-0 z-10">
            <div [class]="maskClasses()"></div>
          </div>
          <div [class]="contentClasses()">
            <nav class="shrink-0">
              <topbar class="shrink-0" [showHamburger]="false">
                @if (brandTemplate(); as brand) {
                  <div topbar-start class="min-w-0">
                    <ng-container [ngTemplateOutlet]="brand" />
                  </div>
                }

                @if (profileTemplate(); as profile) {
                  <div topbar-end class="flex min-w-0 items-center">
                    <ng-container [ngTemplateOutlet]="profile" />
                  </div>
                }
              </topbar>
            </nav>
            <main class="min-h-0 flex-1 overflow-auto">
              <router-outlet />
            </main>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class HorizontalLayout {
  private readonly layout = inject(LayoutService);

  readonly brandTemplate = input<TemplateRef<unknown> | null>(null);
  readonly profileTemplate = input<TemplateRef<unknown> | null>(null);

  protected readonly layoutWidth = this.layout.width;
  protected readonly shellClasses = computed(() => {
    switch (this.layoutWidth()) {
      case 'full':
        return 'relative isolate box-border h-dvh overflow-hidden py-3';
      case 'wide':
        return 'relative isolate box-border h-dvh overflow-hidden py-3 lg:py-10';
      default:
        return 'relative isolate box-border h-dvh overflow-hidden py-3 lg:py-20';
    }
  });

  protected readonly railOverlayClasses = computed(() => {
    const classes = ['pointer-events-none', 'absolute', 'inset-y-0', 'inset-x-0', 'z-20'];
    if (this.layoutWidth() === 'full') {
      classes.push('px-3');
    } else if (this.layoutWidth() === 'wide') {
      classes.push('px-3', 'lg:px-15');
    } else {
      classes.push('px-3', 'lg:px-15');
    }
    return classes.join(' ');
  });

  protected readonly railGuideClasses = computed(() =>
    this.layoutWidth() === 'container' ? 'relative mx-auto h-full w-full max-w-7xl' : 'relative mx-auto h-full w-full',
  );

  protected readonly frameClasses = computed(() => {
    const classes = ['relative', 'z-10', 'h-full', 'min-h-0', 'border', 'border-brand'];
    if (this.layoutWidth() === 'full') {
      classes.push('px-3');
    } else if (this.layoutWidth() === 'wide') {
      classes.push('px-3', 'lg:px-15');
    } else {
      classes.push('px-3', 'lg:px-15');
    }
    return classes.join(' ');
  });

  protected readonly maskClasses = computed(() => {
    const classes = ['h-full', 'bg-position-[center_center]', 'bg-size-[2.775rem_2.775rem]'];
    if (this.layoutWidth() === 'container') {
      classes.unshift('mx-auto', 'w-full', 'max-w-7xl');
    } else {
      classes.unshift('mx-auto', 'w-full');
    }
    return classes.join(' ');
  });

  protected readonly contentClasses = computed(() => {
    const classes = [
      'relative',
      'z-20',
      'mx-auto',
      'flex',
      'h-full',
      'min-h-0',
      'flex-col',
      'overflow-hidden',
      'bg-background/65',
    ];
    if (this.layoutWidth() === 'container') {
      classes.push('w-full', 'max-w-7xl');
    } else {
      classes.push('w-full');
    }
    return classes.join(' ');
  });
}
