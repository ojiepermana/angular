import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  BrandElementDirective,
  ContentElementDirective,
  LayoutElementDirective,
  PanelElementDirective,
} from './elements.directive';

@Component({
  selector: 'horizontal',
  imports: [
    RouterOutlet,
    LayoutElementDirective,
    ContentElementDirective,
    BrandElementDirective,
    PanelElementDirective,
  ],
  host: {
    '[attr.layout-mode]': '"horizontal"',
  },
  template: `
    <layout>
      <content>
        <header>
          <brand>
            <ng-content select="[headerBrand]"></ng-content>
          </brand>

          <nav>
            <ng-content select="[headerNavigation]"></ng-content>
          </nav>

          <panel>
            <ng-content select="[headerActions]"></ng-content>
          </panel>
        </header>

        <main>
          <router-outlet />
        </main>
      </content>
    </layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutHorizontalComponent {}
