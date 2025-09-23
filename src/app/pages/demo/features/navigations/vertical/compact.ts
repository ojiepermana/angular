import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { VerticalNavigation } from '../../../../../../../projects/kit/src/lib/components/navigation/vertical/vertical-navigation';
import { NavigationDataService } from '../../../../../services/navigation-data.service';

@Component({
  selector: 'navigation-vertical-compact',
  imports: [VerticalNavigation],
  template: `
    <div class="p-8 space-y-8">
      <div class="space-y-4">
        <h1 class="text-3xl font-bold">Vertical Navigation - Compact Variant</h1>
        <p class="text-muted-foreground text-lg">
          Showcase of the compact vertical navigation with glass variant support.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Compact Default -->
        <div class="space-y-4">
          <h2 class="text-xl font-semibold">Compact - Default</h2>
          <p class="text-sm text-muted-foreground">
            Compact appearance with default styling.
          </p>
          <div class="border border-color rounded-lg p-4 bg-card">
            <div class="w-64 h-96 overflow-y-auto">
              <op-vertical-navigation
                name="demo-vertical-compact-default"
                [navigation]="navigationData()"
                variant="default"
                appearance="compact">
              </op-vertical-navigation>
            </div>
          </div>
        </div>

        <!-- Compact Glass -->
        <div class="space-y-4">
          <h2 class="text-xl font-semibold">Compact - Glass</h2>
          <p class="text-sm text-muted-foreground">
            Compact appearance with glass effects (glassmorphism).
          </p>
          <div class="border border-color rounded-lg p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
            <div class="w-64 h-96 overflow-y-auto">
              <op-vertical-navigation
                name="demo-vertical-compact-glass"
                [navigation]="navigationData()"
                variant="glass"
                appearance="compact">
              </op-vertical-navigation>
            </div>
          </div>
        </div>

        <!-- Dense Default -->
        <div class="space-y-4">
          <h2 class="text-xl font-semibold">Dense - Default</h2>
          <p class="text-sm text-muted-foreground">
            Dense appearance with default styling.
          </p>
          <div class="border border-color rounded-lg p-4 bg-card">
            <div class="w-64 h-96 overflow-y-auto">
              <op-vertical-navigation
                name="demo-vertical-dense-default"
                [navigation]="navigationData()"
                variant="default"
                appearance="dense">
              </op-vertical-navigation>
            </div>
          </div>
        </div>

        <!-- Dense Glass -->
        <div class="space-y-4">
          <h2 class="text-xl font-semibold">Dense - Glass</h2>
          <p class="text-sm text-muted-foreground">
            Dense appearance with glass effects.
          </p>
          <div class="border border-color rounded-lg p-4 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
            <div class="w-64 h-96 overflow-y-auto">
              <op-vertical-navigation
                name="demo-vertical-dense-glass"
                [navigation]="navigationData()"
                variant="glass"
                appearance="dense">
              </op-vertical-navigation>
            </div>
          </div>
        </div>

        <!-- Thin Default -->
        <div class="space-y-4">
          <h2 class="text-xl font-semibold">Thin - Default</h2>
          <p class="text-sm text-muted-foreground">
            Thin appearance with default styling.
          </p>
          <div class="border border-color rounded-lg p-4 bg-card">
            <div class="w-64 h-96 overflow-y-auto">
              <op-vertical-navigation
                name="demo-vertical-thin-default"
                [navigation]="navigationData()"
                variant="default"
                appearance="thin">
              </op-vertical-navigation>
            </div>
          </div>
        </div>

        <!-- Thin Glass -->
        <div class="space-y-4">
          <h2 class="text-xl font-semibold">Thin - Glass</h2>
          <p class="text-sm text-muted-foreground">
            Thin appearance with glass effects.
          </p>
          <div class="border border-color rounded-lg p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
            <div class="w-64 h-96 overflow-y-auto">
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

      <!-- Glass Variant Rules -->
      <div class="space-y-4">
        <h2 class="text-xl font-semibold">Glass Variant Rules</h2>
        <div class="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 class="font-medium mb-2 text-blue-900 dark:text-blue-100">🔍 Glass Variant Availability</h3>
          <ul class="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>✅ <strong>Compact</strong> - Glass variant available</li>
            <li>✅ <strong>Dense</strong> - Glass variant available</li>
            <li>✅ <strong>Thin</strong> - Glass variant available</li>
            <li>❌ <strong>Default</strong> - Glass variant NOT available (fallback to default)</li>
          </ul>
        </div>
      </div>

      <!-- Features Information -->
      <div class="space-y-4">
        <h2 class="text-xl font-semibold">Appearance Features</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="p-4 border border-color rounded-lg">
            <h3 class="font-medium mb-2">📦 Compact</h3>
            <p class="text-sm text-muted-foreground">
              Reduced spacing for better content density while maintaining readability.
            </p>
          </div>
          <div class="p-4 border border-color rounded-lg">
            <h3 class="font-medium mb-2">🔄 Dense</h3>
            <p class="text-sm text-muted-foreground">
              Minimal spacing for maximum information density in limited space.
            </p>
          </div>
          <div class="p-4 border border-color rounded-lg">
            <h3 class="font-medium mb-2">📏 Thin</h3>
            <p class="text-sm text-muted-foreground">
              Ultra-minimal spacing for sidebar navigation in tight layouts.
            </p>
          </div>
        </div>
      </div>

      <!-- Code Example -->
      <div class="space-y-4">
        <h2 class="text-xl font-semibold">Usage Examples</h2>
        <div class="space-y-4">
          <div>
            <h3 class="text-lg font-medium mb-2">Compact with Glass</h3>
            <div class="bg-muted rounded-lg p-4 overflow-x-auto">
              <pre class="text-sm"><code>&lt;op-vertical-navigation
  name="my-navigation"
  [navigation]="navigationData()"
  variant="glass"
  appearance="compact"&gt;
&lt;/op-vertical-navigation&gt;</code></pre>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-medium mb-2">Dense with Default</h3>
            <div class="bg-muted rounded-lg p-4 overflow-x-auto">
              <pre class="text-sm"><code>&lt;op-vertical-navigation
  name="my-navigation"
  [navigation]="navigationData()"
  variant="default"
  appearance="dense"&gt;
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
export class NavigationVerticalCompact {
  private _navigationDataService = inject(NavigationDataService);

  // Get navigation data from global service
  navigationData = this._navigationDataService.navigationData;
}
