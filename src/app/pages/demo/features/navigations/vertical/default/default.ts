import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { VerticalNavigation } from '../../../../../../../../projects/kit/src/lib/components/navigation/vertical/vertical-navigation';
import { demoNavigationData } from './navigations';

@Component({
  selector: 'navigation-vertical-default',
  imports: [VerticalNavigation],
  template: `
    <div class="p-8 space-y-8">
      <div class="space-y-4">
        <h1 class="text-3xl font-bold">Vertical Navigation - Default Appearance</h1>
        <p class="text-muted-foreground text-lg">
          Showcase of the default vertical navigation component with full navigation data.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Left Column - Demo Navigation -->
        <div class="space-y-6">
          <div class="space-y-4">
            <h2 class="text-xl font-semibold">Demo Navigation</h2>
            <p class="text-sm text-muted-foreground">
              Interactive vertical navigation with default appearance. Try expanding groups and clicking items.
            </p>
          </div>

          <!-- Navigation Demo Container -->
          <div class="border border-color rounded-lg p-6 bg-card">
            <div class="w-full max-w-sm h-196 overflow-y-auto">
              <op-vertical-navigation
                name="demo-vertical-default"
                [navigation]="navigationData()"
                variant="default"
                appearance="default">
              </op-vertical-navigation>
            </div>
          </div>


        </div>

        <!-- Right Column - Information -->
        <div class="space-y-6">
           <!-- Glass Variant Note -->
          <div class="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <h3 class="font-medium mb-2 text-amber-900 dark:text-amber-100">⚠️ Glass Variant Limitation</h3>
            <p class="text-sm text-amber-800 dark:text-amber-200">
              Glass variant is <strong>not available</strong> for default appearance.
              Use <code class="bg-amber-100 dark:bg-amber-900 px-1 rounded">compact</code>, <code class="bg-amber-100 dark:bg-amber-900 px-1 rounded">dense</code>,
              or <code class="bg-amber-100 dark:bg-amber-900 px-1 rounded">thin</code> appearance for glass effects.
            </p>
          </div>
          <!-- Features Information -->
          <div class="space-y-4">
            <h2 class="text-xl font-semibold">Features</h2>
            <div class="space-y-3">
              <div class="p-3 border border-color rounded-lg">
                <h3 class="font-medium mb-1 flex items-center gap-2">
                  📁 <span>Collapsible Groups</span>
                </h3>
                <p class="text-sm text-muted-foreground">
                  Expandable navigation sections with nested items support and state persistence.
                </p>
              </div>
              <div class="p-3 border border-color rounded-lg">
                <h3 class="font-medium mb-1 flex items-center gap-2">
                  🎯 <span>Active States</span>
                </h3>
                <p class="text-sm text-muted-foreground">
                  Automatic active state detection based on current route with visual feedback.
                </p>
              </div>
              <div class="p-3 border border-color rounded-lg">
                <h3 class="font-medium mb-1 flex items-center gap-2">
                  🏷️ <span>Badges & Icons</span>
                </h3>
                <p class="text-sm text-muted-foreground">
                  Support for Material icons and custom badge notifications with theming.
                </p>
              </div>
              <div class="p-3 border border-color rounded-lg">
                <h3 class="font-medium mb-1 flex items-center gap-2">
                  📱 <span>Responsive Design</span>
                </h3>
                <p class="text-sm text-muted-foreground">
                  Adapts to different screen sizes and container widths automatically.
                </p>
              </div>
              <div class="p-3 border border-color rounded-lg">
                <h3 class="font-medium mb-1 flex items-center gap-2">
                  ♿ <span>Accessibility</span>
                </h3>
                <p class="text-sm text-muted-foreground">
                  Built with ARIA support, keyboard navigation, and screen reader compatibility.
                </p>
              </div>
              <div class="p-3 border border-color rounded-lg">
                <h3 class="font-medium mb-1 flex items-center gap-2">
                  🎨 <span>Themeable</span>
                </h3>
                <p class="text-sm text-muted-foreground">
                  Works with light/dark modes and supports custom CSS variables.
                </p>
              </div>
            </div>
          </div>

          <!-- Configuration Options -->
          <div class="space-y-4">
            <h2 class="text-xl font-semibold">Configuration</h2>
            <div class="bg-muted rounded-lg p-4">
              <h3 class="font-medium mb-3">Available Properties</h3>
              <div class="space-y-2 text-sm">
                <div class="grid grid-cols-3 gap-2">
                  <span class="font-mono text-xs bg-background px-2 py-1 rounded">name</span>
                  <span class="text-muted-foreground">string</span>
                  <span class="text-xs">Navigation identifier</span>
                </div>
                <div class="grid grid-cols-3 gap-2">
                  <span class="font-mono text-xs bg-background px-2 py-1 rounded">navigation</span>
                  <span class="text-muted-foreground">NavigationItem[]</span>
                  <span class="text-xs">Navigation data</span>
                </div>
                <div class="grid grid-cols-3 gap-2">
                  <span class="font-mono text-xs bg-background px-2 py-1 rounded">variant</span>
                  <span class="text-muted-foreground">'default' | 'glass'</span>
                  <span class="text-xs">Visual variant</span>
                </div>
                <div class="grid grid-cols-3 gap-2">
                  <span class="font-mono text-xs bg-background px-2 py-1 rounded">appearance</span>
                  <span class="text-muted-foreground">'default' | 'compact' | 'dense' | 'thin'</span>
                  <span class="text-xs">Layout density</span>
                </div>
                <div class="grid grid-cols-3 gap-2">
                  <span class="font-mono text-xs bg-background px-2 py-1 rounded">mode</span>
                  <span class="text-muted-foreground">'over' | 'side'</span>
                  <span class="text-xs">Display mode</span>
                </div>
                <div class="grid grid-cols-3 gap-2">
                  <span class="font-mono text-xs bg-background px-2 py-1 rounded">position</span>
                  <span class="text-muted-foreground">'left' | 'right'</span>
                  <span class="text-xs">Sidebar position</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Usage Example -->
          <div class="space-y-4">
            <h2 class="text-xl font-semibold">Usage Example</h2>
            <div class="bg-muted rounded-lg p-4 overflow-x-auto">
              <pre class="text-sm"><code>&lt;op-vertical-navigation
  name="my-navigation"
  [navigation]="navigationData()"
  variant="default"
  appearance="default"
  mode="side"
  position="left"
  (itemClicked)="onItemClick($event)"&gt;
&lt;/op-vertical-navigation&gt;</code></pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationVerticalDefault {
  // Use local navigation data specific to default appearance
  navigationData = signal(demoNavigationData);
}
