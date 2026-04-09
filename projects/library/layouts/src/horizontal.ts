import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'ngt-layout-horizontal, layout-horizontal',
  imports: [RouterOutlet],
  host: {
    class: 'block',
  },
  template: `
    <div class="layout min-h-screen bg-background p-0 text-foreground md:p-4">
      <div
        class="layout-content relative mx-auto flex min-h-screen w-full flex-col overflow-hidden border border-border bg-background text-foreground shadow-sm md:min-h-[calc(100vh-2rem)] md:rounded-[2rem]"
        style="max-width: var(--layout-container-max-width);"
      >
        <header class="overflow-hidden border-b border-border px-4 sm:px-5">
          <div class="flex min-h-16 items-center gap-4">
            <div class="flex min-w-0 flex-1 items-center justify-start overflow-hidden">
              <ng-content select="[headerBrand]">
                <div class="flex min-w-0 items-center gap-3">
                  <div
                    class="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-border text-sm font-semibold"
                    aria-hidden="true"
                  >
                    N
                  </div>
                  <div class="min-w-0">
                    <p
                      class="truncate text-[0.7rem] uppercase tracking-[0.28em] text-foreground/50"
                    >
                      Layout
                    </p>
                    <h1 class="truncate text-sm font-semibold leading-5">Horizontal Shell</h1>
                  </div>
                </div>
              </ng-content>
            </div>

            <div class="hidden min-w-0 flex-1 items-center justify-center overflow-hidden lg:flex">
              <div
                class="flex min-w-0 flex-nowrap items-center justify-center gap-3 overflow-x-auto whitespace-nowrap"
              >
                <ng-content select="[headerNavigation]"></ng-content>
                <ng-content select="[header]"></ng-content>
              </div>
            </div>

            <div
              class="flex min-w-0 flex-1 items-center justify-end gap-2 overflow-hidden whitespace-nowrap"
            >
              <ng-content select="[headerActions]"></ng-content>
            </div>
          </div>

          <div
            class="flex min-h-12 items-center gap-3 overflow-x-auto border-t border-border lg:hidden"
          >
            <ng-content select="[headerNavigation]"></ng-content>
            <ng-content select="[header]"></ng-content>
          </div>
        </header>

        <main class="flex flex-1 min-h-0 overflow-y-auto">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutHorizontalComponent {}