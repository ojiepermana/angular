import { Directive, inject } from '@angular/core';
import { ThemeService } from '@ojiepermana/angular/theme/service';

@Directive({
  selector: '[ngtThemeHost]',
  host: {
    '[class.dark]': 'theme.resolvedScheme() === "dark"',
    '[style.color-scheme]': 'theme.resolvedScheme()',
    '[attr.data-theme-scheme]': 'theme.scheme()',
    '[attr.data-theme-color]': 'theme.color()',
    '[attr.data-theme-appearance]': 'theme.appearance()',
  },
})
export class ThemeHostDirective {
  protected readonly theme = inject(ThemeService);
}
