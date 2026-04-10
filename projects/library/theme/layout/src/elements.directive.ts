import { Directive } from '@angular/core';

@Directive({
  selector: 'layout',
})
export class LayoutElementDirective {}

@Directive({
  selector: 'content',
})
export class ContentElementDirective {}

@Directive({
  selector: 'brand',
})
export class BrandElementDirective {}

@Directive({
  selector: 'panel',
})
export class PanelElementDirective {}
