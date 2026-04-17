import { Directive, TemplateRef, inject } from '@angular/core';

/**
 * Wraps a template that will be rendered inside a popover overlay.
 * Must be used on an `<ng-template>` element.
 *
 * @example
 * <ng-template uiPopoverContent #popover>
 *   <div class="p-4">Content</div>
 * </ng-template>
 */
@Directive({
  selector: 'ng-template[uiPopoverContent]',
  exportAs: 'uiPopoverContent',
})
export class PopoverContentDirective {
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
}
