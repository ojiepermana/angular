import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ui-pie-center',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex max-w-[10rem] flex-col items-center justify-center text-center',
  },
  template: `<ng-content />`,
})
export class PieCenter {}
