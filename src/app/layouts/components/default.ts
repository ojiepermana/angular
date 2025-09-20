import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VerticalMiniDockLayout } from './shared/vertical-mini-dock';

@Component({
  selector: 'layout-default',
  imports: [RouterOutlet, VerticalMiniDockLayout],
  template: `
    <div class="flex h-screen">
      <vertical-mini-dock-layout></vertical-mini-dock-layout>

      <!-- Main Content Area -->
      <div id="content" class="flex flex-1 flex-col overflow-hidden">
        <!-- Header -->
        <header class="p-4 border-b border-slate-200 dark:border-slate-700 ">
          <div class="flex items-center justify-between">
            <h1 class="text-xl font-semibold">Dashboard</h1>
            <div class="text-sm text-slate-600 dark:text-slate-400">
              <!-- Theme info placeholder -->
            </div>
          </div>
        </header>

        <!-- Main Content -->
        <main class="flex flex-1 overflow-hidden">
          <!-- Sidebar Navigation -->
          <aside class="w-64 border-r border-slate-200 dark:border-slate-700 p-4">
            <nav class="space-y-2">
              <a href="/" class="block px-3 py-2 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                Home
              </a>
              <a href="/demo" class="block px-3 py-2 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                Demo
              </a>
              <a href="/website" class="block px-3 py-2 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                Website
              </a>
            </nav>
          </aside>

          <!-- Page Content -->
          <div class="flex-1 overflow-auto p-6">
            <router-outlet/>
          </div>
        </main>

        <!-- Footer -->
        <footer class="p-4 border-t border-slate-200 dark:border-slate-700 ">
          <div class="flex items-center justify-between text-sm">
            <span class="text-slate-600 dark:text-slate-400">@ojiepermana/angular © 2025</span>
            <span class="text-slate-500 dark:text-slate-500">
              Built with ❤️ by Ojie Permana
            </span>
          </div>
        </footer>
      </div>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Layout {}
