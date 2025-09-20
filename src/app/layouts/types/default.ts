import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VerticalMiniDockLayout } from '../components/shared/vertical-mini-dock';

@Component({
  selector: 'layout-default',
  imports: [RouterOutlet, VerticalMiniDockLayout],
  template: `
    <div class="flex h-screen">
      <vertical-mini-dock-layout></vertical-mini-dock-layout>
      <!-- Main Content Area -->
      <div id="content" class="flex flex-1 flex-col overflow-hidden">
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
          <aside class="w-64 border-rp-4">
          </aside>

          <!-- Page Content -->
          <div class="flex-1 overflow-auto p-6">
            <router-outlet/>
          </div>
        </main>

        <!-- Footer -->
        <!-- <footer-layout></footer-layout> -->
      </div>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Layout {}
