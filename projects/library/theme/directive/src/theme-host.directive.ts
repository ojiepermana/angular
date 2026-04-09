import { Directive, inject } from '@angular/core';
import { ThemeService } from '@ojiepermana/angular/theme/service';

@Directive({
  selector: '[ngtThemeHost]',
  host: {
    '[attr.theme-schemes]': 'theme.scheme()',
    '[attr.theme-colors]': 'theme.color()',
    '[attr.theme-appearances]': 'theme.appearance()',
    '[attr.layout-mode]': 'theme.layoutMode()',
    '[attr.layout-container]': 'theme.layoutContainer()',
  },
})
export class ThemeHostDirective {
  protected theme = inject(ThemeService);
}
