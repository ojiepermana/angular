import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Website Layout Component
 *
 * This component provides the main structural layout for the website.
 * It includes header, main content area, and footer sections.
 * The main content area uses router-outlet for dynamic page rendering.
 */
@Component({
  selector: 'website-layout',
  imports: [RouterOutlet],
  template: `
    <div class="min-h-screen flex flex-col bg-[rgb(var(--background))] text-[rgb(var(--foreground))]">
      <!-- Header Section -->
      <header class="bg-gradient-to-br from-indigo-500 to-purple-600 text-white py-4 shadow-lg">
        <div class="max-w-5xl mx-auto px-6 flex justify-between items-center">
          <h1 class="text-2xl font-semibold m-0">@ojiepermana/angular</h1>
          <nav class="flex gap-6">
            <a href="/" class="text-white no-underline font-medium hover:opacity-80 transition-opacity duration-200">Home</a>
            <a href="/demo" class="text-white no-underline font-medium hover:opacity-80 transition-opacity duration-200">Demo</a>
          </nav>
        </div>
      </header>

      <!-- Main Content Area -->
      <main class="flex-1 py-8">
        <div class="max-w-5xl mx-auto px-6">
          <router-outlet />
        </div>
      </main>

      <!-- Footer Section -->
      <footer class="border-t border-[rgb(var(--border))] py-6 mt-auto">
        <div class="max-w-5xl mx-auto px-6">
          <p class="m-0 text-center text-[rgb(var(--muted-foreground))] text-sm">&copy; 2025 @ojiepermana/angular. Angular UI Library with op- prefix components.</p>
        </div>
      </footer>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WebsiteLayout {}
