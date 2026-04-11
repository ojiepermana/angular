import { Directive, inject } from '@angular/core';
import { LayoutService } from './layout.service';

@Directive({
  selector: '[ngtLayoutHost]',
  host: {
    '[attr.data-layout-mode]': 'layout.mode()',
    '[attr.data-layout-container]': 'layout.container()',
  },
})
export class LayoutHostDirective {
  protected readonly layout = inject(LayoutService);
}
