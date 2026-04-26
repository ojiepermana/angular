import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutService } from '@ojiepermana/angular/layout';
import { SidebarComponent, type SidebarAppearance, type SidebarPosition } from '@ojiepermana/angular/navigation';

@Component({
  selector: 'etos-vertical-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, SidebarComponent],
  host: {
    '[class]': 'hostClasses()',
    '[attr.data-brand-layout]': 'brandLayout',
    '[attr.data-layout-width]': 'layoutWidth()',
  },
  template: `
    <div [class]="frameClasses()">
      <ui-sidebar
        class="etos-layout-sidebar"
        [appearance]="sidebarAppearance()"
        [position]="sidebarPosition()"
        [ariaLabel]="ariaLabel()"
        [style.border-left-width]="dividerBorderWidth()"
        [style.border-right-width]="dividerBorderWidth()" />
      <main [class]="mainClasses()">
        <router-outlet />
      </main>
    </div>
  `,
})
export class EtosVerticalLayoutComponent {
  private readonly layout = inject(LayoutService);

  readonly sidebarAppearance = input<SidebarAppearance>('default');
  readonly sidebarPosition = input<SidebarPosition>('left');
  readonly ariaLabel = input<string>('Primary');

  protected readonly brandLayout = 'etos-vertical';
  protected readonly layoutWidth = this.layout.width;
  protected readonly dividerBorderWidth = computed(() => 'var(--border-width)');

  protected readonly hostClasses = computed(() => {
    const classes = ['etos-layout-host', 'etos-layout-host--vertical'];
    if (this.layoutWidth() === 'fixed') {
      classes.push('etos-layout-host--fixed');
    }
    return classes.join(' ');
  });

  protected readonly frameClasses = computed(() => {
    const classes = ['etos-layout-frame', 'etos-layout-frame--vertical'];
    if (this.layoutWidth() === 'fixed') {
      classes.push('etos-layout-frame--fixed');
    }
    return classes.join(' ');
  });

  protected readonly mainClasses = computed(() => {
    const classes = ['etos-layout-main'];
    if (this.layoutWidth() === 'fixed') {
      classes.push('etos-layout-main--fixed');
    }
    return classes.join(' ');
  });
}
