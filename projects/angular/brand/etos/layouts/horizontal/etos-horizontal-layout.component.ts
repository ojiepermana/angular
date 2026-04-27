import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutService } from '@ojiepermana/angular/layout';
import { TopbarComponent, type TopbarAppearance } from '@ojiepermana/angular/navigation';

@Component({
  selector: 'etos-horizontal-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, TopbarComponent],
  host: {
    '[class]': 'hostClasses()',
    '[attr.data-brand-layout]': 'brandLayout',
    '[attr.data-layout-width]': 'layoutWidth()',
  },
  template: `
    <div [class]="frameClasses()">
      <ui-topbar
        class="etos-layout-topbar"
        [appearance]="topbarAppearance()"
        [ariaLabel]="ariaLabel()"
        [style.border-bottom-width]="dividerBorderWidth()">
        <div ui-topbar-start class="etos-layout-topbar-slot etos-layout-topbar-slot--start">
          <ng-content select="[ui-layout-brand],[ui-topbar-start]" />
        </div>
        <div ui-topbar-end class="etos-layout-topbar-slot etos-layout-topbar-slot--end">
          <ng-content select="[ui-layout-profile],[ui-topbar-end]" />
        </div>
      </ui-topbar>
      <main [class]="mainClasses()">
        <router-outlet />
      </main>
    </div>
  `,
})
export class EtosHorizontalLayoutComponent {
  private readonly layout = inject(LayoutService);

  readonly topbarAppearance = input<TopbarAppearance>('default');
  readonly ariaLabel = input<string>('Primary');

  protected readonly brandLayout = 'etos-horizontal';
  protected readonly layoutWidth = this.layout.width;
  protected readonly dividerBorderWidth = computed(() => 'var(--border-width)');

  protected readonly hostClasses = computed(() => {
    const classes = ['etos-layout-host', 'etos-layout-host--horizontal'];
    if (this.layoutWidth() === 'fixed') {
      classes.push('etos-layout-host--fixed');
    }
    return classes.join(' ');
  });

  protected readonly frameClasses = computed(() => {
    const classes = ['etos-layout-frame', 'etos-layout-frame--horizontal'];
    if (this.layoutWidth() === 'fixed') {
      classes.push('etos-layout-frame--fixed');
    }
    return classes.join(' ');
  });

  protected readonly mainClasses = computed(() => {
    const classes = ['etos-layout-main'];
    return classes.join(' ');
  });
}