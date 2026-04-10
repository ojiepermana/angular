import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ContentElementDirective, LayoutElementDirective } from './elements.directive';

@Component({
  selector: 'vertical',
  imports: [RouterOutlet, LayoutElementDirective, ContentElementDirective],
  host: {
    '[attr.layout-mode]': '"vertical"',
  },
  template: `
    <layout>
      <content>
        <aside>
          <ng-content select="[navigation]"></ng-content>
        </aside>
        <main>
          <router-outlet />
        </main>
      </content>
    </layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutVerticalComponent {}
