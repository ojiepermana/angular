import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'empty',
  imports: [RouterOutlet],
  template: `
    <div
      class="h-dvh overflow-hidden bg-neutral-200  bg-[linear-gradient(rgba(212,212,212,0.45)_1px,transparent_1px),linear-gradient(to_right,rgba(212,212,212,0.45)_1px,transparent_1px)] bg-position-[center_center] bg-size-[2.775rem_2.775rem]">
      <div class="relative isolate box-border h-full overflow-hidden py-3">
        <div aria-hidden="true" class="pointer-events-none absolute inset-y-0 inset-x-0 px-3">
          <div class="relative mx-auto h-full w-full">
            <div class="absolute inset-y-0 left-0 w-px bg-brand"></div>
            <div class="absolute inset-y-0 right-0 w-px bg-brand"></div>
          </div>
        </div>

        <div class="h-full min-h-0 border border-brand px-3">
          <main class="mx-auto w-full h-full min-h-0 overflow-y-auto bg-background/65">
            <router-outlet />
          </main>
        </div>
      </div>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyLayout {}
