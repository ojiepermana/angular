import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { LayoutService } from '@ojiepermana/angular/layout';
import { EtosHorizontalLayoutComponent } from './etos-horizontal-layout.component';
import { EtosVerticalLayoutComponent } from './etos-vertical-layout.component';

@Component({
  selector: 'etos-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EtosHorizontalLayoutComponent, EtosVerticalLayoutComponent],
  host: {
    class: 'contents',
  },
  template: `
    @switch (layoutMode()) {
      @case ('horizontal') {
        <etos-horizontal-layout [ariaLabel]="ariaLabel()">
          <ng-content select="[ui-layout-brand],[ui-topbar-start]" />
          <ng-content select="[ui-layout-profile],[ui-topbar-end]" />
        </etos-horizontal-layout>
      }
      @default {
        <etos-vertical-layout [ariaLabel]="ariaLabel()" />
      }
    }
  `,
})
export class EtosLayoutComponent {
  private readonly layout = inject(LayoutService);

  readonly ariaLabel = input<string>('Primary');

  protected readonly layoutMode = this.layout.mode;
}
