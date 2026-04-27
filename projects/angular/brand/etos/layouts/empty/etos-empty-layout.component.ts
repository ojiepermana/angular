import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'etos-empty-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
  host: {
    class: 'etos-layout-empty-host',
    'data-brand-layout': 'etos-empty',
  },
  template: `
    <main class="etos-layout-empty-main">
      <router-outlet />
    </main>
  `,
})
export class EtosEmptyLayoutComponent {}