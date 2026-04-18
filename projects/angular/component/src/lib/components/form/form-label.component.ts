import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { cn } from '../../core/cn/cn.util';
import { FormFieldContext } from './form-field.context';

@Component({
  selector: 'ui-form-label, label[ui-form-label]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'classes()',
    '[attr.for]': 'ctx.controlId',
  },
  template: `<ng-content />`,
})
export class FormLabelComponent {
  protected readonly ctx = inject(FormFieldContext);
  readonly class = input<string>('');

  protected readonly classes = computed(() =>
    cn(
      'text-sm font-medium leading-none',
      this.ctx.invalid() ? 'text-destructive' : 'text-foreground',
      'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      this.class(),
    ),
  );
}
