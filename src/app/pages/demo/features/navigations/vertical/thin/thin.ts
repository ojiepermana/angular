import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { VerticalNavigation } from '../../../../../../../../projects/kit/src/lib/components/navigation/vertical/vertical-navigation';
import { demoNavigationData } from './navigations';

@Component({
  selector: 'navigation-vertical-thin',
  imports: [VerticalNavigation],
  template: `
    <div class="p-8 space-y-8">
      <div class="space-y-4">
        <h1 class="text-3xl font-bold">Vertical Navigation - Thin Appearance</h1>
        <p class="text-muted-foreground text-lg">
          Minimal ultra-narrow navigation designed for maximum space efficiency with essential navigation only.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Left Column - Demo Navigation -->
        <div class="space-y-6">
          <div class="space-y-4">
            <h2 class="text-xl font-semibold">Interactive Demo</h2>
            <p class="text-sm text-muted-foreground">
              Ultra-minimal navigation showing only essential icons. Perfect for maximizing content space.
            </p>
          </div>

          <!-- Default Thin Navigation -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium">Default Thin (80px width)</h3>
            <div class="border border-color rounded-lg p-6 bg-card">
              <div class="w-full max-w-[100px] h-96 overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 rounded-lg">
                <op-vertical-navigation
                  name="demo-vertical-thin-default"
                  [navigation]="navigationData()"
                  variant="default"
                  appearance="thin">
                </op-vertical-navigation>
              </div>
            </div>
          </div>

          <!-- Glass Thin Navigation -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium">Glass Thin (Translucent Effect)</h3>
            <div class="border border-color rounded-lg p-6 bg-card">
              <div class="w-full max-w-[100px] h-96 overflow-y-auto bg-gradient-to-br from-purple-100 via-pink-50 to-orange-100 dark:from-purple-900 dark:via-pink-950 dark:to-orange-950 rounded-lg">
                <op-vertical-navigation
                  name="demo-vertical-thin-glass"
                  [navigation]="navigationData()"
                  variant="glass"
                  appearance="thin">
                </op-vertical-navigation>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Information -->
        <div class="space-y-6">
          <!-- Thin Appearance Features -->
          <div class="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 class="font-medium mb-2 text-blue-900 dark:text-blue-100">🎯 Thin Appearance Features</h3>
            <ul class="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• <strong>Ultra-minimal</strong> 80px width for maximum space efficiency</li>
              <li>• <strong>Icon-only display</strong> without text labels</li>
              <li>• <strong>No hover expansion</strong> unlike dense mode</li>
              <li>• <strong>Glass variant support</strong> for modern translucent effects</li>
              <li>• <strong>Tooltip-ready</strong> for accessibility and usability</li>
            </ul>
          </div>

          <!-- Thin vs Dense Comparison -->
          <div class="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <h3 class="font-medium mb-2 text-amber-900 dark:text-amber-100">📊 Thin vs Dense</h3>
            <div class="text-sm text-amber-800 dark:text-amber-200 space-y-2">
              <div class="grid grid-cols-3 gap-2 font-medium border-b border-amber-200 dark:border-amber-800 pb-2">
                <span>Feature</span>
                <span>Thin</span>
                <span>Dense</span>
              </div>
              <div class="grid grid-cols-3 gap-2">
                <span>Width</span>
                <span>80px fixed</span>
                <span>80px → 280px</span>
              </div>
              <div class="grid grid-cols-3 gap-2">
                <span>Hover</span>
                <span>No expansion</span>
                <span>Expands on hover</span>
              </div>
              <div class="grid grid-cols-3 gap-2">
                <span>Use Case</span>
                <span>Permanent minimal</span>
                <span>Expandable mini</span>
              </div>
            </div>
          </div>

          <!-- Features Information -->
          <div class="space-y-4">
            <h2 class="text-xl font-semibold">Technical Features</h2>
            <div class="space-y-3">
              <div class="p-3 border border-color rounded-lg">
                <h3 class="font-medium mb-1 flex items-center gap-2">
                  📐 <span>Space Optimization</span>
                </h3>
                <p class="text-sm text-muted-foreground">
                  Maximum content area with minimal navigation footprint - ideal for dashboards and tools.
                </p>
              </div>
              <div class="p-3 border border-color rounded-lg">
                <h3 class="font-medium mb-1 flex items-center gap-2">
                  🎨 <span>Glass Effects</span>
                </h3>
                <p class="text-sm text-muted-foreground">
                  Subtle glassmorphism with backdrop blur for modern, translucent design aesthetics.
                </p>
              </div>
              <div class="p-3 border border-color rounded-lg">
                <h3 class="font-medium mb-1 flex items-center gap-2">
                  🔍 <span>Icon Clarity</span>
                </h3>
                <p class="text-sm text-muted-foreground">
                  Optimized icon sizing and spacing for clear recognition at minimal width.
                </p>
              </div>
              <div class="p-3 border border-color rounded-lg">
                <h3 class="font-medium mb-1 flex items-center gap-2">
                  ♿ <span>Accessibility Ready</span>
                </h3>
                <p class="text-sm text-muted-foreground">
                  Designed for tooltip integration and keyboard navigation support.
                </p>
              </div>
            </div>
          </div>

          <!-- Configuration Options -->
          <div class="space-y-4">
            <h2 class="text-xl font-semibold">Configuration</h2>
            <div class="bg-muted rounded-lg p-4">
              <h3 class="font-medium mb-3">Thin Appearance Properties</h3>
              <div class="space-y-2 text-sm">
                <div class="grid grid-cols-3 gap-2">
                  <span class="font-mono text-xs bg-background px-2 py-1 rounded">appearance</span>
                  <span class="text-muted-foreground">"thin"</span>
                  <span class="text-xs">Fixed 80px width</span>
                </div>
                <div class="grid grid-cols-3 gap-2">
                  <span class="font-mono text-xs bg-background px-2 py-1 rounded">variant</span>
                  <span class="text-muted-foreground">"default" | "glass"</span>
                  <span class="text-xs">Visual style</span>
                </div>
                <div class="grid grid-cols-3 gap-2">
                  <span class="font-mono text-xs bg-background px-2 py-1 rounded">position</span>
                  <span class="text-muted-foreground">"left" | "right"</span>
                  <span class="text-xs">Sidebar position</span>
                </div>
                <div class="grid grid-cols-3 gap-2">
                  <span class="font-mono text-xs bg-background px-2 py-1 rounded">mode</span>
                  <span class="text-muted-foreground">"side" | "over"</span>
                  <span class="text-xs">Display mode</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Usage Example -->
          <div class="space-y-4">
            <h2 class="text-xl font-semibold">Usage Examples</h2>
            <div class="space-y-4">
              <!-- Default Thin -->
              <div class="bg-muted rounded-lg p-4 overflow-x-auto">
                <h4 class="font-medium mb-2 text-sm">Default Thin</h4>
                <pre class="text-xs"><code>&lt;op-vertical-navigation
  [navigation]="items"
  appearance="thin"
  variant="default"&gt;
&lt;/op-vertical-navigation&gt;</code></pre>
              </div>

              <!-- Glass Thin -->
              <div class="bg-muted rounded-lg p-4 overflow-x-auto">
                <h4 class="font-medium mb-2 text-sm">Glass Thin</h4>
                <pre class="text-xs"><code>&lt;op-vertical-navigation
  [navigation]="items"
  appearance="thin"
  variant="glass"
  position="left"&gt;
&lt;/op-vertical-navigation&gt;</code></pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationVerticalThin {
  // Use local navigation data specific to thin appearance
  navigationData = signal(demoNavigationData);
}
