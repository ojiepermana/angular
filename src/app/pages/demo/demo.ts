import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'demo-page',
  imports: [RouterOutlet],
  host: {
    'class': 'flex flex-col h-full'
  },
  template: `<router-outlet></router-outlet>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoPage  {
}
