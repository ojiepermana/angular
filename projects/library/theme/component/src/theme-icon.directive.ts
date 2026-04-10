import { Directive } from '@angular/core';
import { provideLucideConfig } from '@lucide/angular';

@Directive({
  selector: '[themeLucideConfig]',
  providers: [provideLucideConfig({ absoluteStrokeWidth: true })],
})
export class ThemeLucideConfigDirective {}
