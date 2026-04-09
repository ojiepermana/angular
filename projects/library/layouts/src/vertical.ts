import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'ngt-layout-vertical, layout-vertical',
  imports: [RouterOutlet],
  host: {
    class: 'block',
  },
  template: `
    <div class="layout min-h-screen bg-background p-0 text-foreground md:p-4">
      <div
        class="layout-content mx-auto flex min-h-screen w-full overflow-hidden border border-border bg-background text-foreground shadow-sm md:min-h-[calc(100vh-2rem)] md:rounded-4xl"
        style="max-width: var(--layout-container-max-width);"
      >
        <aside
          class="flex min-h-0 shrink-0 overflow-hidden border-r border-border"
          style="width: var(--layout-sidebar-width);"
        >
          <ng-content select="[navigation]">
            <div class="flex h-full w-full flex-col gap-4 px-4 py-5">
              <p class="text-[0.7rem] uppercase tracking-[0.28em] text-foreground/50">Layout</p>
              <div>
                <h1 class="text-base font-semibold">Vertical Shell</h1>
                <p class="mt-1 text-sm text-foreground/70">
                  Project navigation is projected into the sidebar slot.
                </p>
              </div>
            </div>
          </ng-content>
        </aside>

        <main class="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutVerticalComponent {}
