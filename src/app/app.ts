import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { OpThemeSelector, OpButton } from '@ojiepermana/angular';
import { ThemeDebugComponent } from './components/theme-debug';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, OpThemeSelector, OpButton, ThemeDebugComponent],
  template: `
    <div class="min-h-screen bg-background text-foreground transition-colors duration-200">
      <div class="container mx-auto px-4 py-8 max-w-4xl">
        <!-- Header -->
        <header class="text-center mb-8">
          <h1 class="text-3xl font-bold mb-2">
            {{ title() }}
          </h1>
          <p class="text-muted-foreground">
            shadcn/ui Theme System with Multiple Color Variants & Material Icons
          </p>
        </header>

        <!-- Navigation -->
        <nav class="mb-8">
          <div class="flex gap-4 justify-center">
            <op-button variant="outline" size="sm">
              <a routerLink="/" class="no-underline">Theme Demo</a>
            </op-button>
            <op-button variant="outline" size="sm">
              <a routerLink="/material-icons" class="no-underline">Material Icons</a>
            </op-button>
          </div>
        </nav>

        <!-- Theme Controls -->
        <section class="mb-8">
          <op-theme-selector></op-theme-selector>
          <app-theme-debug></app-theme-debug>
        </section>

        <!-- Router Content -->
        <router-outlet></router-outlet>

        <!-- Footer -->
        <footer class="text-center mt-12 text-muted-foreground">
          <p>Test all theme combinations: light/dark mode with 7 color variants + Material Icons</p>
        </footer>
      </div>
    </div>
  `,
  styles: []
})
export class AppComponent {
  protected readonly title = signal('Ala Design System - Angular Kit');
}
