import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../core/cn/cn.util';
import { FormFieldContext } from './form-field.context';

/**
 * Groups a label, control, description, and validation message.
 * Provides ids + invalid state to descendants via {@link FormFieldContext}.
 */
@Component({
  selector: 'ui-form-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FormFieldContext],
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
})
export class FormFieldComponent {
  readonly class = input<string>('');

  protected readonly classes = computed(() => cn('flex flex-col gap-2', this.class()));
}
