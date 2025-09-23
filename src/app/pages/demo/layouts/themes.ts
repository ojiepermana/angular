import { Component, inject } from '@angular/core';
import { ThemeService, ThemeVariant, ThemeMode } from '@ojiepermana/angular';
import { LayoutService, LayoutType } from '../../../services/layout.service';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'layout-themes',
  imports: [TitleCasePipe],
  template: `
    <div class="bg-background text-foreground transition-theme">
      <main class="space-y-8">
        <!-- Layout Controls -->
        <section class="bg-card text-card-foreground  transition-theme">
          <h2 class="text-primary text-2xl font-semibold mb-6">Layout Configuration</h2>
          <div class="space-y-4">
            <!-- Current Layout Display -->
            <div class="bg-muted text-muted-foreground p-4 rounded transition-theme">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-accent-foreground font-medium">Current Layout</h3>
                  <p class="text-sm mt-1">{{ layoutService.currentLayout() | titlecase }}</p>
                </div>
                <div class="text-sm">
                  <span class="text-accent-foreground font-medium">Theme:</span>
                  <span class="text-primary ml-2">{{ themeService.variant() | titlecase }} - {{ themeService.mode() | titlecase }}</span>
                </div>
              </div>
            </div>

            <!-- Layout Type Selection -->
            <div>
              <label class="text-foreground text-sm font-medium block mb-3">Choose Layout Type</label>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                @for (layout of availableLayouts; track layout) {
                  <button
                    (click)="setLayout(layout)"
                    [class]="getLayoutButtonClass(layout)"
                    class="p-4 rounded border transition-theme text-left"
                  >
                    <div class="font-medium text-sm">{{ layout | titlecase }}</div>
                    <div class="text-xs mt-1 opacity-75">{{ getLayoutDescription(layout) }}</div>
                  </button>
                }
              </div>
            </div>

            <!-- Layout Features -->
            <div class="bg-accent text-accent-foreground p-3 rounded text-sm transition-theme">
              <div class="font-medium mb-1">Current Layout Features:</div>
              <div class="text-xs opacity-90">{{ getCurrentLayoutFeatures() }}</div>
            </div>
          </div>
        </section>

        <!-- Quick Theme Controls -->
        <section class="bg-card text-card-foreground border border-color rounded-lg p-6 transition-theme">
          <h2 class="text-primary text-2xl font-semibold mb-6">Theme Configuration</h2>
          <div class="flex flex-wrap gap-4">
            <!-- Mode Toggle -->
            <div>
              <label class="text-foreground text-sm font-medium block mb-2">Mode</label>
              <div class="flex gap-2">
                @for (mode of availableModes; track mode) {
                  <button
                    (click)="setMode(mode)"
                    [class]="getModeButtonClass(mode)"
                    class="px-3 py-1 rounded text-sm transition-theme"
                  >
                    {{ mode | titlecase }}
                  </button>
                }
              </div>
            </div>

            <!-- Variant Selection -->
            <div>
              <label class="text-foreground text-sm font-medium block mb-2">Variants</label>
              <div class="flex flex-wrap gap-2">
                @for (variant of allVariants; track variant) {
                  <button
                    (click)="setVariant(variant)"
                    [class]="getVariantButtonClass(variant)"
                    class="px-3 py-1 rounded text-sm transition-theme"
                  >
                    {{ variant | titlecase }}
                  </button>
                }
              </div>
            </div>
          </div>
        </section>

        <!-- Color Palette Display -->
        <section class="bg-card text-card-foreground border border-color rounded-lg p-6 transition-theme">
          <h2 class="text-primary text-2xl font-semibold mb-6">Active Theme Colors</h2>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <!-- Background Colors -->
            <div class="space-y-2">
              <h3 class="text-accent-foreground font-medium">Backgrounds</h3>
              <div class="bg-background border border-color p-3 rounded text-center transition-theme">
                <div class="text-foreground text-sm">background</div>
              </div>
              <div class="bg-card border border-color p-3 rounded text-center transition-theme">
                <div class="text-card-foreground text-sm">card</div>
              </div>
              <div class="bg-muted border border-color p-3 rounded text-center transition-theme">
                <div class="text-muted-foreground text-sm">muted</div>
              </div>
            </div>

            <!-- Primary Colors -->
            <div class="space-y-2">
              <h3 class="text-accent-foreground font-medium">Primary</h3>
              <div class="bg-primary p-3 rounded text-center transition-theme">
                <div class="text-primary-foreground text-sm">primary</div>
              </div>
              <div class="bg-secondary p-3 rounded text-center transition-theme">
                <div class="text-secondary-foreground text-sm">secondary</div>
              </div>
              <div class="bg-accent p-3 rounded text-center transition-theme">
                <div class="text-accent-foreground text-sm">accent</div>
              </div>
            </div>

            <!-- Sidebar Colors -->
            <div class="space-y-2">
              <h3 class="text-accent-foreground font-medium">Sidebar</h3>
              <div class="bg-sidebar border border-sidebar-border p-3 rounded text-center transition-theme">
                <div class="text-sidebar-foreground text-sm">sidebar</div>
              </div>
              <div class="bg-sidebar-primary p-3 rounded text-center transition-theme">
                <div class="text-sidebar-primary-foreground text-sm">sidebar-primary</div>
              </div>
              <div class="bg-sidebar-accent p-3 rounded text-center transition-theme">
                <div class="text-sidebar-accent-foreground text-sm">sidebar-accent</div>
              </div>
            </div>

            <!-- Chart Colors -->
            <div class="space-y-2">
              <h3 class="text-accent-foreground font-medium">Charts</h3>
              <div class="bg-chart-1 p-3 rounded text-center transition-theme">
                <div class="text-white text-sm">chart-1</div>
              </div>
              <div class="bg-chart-2 p-3 rounded text-center transition-theme">
                <div class="text-white text-sm">chart-2</div>
              </div>
              <div class="bg-chart-3 p-3 rounded text-center transition-theme">
                <div class="text-white text-sm">chart-3</div>
              </div>
            </div>
          </div>
        </section>

        <!-- UI Components Demo -->
        <section class="bg-card text-card-foreground border border-color rounded-lg p-6 transition-theme">
          <h2 class="text-primary text-2xl font-semibold mb-6">UI Components with Variables</h2>

          <div class="grid md:grid-cols-2 gap-6">

            <!-- Card Example -->
            <div class="bg-muted border border-color rounded-lg p-4 transition-theme">
              <h3 class="text-primary text-lg font-semibold mb-3">Product Card</h3>
              <div class="bg-card text-card-foreground border border-color rounded p-4 transition-theme">
                <h4 class="text-accent-foreground font-medium">Premium Widget</h4>
                <p class="text-muted-foreground text-sm mt-1">High-quality component for your app</p>
                <div class="flex gap-2 mt-4">
                  <button class="bg-primary text-primary-foreground px-3 py-1 rounded text-sm transition-theme hover:opacity-90">
                    Buy Now
                  </button>
                  <button class="bg-secondary text-secondary-foreground px-3 py-1 rounded text-sm transition-theme hover:bg-accent">
                    Learn More
                  </button>
                </div>
                <div class="bg-accent text-accent-foreground p-2 rounded mt-3 text-sm transition-theme">
                  <span class="font-medium">Status:</span> In Stock
                </div>
              </div>
            </div>

            <!-- Form Example -->
            <div class="bg-muted border border-color rounded-lg p-4 transition-theme">
              <h3 class="text-primary text-lg font-semibold mb-3">Form Elements</h3>
              <div class="space-y-3">
                <div>
                  <label class="text-foreground text-sm font-medium block mb-1">Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    class="w-full bg-background text-foreground border border-input rounded px-3 py-2 text-sm transition-theme focus:ring-2 focus:ring-color focus:outline-none"
                  >
                </div>
                <div>
                  <label class="text-foreground text-sm font-medium block mb-1">Message</label>
                  <textarea
                    placeholder="Your message..."
                    rows="3"
                    class="w-full bg-background text-foreground border border-input rounded px-3 py-2 text-sm transition-theme focus:ring-2 focus:ring-color focus:outline-none"
                  ></textarea>
                </div>
                <button class="bg-primary text-primary-foreground px-4 py-2 rounded text-sm w-full transition-theme hover:opacity-90">
                  Submit
                </button>
              </div>
            </div>

          </div>
        </section>

        <!-- Interactive Elements -->
        <section class="bg-card text-card-foreground border border-color rounded-lg p-6 transition-theme">
          <h2 class="text-primary text-2xl font-semibold mb-6">Interactive Elements</h2>

          <div class="grid md:grid-cols-3 gap-4">

            <!-- Buttons -->
            <div class="space-y-3">
              <h3 class="text-accent-foreground font-medium">Buttons</h3>
              <div class="space-y-2">
                <button class="w-full bg-primary text-primary-foreground px-4 py-2 rounded transition-theme hover:opacity-90">
                  Primary Button
                </button>
                <button class="w-full bg-secondary text-secondary-foreground px-4 py-2 rounded transition-theme hover:bg-accent">
                  Secondary Button
                </button>
                <button class="w-full bg-destructive text-white px-4 py-2 rounded transition-theme hover:opacity-90">
                  Destructive Button
                </button>
              </div>
            </div>

            <!-- Alerts -->
            <div class="space-y-3">
              <h3 class="text-accent-foreground font-medium">Alerts</h3>
              <div class="space-y-2">
                <div class="bg-primary text-primary-foreground p-3 rounded text-sm transition-theme">
                  <strong>Info:</strong> This is an info message
                </div>
                <div class="bg-accent text-accent-foreground p-3 rounded text-sm transition-theme">
                  <strong>Note:</strong> This is a note
                </div>
                <div class="bg-destructive text-white p-3 rounded text-sm transition-theme">
                  <strong>Error:</strong> Something went wrong
                </div>
              </div>
            </div>

            <!-- Chart Preview -->
            <div class="space-y-3">
              <h3 class="text-accent-foreground font-medium">Chart Colors</h3>
              <div class="space-y-2">
                <div class="flex gap-1 h-6">
                  <div class="bg-chart-1 flex-1 rounded-l transition-theme"></div>
                  <div class="bg-chart-2 flex-1 transition-theme"></div>
                  <div class="bg-chart-3 flex-1 transition-theme"></div>
                  <div class="bg-chart-4 flex-1 transition-theme"></div>
                  <div class="bg-chart-5 flex-1 rounded-r transition-theme"></div>
                </div>
                <p class="text-muted-foreground text-xs">
                  Chart colors automatically adapt to themes
                </p>
              </div>
            </div>

          </div>
        </section>

        <!-- Code Example -->
        <section class="bg-card text-card-foreground border border-color rounded-lg p-6 transition-theme">
          <h2 class="text-primary text-2xl font-semibold mb-6">Example Usage</h2>

          <div class="bg-muted text-muted-foreground p-4 rounded text-sm font-mono transition-theme">
            <div class="text-accent-foreground mb-2">HTML Template:</div>
            <pre class="text-foreground whitespace-pre-wrap">{{exampleCode}}</pre>

            <div class="text-accent-foreground mt-4 mb-2">Key Benefits:</div>
            <ul class="text-foreground space-y-1">
              <li>• No dark: classes needed</li>
              <li>• Automatic theme switching</li>
              <li>• 11 color variants support</li>
              <li>• Consistent design system</li>
              <li>• Smooth transitions</li>
            </ul>
          </div>
        </section>

      </main>
    </div>
  `
})
export class LayoutThemes {
  protected readonly themeService = inject(ThemeService);
  protected readonly layoutService = inject(LayoutService);

