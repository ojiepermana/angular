import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EtosLayoutComponent } from '@ojiepermana/angular/etos';

@Component({
  selector: 'app-pages',
  imports: [RouterLink, EtosLayoutComponent],
  host: {
    class: 'contents',
  },
  template: `
    <etos-layout>
      <a ui-layout-brand routerLink="/" class="etos-brand-link">
        <span class="etos-brand-mark">OJ</span>
        <span class="etos-brand-copy">
          <span class="etos-brand-name">Ojiepermana UI</span>
          <span class="etos-brand-subtitle">Angular component library</span>
        </span>
      </a>

      <button ui-layout-profile type="button" aria-label="Open profile menu" class="etos-profile-trigger">
        <span class="etos-profile-name">Ojie Permana</span>
        <span class="etos-profile-mark">OP</span>
      </button>
    </etos-layout>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pages {}
