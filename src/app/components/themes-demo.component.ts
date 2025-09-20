import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { JsonPipe, TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ThemeService, ThemeVariant, ThemeMode } from '@ojiepermana/angular';
import { LayoutService, LayoutType } from '../services/layout.service';
import { DarkModeToggle } from '../layouts/components/shared/dark-mode-toggle.component';

@Component({
  selector: 'themes-demo',
  imports: [JsonPipe, TitleCasePipe, RouterLink, DarkModeToggle],
  template: `
    <div class="p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold">Themes Demo</h2>
        <nav class="flex gap-2">
          <a routerLink="/demo" class="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded hover:bg-secondary/80">
            Demo Home
          </a>
          <a routerLink="/demo/layout" class="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded hover:bg-secondary/80">
            Layout Demo
          </a>
          <a routerLink="/demo/variables" class="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded hover:bg-secondary/80">
            Variables Demo
          </a>
        </nav>
      </div>

      <div class="space-y-6">
        <!-- Current Theme Status -->
        <div class="p-4 border rounded-lg bg-card">
          <h3 class="text-lg font-semibold mb-3">Current Theme</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-muted-foreground mb-1">Variant</p>
              <p class="font-medium">{{ themeService.variant() | titlecase }}</p>
            </div>
            <div>
              <p class="text-sm text-muted-foreground mb-1">Mode</p>
              <p class="font-medium">{{ themeService.mode() | titlecase }}</p>
            </div>
          </div>
          <div class="mt-3">
            <p class="text-sm text-muted-foreground">Full Theme Config:</p>
            <pre class="text-xs mt-1 p-2 bg-muted rounded">{{ themeService.theme() | json }}</pre>
          </div>
        </div>

        <!-- Theme Variants -->
        <div>
          <h3 class="text-lg font-semibold mb-3">Theme Variants</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            @for (variant of availableVariants; track variant) {
              <button
                (click)="setVariant(variant)"
                [class]="getVariantButtonClass(variant)"
                class="px-3 py-2 rounded-md text-sm font-medium transition-colors text-center">
                {{ variant | titlecase }}
              </button>
            }
          </div>
        </div>

        <!-- Theme Modes -->
        <div>
          <h3 class="text-lg font-semibold mb-3">Theme Modes</h3>
          <div class="flex gap-2">
            @for (mode of availableModes; track mode) {
              <button
                (click)="setMode(mode)"
                [class]="getModeButtonClass(mode)"
                class="px-4 py-2 rounded-md font-medium transition-colors">
                {{ mode | titlecase }}
              </button>
            }
          </div>
          <button
            (click)="toggleMode()"
            class="mt-2 px-4 py-2 rounded-md font-medium bg-accent text-accent-foreground hover:bg-accent/80 transition-colors">
            Toggle Mode
          </button>
        </div>

        <!-- Layout Selection -->
        <div>
          <h3 class="text-lg font-semibold mb-3">Layout Selection</h3>
          <div class="flex gap-2">
            @for (layout of availableLayouts; track layout) {
              <button
                (click)="setLayout(layout)"
                [class]="getLayoutButtonClass(layout)"
                class="px-4 py-2 rounded-md font-medium transition-colors">
                {{ layout | titlecase }}
              </button>
            }
          </div>
          <div class="mt-3">
            <p class="text-sm text-muted-foreground mb-1">Current Layout</p>
            <p class="font-medium">{{ layoutService.currentLayout() | titlecase }}</p>
          </div>
        </div>

        <!-- Dark Mode Toggle Demos -->
        <div>
          <h3 class="text-lg font-semibold mb-3">Dark Mode Toggle Configurations</h3>

          <div class="space-y-4">
            <!-- Icon Styles -->
            <div>
              <h4 class="font-medium mb-2">Icon Styles</h4>
              <div class="flex gap-3 items-center">
                <div class="text-center">
                  <dark-mode-toggle iconStyle="default" borderStyle="rounded"></dark-mode-toggle>
                  <p class="text-xs mt-1">Default</p>
                </div>
                <div class="text-center">
                  <dark-mode-toggle iconStyle="filled" borderStyle="rounded"></dark-mode-toggle>
                  <p class="text-xs mt-1">Filled</p>
                </div>
                <div class="text-center">
                  <dark-mode-toggle iconStyle="outline" borderStyle="rounded"></dark-mode-toggle>
                  <p class="text-xs mt-1">Outline</p>
                </div>
                <div class="text-center">
                  <dark-mode-toggle iconStyle="minimal" borderStyle="rounded"></dark-mode-toggle>
                  <p class="text-xs mt-1">Minimal</p>
                </div>
              </div>
            </div>

            <!-- Border Styles -->
            <div>
              <h4 class="font-medium mb-2">Border Styles</h4>
              <div class="flex gap-3 items-center">
                <div class="text-center">
                  <dark-mode-toggle iconStyle="default" borderStyle="rounded"></dark-mode-toggle>
                  <p class="text-xs mt-1">Rounded</p>
                </div>
                <div class="text-center">
                  <dark-mode-toggle iconStyle="default" borderStyle="square"></dark-mode-toggle>
                  <p class="text-xs mt-1">Square</p>
                </div>
                <div class="text-center">
                  <dark-mode-toggle iconStyle="default" borderStyle="circle"></dark-mode-toggle>
                  <p class="text-xs mt-1">Circle</p>
                </div>
                <div class="text-center">
                  <dark-mode-toggle iconStyle="default" borderStyle="pill"></dark-mode-toggle>
                  <p class="text-xs mt-1">Pill</p>
                </div>
              </div>
            </div>

            <!-- Combined Styles -->
            <div>
              <h4 class="font-medium mb-2">Combined Examples</h4>
              <div class="flex gap-3 items-center">
                <div class="text-center">
                  <dark-mode-toggle iconStyle="filled" borderStyle="circle"></dark-mode-toggle>
                  <p class="text-xs mt-1">Filled + Circle</p>
                </div>
                <div class="text-center">
                  <dark-mode-toggle iconStyle="minimal" borderStyle="pill"></dark-mode-toggle>
                  <p class="text-xs mt-1">Minimal + Pill</p>
                </div>
                <div class="text-center">
                  <dark-mode-toggle iconStyle="outline" borderStyle="square"></dark-mode-toggle>
                  <p class="text-xs mt-1">Outline + Square</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Theme Preview -->
        <div>
          <h3 class="text-lg font-semibold mb-3">Theme Preview</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Colors Preview -->
            <div class="p-4 border rounded-lg">
              <h4 class="font-medium mb-3">Colors</h4>
              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <div class="w-4 h-4 rounded-full bg-primary"></div>
                  <span class="text-sm">Primary</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-4 h-4 rounded-full bg-secondary"></div>
                  <span class="text-sm">Secondary</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-4 h-4 rounded-full bg-accent"></div>
                  <span class="text-sm">Accent</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-4 h-4 rounded-full bg-muted"></div>
                  <span class="text-sm">Muted</span>
                </div>
              </div>
            </div>

            <!-- Components Preview -->
            <div class="p-4 border rounded-lg">
              <h4 class="font-medium mb-3">Components</h4>
              <div class="space-y-2">
                <button class="w-full px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                  Primary Button
                </button>
                <button class="w-full px-3 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80">
                  Secondary Button
                </button>
                <div class="p-3 bg-card border rounded-md">
                  <p class="text-card-foreground">Card Content</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div>
          <h3 class="text-lg font-semibold mb-3">Actions</h3>
          <div class="flex gap-2">
            <button
              (click)="resetTheme()"
              class="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors">
              Reset Theme
            </button>
            <button
              (click)="resetLayout()"
              class="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors">
              Reset Layout
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemesDemoComponent {
  readonly themeService = inject(ThemeService);
  readonly layoutService = inject(LayoutService);

  readonly availableVariants = this.themeService.getAvailableVariants();
  readonly availableModes = this.themeService.getAvailableModes();
  readonly availableLayouts = this.layoutService.getAvailableLayouts();

  setVariant(variant: ThemeVariant): void {
    this.themeService.setVariant(variant);
  }

  setMode(mode: ThemeMode): void {
    this.themeService.setMode(mode);
  }

  toggleMode(): void {
    this.themeService.toggleMode();
  }

  setLayout(layout: LayoutType): void {
    this.layoutService.setLayout(layout);
  }

  resetTheme(): void {
    this.themeService.resetToSystem();
  }

  resetLayout(): void {
    this.layoutService.resetToDefault();
  }

  getVariantButtonClass(variant: ThemeVariant): string {
    const isActive = this.themeService.variant() === variant;
    const baseClass = 'px-3 py-2 rounded-md text-sm font-medium transition-colors';

    if (isActive) {
      return `${baseClass} bg-primary text-primary-foreground`;
    }

    return `${baseClass} bg-secondary text-secondary-foreground hover:bg-secondary/80`;
  }

  getModeButtonClass(mode: ThemeMode): string {
    const isActive = this.themeService.mode() === mode;
    const baseClass = 'px-4 py-2 rounded-md font-medium transition-colors';

    if (isActive) {
      return `${baseClass} bg-primary text-primary-foreground`;
    }

    return `${baseClass} bg-secondary text-secondary-foreground hover:bg-secondary/80`;
  }

  getLayoutButtonClass(layout: LayoutType): string {
    const isActive = this.layoutService.currentLayout() === layout;
    const baseClass = 'px-4 py-2 rounded-md font-medium transition-colors';

    if (isActive) {
      return `${baseClass} bg-primary text-primary-foreground`;
    }

    return `${baseClass} bg-secondary text-secondary-foreground hover:bg-secondary/80`;
  }
}
