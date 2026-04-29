import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'horizontal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
  host: { class: 'block' },
  template: `
    <div
      class="min-h-screen bg-neutral-200 text-neutral-600 bg-[linear-gradient(rgba(212,212,212,0.45)_1px,transparent_1px),linear-gradient(to_right,rgba(212,212,212,0.45)_1px,transparent_1px)] bg-position-[center_center] bg-size-[2.775rem_2.775rem]">
      <div class="relative isolate overflow-hidden py-18">
        <div aria-hidden="true" class="pointer-events-none absolute inset-y-0 inset-x-0 z-20 px-20">
          <div class="relative mx-auto h-full container">
            <div class="absolute inset-y-0 left-0 w-px bg-brand"></div>
            <div class="absolute inset-y-0 right-0 w-px bg-brand"></div>
          </div>
        </div>

        <div class="relative w-full">
          <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-brand"></div>
          <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-px bg-brand"></div>
          <div class="relative z-10 mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-xl flex-col bg-white/56">
            <header class="flex h-11 shrink-0 items-center">Header</header>
            <main class="flex-1">
              <router-outlet></router-outlet>
            </main>
            <footer class="flex h-11 shrink-0 items-center">Footer</footer>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class HorizontalLayout {}
