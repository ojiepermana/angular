import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'demo-page',
  imports: [RouterOutlet],
  template: `
    <!-- Header -->
        <header class="p-2 border-b">
          <div class="flex items-center justify-between">
            <h1 class="text-lg font-semibold">Angular Kit</h1>
            <div class="text-sm">
              <!-- Theme info placeholder -->
              Right Menu
            </div>
          </div>
        </header>

        <!-- Main Content -->
        <main class="flex flex-1 overflow-hidden">
          <!-- Sidebar Navigation -->
          <aside class="w-64 border-r p-4">

          </aside>

          <!-- Page Content -->
          <div class="flex-1 overflow-auto p-6">
            <router-outlet/>
          </div>
        </main>

        <!-- Footer -->
        <!-- <footer-layout></footer-layout> -->
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoPage {

}
