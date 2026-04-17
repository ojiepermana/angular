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

@Component({
  selector: 'ui-form-description, p[ui-form-description]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'classes()',
    '[attr.id]': 'ctx.descriptionId',
  },
  template: `<ng-content />`,
})
export class FormDescriptionComponent implements OnInit, OnDestroy {
  protected readonly ctx = inject(FormFieldContext);
  readonly class = input<string>('');

  protected readonly classes = computed(() => cn('text-sm text-muted-foreground', this.class()));

  ngOnInit(): void {
    this.ctx.hasDescription.set(true);
  }

  ngOnDestroy(): void {
    this.ctx.hasDescription.set(false);
  }
}
