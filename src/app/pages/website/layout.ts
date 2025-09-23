import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navigation } from './navigation';

/**
 * Website Layout Component
 *
 * This component provides the main structural layout for the website.
 * It includes header, main content area, and footer sections.
 * The main content area uses router-outlet for dynamic page rendering.
 */
@Component({
  selector: 'website-layout',
  imports: [RouterOutlet, Navigation],
  template: `
    <div class="min-h-screen bg-background text-foreground">
      <!-- Navigation Header -->
      <website-navigation></website-navigation>

      <!-- Main Content -->
      <main>
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <router-outlet></router-outlet>
        </div>
      </main>

      <!-- Footer -->
      <footer class="border-t border-color mt-auto">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p class="text-center text-sm text-muted-foreground">
            &copy; 2025 @ojiepermana/angular. Angular UI Library with op- prefix components.
          </p>
        </div>
      </footer>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WebsiteLayout {}
