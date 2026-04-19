import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LabelComponent, SliderComponent } from '@ojiepermana/angular/component';

import { ShellLayoutComponent } from '@ojiepermana/angular/layout';

@Component({
  selector: 'demo-shadcn-slider-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ShellLayoutComponent, FormsModule, LabelComponent, SliderComponent],
  template: `
    <ui-shell title="Slider" description="Styled native range input. Works with ngModel / FormControl.">
      <section class="mb-10 grid max-w-md gap-3">
        <h2 class="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Default</h2>
        <label ui-label>Volume: {{ value() }}</label>
        <input ui-slider type="range" min="0" max="100" step="1" [(ngModel)]="value" />
      </section>

      <section>
        <h2 class="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Disabled</h2>
        <input ui-slider type="range" min="0" max="100" [value]="40" disabled />
      </section>
    </ui-shell>
  `,
})
export class SliderPageComponent {
  protected readonly value = signal(33);
}
