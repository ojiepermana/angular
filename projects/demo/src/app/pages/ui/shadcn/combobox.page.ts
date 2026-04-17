import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComboboxComponent, type ComboboxOption } from '@ojiepermana/material/shadcn';

import { PageShellComponent } from '../../../core/page-shell/page-shell';

@Component({
  selector: 'demo-shadcn-combobox-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageShellComponent, FormsModule, ComboboxComponent],
  template: `
    <demo-page-shell
      title="Combobox"
      description="Searchable single-select dropdown. Combines button trigger with the Command palette.">
      <section class="mb-10">
        <h2 class="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Default</h2>
        <ui-combobox class="block w-72" [options]="options" [placeholder]="'Select framework…'" [(ngModel)]="value" />
        <p class="mt-3 text-sm text-muted-foreground">Selected: {{ value() ?? '—' }}</p>
      </section>
    </demo-page-shell>
  `,
})
export class ComboboxPageComponent {
  protected readonly options: ComboboxOption<string>[] = [
    { value: 'angular', label: 'Angular' },
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'solid', label: 'Solid' },
  ];

  protected readonly value = signal<string | null>(null);
}
