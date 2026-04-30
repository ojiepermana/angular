import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, type TemplateRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopbarComponent } from '@ojiepermana/angular/navigation';

@Component({
  selector: 'horizontal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, RouterOutlet, TopbarComponent],
  host: { class: 'block' },
  template: `
    <div
      class="min-h-screen bg-neutral-200 text-neutral-600 bg-[linear-gradient(rgba(212,212,212,0.45)_1px,transparent_1px),linear-gradient(to_right,rgba(212,212,212,0.45)_1px,transparent_1px)] bg-position-[center_center] bg-size-[2.775rem_2.775rem]">
      <div class="relative isolate overflow-hidden py-18">
        <div aria-hidden="true" class="pointer-events-none absolute inset-0">
          <div class="absolute inset-x-0 top-61 h-px -translate-y-32 bg-brand"></div>
          <div class="absolute inset-x-0 bottom-61 h-px translate-y-32 bg-brand"></div>
        </div>
        <div aria-hidden="true" class="pointer-events-none absolute inset-y-0 inset-x-0">
          <div class="relative mx-auto h-full container">
            <div class="absolute inset-y-0 left-0 w-px bg-brand"></div>
            <div class="absolute inset-y-0 right-0 w-px bg-brand"></div>
          </div>
        </div>

        <div class="border border-brand">
          <div class="mx-auto container flex min-h-[calc(100vh-8rem)] flex-col bg-background/65">
            <nav>
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
            <main class="min-h-0 flex-1 overflow-y-auto">
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
  readonly brandTemplate = input<TemplateRef<unknown> | null>(null);
  readonly profileTemplate = input<TemplateRef<unknown> | null>(null);
}
