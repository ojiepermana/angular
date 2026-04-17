import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { cn } from '../../core/cn/cn.util';

@Component({
  selector: 'ui-checkbox',
  imports: [MatCheckbox],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CheckboxComponent), multi: true },
  ],
  template: `
    <mat-checkbox
      #ref
      disableRipple
      [class]="classes()"
      [checked]="checked()"
      [disabled]="disabled()"
      [indeterminate]="indeterminate()"
      [required]="required()"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-labelledby]="ariaLabelledby()"
      (change)="handleChange($event)"
    >
      <ng-content />
    </mat-checkbox>
  `,
  styleUrl: './checkbox.component.css',
})
export class CheckboxComponent implements ControlValueAccessor {
  readonly indeterminate = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly ariaLabel = input<string | null>(null, { alias: 'aria-label' });
  readonly ariaLabelledby = input<string | null>(null, { alias: 'aria-labelledby' });
  readonly class = input<string>('');

  readonly checkedChange = output<boolean>();

  private readonly ref = viewChild.required<MatCheckbox>('ref');

  protected readonly checked = signal<boolean>(false);
  protected readonly disabled = signal<boolean>(false);
  protected readonly classes = computed(() => cn('ui-checkbox', this.class()));

  private onChange: (v: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  protected handleChange(e: MatCheckboxChange): void {
    this.checked.set(e.checked);
    this.onChange(e.checked);
    this.onTouched();
    this.checkedChange.emit(e.checked);
  }

  focus(): void {
    this.ref().focus();
  }

  writeValue(v: boolean): void {
    this.checked.set(!!v);
  }
  registerOnChange(fn: (v: boolean) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(d: boolean): void {
    this.disabled.set(d);
  }
}
