import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerComponent } from '@ojiepermana/material/shadcn';

import { PageShellComponent } from '../../../core/page-shell/page-shell';

@Component({
  selector: 'demo-shadcn-date-picker-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageShellComponent, FormsModule, DatePickerComponent],
  template: `
    <demo-page-shell title="Date Picker" description="Popup calendar input with shadcn styling.">
      <section class="mb-10">
        <h2 class="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Default</h2>
        <ui-date-picker class="block w-72" [(ngModel)]="value" placeholder="Pick a date" />
        <p class="mt-3 text-sm text-muted-foreground">Selected: {{ value()?.toDateString() ?? '—' }}</p>
      </section>
    </demo-page-shell>
  `,
})
export class DatePickerPageComponent {
  protected readonly value = signal<Date | null>(null);
}