  protected readonly availableModes: ThemeMode[] = ['light', 'dark'];
  protected readonly allVariants: ThemeVariant[] = ['default', 'red', 'rose', 'orange', 'green', 'blue', 'yellow', 'violet', 'zinc', 'slate', 'stone'];
  protected readonly availableLayouts: LayoutType[] = ['empty', 'default', 'modern'];

  protected readonly exampleCode = `<!-- All elements automatically respond to theme changes -->
<div class="bg-card text-card-foreground border border-color p-6">
  <h2 class="text-primary">Title</h2>
  <p class="text-muted-foreground">Description</p>
  <button class="bg-primary text-primary-foreground">Action</button>
</div>`;

  setVariant(variant: ThemeVariant): void {
    this.themeService.setVariant(variant);
  }

  setMode(mode: ThemeMode): void {
    this.themeService.setMode(mode);
  }

  setLayout(layout: LayoutType): void {
    this.layoutService.setLayout(layout);
  }

  getVariantButtonClass(variant: ThemeVariant): string {
    const isActive = this.themeService.variant() === variant;
    return isActive
      ? 'bg-primary text-primary-foreground'
      : 'bg-secondary text-secondary-foreground hover:bg-accent';
  }

  getModeButtonClass(mode: ThemeMode): string {
    const isActive = this.themeService.mode() === mode;
    return isActive
      ? 'bg-primary text-primary-foreground'
      : 'bg-secondary text-secondary-foreground hover:bg-accent';
  }

  getLayoutButtonClass(layout: LayoutType): string {
    const isActive = this.layoutService.currentLayout() === layout;
    return isActive
      ? 'bg-primary text-primary-foreground border-primary'
      : 'bg-secondary text-secondary-foreground border-color hover:bg-accent';
  }

  getLayoutDescription(layout: LayoutType): string {
    const descriptions = {
      empty: 'Minimal layout with no navigation or header',
      default: 'Standard layout with sidebar and header navigation',
      modern: 'Contemporary layout with mini dock and clean design'
    };
    return descriptions[layout];
  }

  getCurrentLayoutFeatures(): string {
    const currentLayout = this.layoutService.currentLayout();
    const features: Record<LayoutType, string> = {
      empty: 'Clean, distraction-free interface for focused content',
      default: 'Full navigation sidebar, header with breadcrumbs, responsive design',
      modern: 'Mini dock navigation, floating panels, optimized for productivity'
    };
    return features[currentLayout];
  }
}
