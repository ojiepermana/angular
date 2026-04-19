import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OptionComponent, SelectComponent } from '@ojiepermana/angular/component';

import { ShellLayoutComponent } from '@ojiepermana/angular/layout';

@Component({
  selector: 'demo-shadcn-select-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ShellLayoutComponent, FormsModule, OptionComponent, SelectComponent],
  template: `
    <ui-shell title="Select" description="Single-select wrapper on mat-select with shadcn styling.">
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
    </ui-shell>
  `,
})
export class SelectPageComponent {
  protected readonly value = signal<string | null>(null);
}
