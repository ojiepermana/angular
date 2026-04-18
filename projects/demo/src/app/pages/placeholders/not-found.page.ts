import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PageShellComponent } from '../../core/page-shell/page-shell';

@Component({
  selector: 'demo-not-found-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageShellComponent, RouterLink],
  template: `
    <demo-page-shell title="404 — Not found" description="The requested page does not exist.">
      <a
        class="text-sm font-medium text-primary underline-offset-4 hover:underline"
        [routerLink]="'/docs/introduction'">
        Go back to the docs home
      </a>
    </demo-page-shell>
  `,
})
export class NotFoundPageComponent {}
