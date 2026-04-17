import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { cn } from '../../core/cn/cn.util';
import { FormFieldContext } from './form-field.context';

/**
 * Renders validation errors for the field's control.
 * By default, surfaces the first error key. Provide custom content to override.
 */
@Component({
  selector: 'ui-form-message, p[ui-form-message]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'classes()',
    '[attr.id]': 'ctx.messageId',
    '[attr.role]': '"alert"',
    '[attr.aria-live]': '"polite"',
  },
  template: `
    @if (show()) {
      <ng-content>{{ ctx.firstError() }}</ng-content>
    }
  `,
})
export class FormMessageComponent implements OnInit, OnDestroy {
  protected readonly ctx = inject(FormFieldContext);
  readonly class = input<string>('');

  protected readonly show = computed(() => this.ctx.invalid());
  protected readonly classes = computed(() =>
    cn('text-sm font-medium text-destructive', this.class()),
  );

  ngOnInit(): void {
    this.ctx.hasMessage.set(true);
  }

  ngOnDestroy(): void {
    this.ctx.hasMessage.set(false);
  }
}
