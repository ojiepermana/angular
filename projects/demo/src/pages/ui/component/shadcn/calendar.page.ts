import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CalendarComponent } from '@ojiepermana/angular/component';

import { ShellLayoutComponent } from '@ojiepermana/angular/layout';

@Component({
  selector: 'demo-shadcn-calendar-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ShellLayoutComponent, CalendarComponent],
  template: `
    <ui-shell title="Calendar" description="Inline date picker built on MatCalendar with shadcn tokens.">
      <section class="mb-10">
        <h2 class="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Default</h2>
        <ui-calendar [(value)]="value" />
        <p class="mt-3 text-sm text-muted-foreground">Selected: {{ value()?.toDateString() ?? '—' }}</p>
      </section>
    </ui-shell>
  `,
})
export class CalendarPageComponent {
  protected readonly value = signal<Date | null>(new Date());
}
