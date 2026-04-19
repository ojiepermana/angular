import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LabelComponent, RadioComponent, RadioGroupComponent } from '@ojiepermana/angular/component';

import { ShellLayoutComponent } from '@ojiepermana/angular/layout';

@Component({
  selector: 'demo-shadcn-radio-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ShellLayoutComponent, FormsModule, LabelComponent, RadioComponent, RadioGroupComponent],
  template: `
    <ui-shell title="Radio" description="Mutually exclusive selection within a group.">
      <section class="mb-10">
        <h2 class="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Default</h2>
        <ui-radio-group name="plan" [(ngModel)]="value">
          <label ui-label class="flex items-center gap-2">
            <ui-radio value="basic" />
            <span>Basic</span>
          </label>
          <label ui-label class="flex items-center gap-2">
            <ui-radio value="pro" />
            <span>Pro</span>
          </label>
          <label ui-label class="flex items-center gap-2">
            <ui-radio value="team" />
            <span>Team</span>
          </label>
        </ui-radio-group>
        <p class="mt-3 text-sm text-muted-foreground">Selected: {{ value() ?? '—' }}</p>
      </section>
    </ui-shell>
  `,
})
export class RadioPageComponent {
  protected readonly value = signal<string | null>('pro');
}
