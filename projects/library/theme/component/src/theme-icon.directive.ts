import { Directive } from '@angular/core';
import { provideLucideConfig } from '@lucide/angular';

@Directive({
  selector: '[themeLucideConfig]',
  providers: [provideLucideConfig({ absoluteStrokeWidth: true, strokeWidth: 1.35 })],
})
export class ThemeLucideConfigDirective {}
