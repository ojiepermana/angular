import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OptionComponent, SelectComponent } from '@ojiepermana/material/shadcn';

import { PageShellComponent } from '../../../core/page-shell/page-shell';

@Component({
  selector: 'demo-shadcn-select-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageShellComponent, FormsModule, OptionComponent, SelectComponent],
  template: `
    <demo-page-shell title="Select" description="Single-select wrapper on mat-select with shadcn styling.">
      <section class="mb-10">
        <h2 class="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Default</h2>
        <ui-select class="block w-72" placeholder="Select a fruit" [(ngModel)]="value">
          <ui-option value="apple">Apple</ui-option>
          <ui-option value="banana">Banana</ui-option>
          <ui-option value="orange">Orange</ui-option>
          <ui-option value="grape" [disabled]="true">Grape (disabled)</ui-option>
        </ui-select>
        <p class="mt-3 text-sm text-muted-foreground">Selected: {{ value() ?? '—' }}</p>
      </section>
    </demo-page-shell>
  `,
})
export class SelectPageComponent {
  protected readonly value = signal<string | null>(null);
}
