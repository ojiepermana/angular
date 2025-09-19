import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'layout',
  imports: [],
  template: `
    <div id="minibar" class="flex flex-col p-2  items-center h-full bg-gray-2 dark:bg-black/90 border-r">
          <!-- Theme Toggle Component -->
          <div class="mb-4"> </div>
       </div>
      <div id="content" class="flex h-full flex-1 flex-col bg-white dark:bg-black/90 text-neutral-12 overflow-hidden">
      <header class=" p-3 border-b">
        <div class="flex items-center justify-between">
          <h1 class="text-lg font-semibold"> Edsis</h1>
          <div class="text-sm text-neutral-11">
            <!-- themes infor -->
          </div>
        </div>
      </header>
        <main class="flex flex-row h-full overflow-hidden">
          <!-- Main Conten MFE -->
          <aside class="w-64 h-full p-4 border-r"></aside>
          <main class="flex-1 h-full overflow-auto"></main>
          <!-- End Main Content MFE -->
        </main>
        <footer class="text-neutral-12 p-3 border-t">
          <div class="flex items-center justify-between text-sm">
            <span>edsis © 2025</span>
            <span class="text-neutral-11">
              Built with ❤️ by Ojie Permana
            </span>
          </div>
        </footer>
      </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Layout {

}
