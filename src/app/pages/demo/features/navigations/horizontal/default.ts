import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HorizontalNavigation } from '../../../../../../../projects/kit/src/lib/components/navigation/horizontal/horizontal-navigation';
import { NavigationDataService } from '../../../../../services/navigation-data.service';

@Component({
  selector: 'navigation-horizontal-default',
  imports: [HorizontalNavigation],
  template: `
    <div class="p-8 space-y-8">
      <div class="space-y-4">
        <h1 class="text-3xl font-bold">Horizontal Navigation - Default Variant</h1>
        <p class="text-muted-foreground text-lg">
          Showcase of the default horizontal navigation component with dropdown support.
        </p>
      </div>

      <div class="space-y-8">
        <!-- Default Horizontal Navigation -->
        <div class="space-y-4">
          <h2 class="text-xl font-semibold">Default Style</h2>
          <p class="text-sm text-muted-foreground">
            Standard horizontal navigation with dropdown menus and full interaction support.
          </p>
          <div class="border border-color rounded-lg p-4 bg-card">
            <op-horizontal-navigation
              name="demo-horizontal-default"
              [navigation]="navigationData()"
              variant="default">
            </op-horizontal-navigation>
          </div>
        </div>

        <!-- Compact Version -->
        <div class="space-y-4">
          <h2 class="text-xl font-semibold">Compact Layout</h2>
          <p class="text-sm text-muted-foreground">
            Same horizontal navigation in a narrower container to show responsive behavior.
          </p>
          <div class="border border-color rounded-lg p-4 bg-card max-w-2xl">
            <op-horizontal-navigation
              name="demo-horizontal-compact"
              [navigation]="navigationData()"
              variant="default">
            </op-horizontal-navigation>
          </div>
        </div>
      </div>

      <!-- Features Information -->
      <div class="space-y-4">
        <h2 class="text-xl font-semibold">Features</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="p-4 border border-color rounded-lg">
            <h3 class="font-medium mb-2">📂 Dropdown Menus</h3>
            <p class="text-sm text-muted-foreground">
              Multi-level dropdown navigation with smooth transitions.
            </p>
          </div>
          <div class="p-4 border border-color rounded-lg">
            <h3 class="font-medium mb-2">📱 Responsive Design</h3>
            <p class="text-sm text-muted-foreground">
              Adapts to different screen sizes and container widths.
            </p>
          </div>
          <div class="p-4 border border-color rounded-lg">
            <h3 class="font-medium mb-2">🎯 Active States</h3>
            <p class="text-sm text-muted-foreground">
              Automatic active state detection based on current route.
            </p>
          </div>
          <div class="p-4 border border-color rounded-lg">
            <h3 class="font-medium mb-2">🏷️ Icons & Badges</h3>
            <p class="text-sm text-muted-foreground">
              Material icons and badge notifications support.
            </p>
          </div>
          <div class="p-4 border border-color rounded-lg">
            <h3 class="font-medium mb-2">♿ Accessible</h3>
            <p class="text-sm text-muted-foreground">
              Built with accessibility best practices and keyboard navigation.
            </p>
          </div>
          <div class="p-4 border border-color rounded-lg">
            <h3 class="font-medium mb-2">🎨 Themeable</h3>
            <p class="text-sm text-muted-foreground">
              Supports light/dark modes and glass variants.
            </p>
          </div>
        </div>
      </div>

      <!-- Code Example -->
      <div class="space-y-4">
        <h2 class="text-xl font-semibold">Usage Example</h2>
        <div class="bg-muted rounded-lg p-4 overflow-x-auto">
          <pre class="text-sm"><code>&lt;op-horizontal-navigation
  name="my-navigation"
  [navigation]="navigationData()"
  variant="default"
  (itemClicked)="onItemClick($event)"&gt;
&lt;/op-horizontal-navigation&gt;</code></pre>
        </div>
      </div>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationHorizontalDefault {
  private _navigationDataService = inject(NavigationDataService);

  // Get navigation data from global service
  navigationData = this._navigationDataService.navigationData;
}
