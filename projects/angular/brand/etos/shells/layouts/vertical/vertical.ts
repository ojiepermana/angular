import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'vertical',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  host: { class: 'block' },
  template: `
    <div
      class="min-h-screen bg-neutral-200 text-neutral-600 bg-[linear-gradient(rgba(212,212,212,0.65)_1px,transparent_1px),linear-gradient(to_right,rgba(212,212,212,0.65)_1px,transparent_1px)] bg-position-[center_center] bg-size-[2.775rem_2.775rem]">
      <div class="relative isolate overflow-hidden py-18">
        <div class="border border-neutral-400/70 px-20">
          <div
            class="relative mx-auto grid min-h-[calc(100vh-8rem)] w-fit max-w-full grid-cols-[auto_minmax(0,80rem)] items-stretch bg-white/68">
            <div
              aria-hidden="true"
              class="pointer-events-none absolute bottom-[-100vh] left-0 top-[-100vh] z-20 w-px bg-neutral-400/70"></div>
            <div
              aria-hidden="true"
              class="pointer-events-none absolute bottom-[-100vh] right-0 top-[-100vh] z-20 w-px bg-neutral-400/70"></div>
            <nav class="relative shrink-0">
              <div
                aria-hidden="true"
                class="pointer-events-none absolute bottom-[-100vh] left-full top-[-100vh] -z-10 w-px bg-neutral-400/70"></div>
              Navbarsssss
            </nav>
            <main class="min-w-0 max-w-7xl"></main>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class VerticalLayout {}
