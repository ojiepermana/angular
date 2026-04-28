import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ala-center',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  host: { class: 'block' },
  template: `
    <div
      class="min-h-screen bg-neutral-200 text-neutral-600 bg-[linear-gradient(rgba(212,212,212,0.45)_1px,transparent_1px),linear-gradient(to_right,rgba(212,212,212,0.45)_1px,transparent_1px)] bg-position-[center_center] bg-size-[2.775rem_2.775rem]">
      <div class="relative isolate grid min-h-screen overflow-hidden place-items-center">
        <div aria-hidden="true" class="pointer-events-none absolute inset-y-0 inset-x-0 z-20 px-20">
          <div class="relative mx-auto h-full w-full max-w-xl">
            <div class="absolute inset-y-0 left-0 w-px bg-neutral-400/70"></div>
            <div class="absolute inset-y-0 right-0 w-px bg-neutral-400/70"></div>
          </div>
        </div>

        <div class="relative w-full">
          <div
            aria-hidden="true"
            class="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-neutral-500/80"></div>
          <div
            aria-hidden="true"
            class="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-px bg-neutral-500/80"></div>
          <div class="relative z-10 mx-auto flex min-h-100 w-full max-w-xl flex-col bg-white/56"></div>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class Center {}
