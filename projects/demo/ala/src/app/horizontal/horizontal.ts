import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ala-horizontal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  host: { class: 'block' },
  template: `
    <div
      class="min-h-screen bg-neutral-200 text-neutral-600 bg-[linear-gradient(rgba(212,212,212,0.45)_1px,transparent_1px),linear-gradient(to_right,rgba(212,212,212,0.45)_1px,transparent_1px)] bg-position-[center_center] bg-size-[2.775rem_2.775rem]">
      <div class="relative isolate overflow-hidden py-18">
        <div aria-hidden="true" class="pointer-events-none absolute inset-0">
          <div class="absolute inset-x-0 top-61 h-px -translate-y-32 bg-neutral-300"></div>
          <div class="absolute inset-x-0 bottom-61 h-px translate-y-32 bg-neutral-300"></div>
        </div>
        <div aria-hidden="true" class="pointer-events-none absolute inset-y-0 inset-x-0 px-20">
          <div class="relative mx-auto h-full container">
            <div class="absolute inset-y-0 left-0 w-px bg-neutral-300"></div>
            <div class="absolute inset-y-0 right-0 w-px bg-neutral-300"></div>
          </div>
        </div>

        <div class="border border-neutral-300 px-20">
          <div class="mx-auto container flex min-h-[calc(100vh-8rem)] flex-col bg-white">
            <header class="flex h-11 shrink-0 items-center border-b border-neutral-200">Header</header>
            <main class="flex-1">Content</main>
            <footer class="flex h-11 shrink-0 items-center border-t border-neutral-200">Footer</footer>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class Horizontal {}
