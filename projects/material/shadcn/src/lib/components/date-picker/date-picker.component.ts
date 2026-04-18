import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  model,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { cn } from '../../core/cn/cn.util';

/**
 * Popup date picker. Requires a date adapter provider in the consumer app
 * (e.g. `provideNativeDateAdapter()` from `@angular/material/core`).
 */
@Component({
  selector: 'ui-date-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatFormField, MatInput, MatDatepicker, MatDatepickerInput, MatDatepickerToggle],
  host: { '[class]': 'classes()' },
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DatePickerComponent), multi: true }],
  template: `
    <mat-form-field class="ui-date-picker" appearance="outline" subscriptSizing="dynamic">
      <input
        matInput
        [matDatepicker]="picker"
        [placeholder]="placeholder()"
        [min]="min()"
        [max]="max()"
        [formControl]="control" />
      <mat-datepicker-toggle matIconSuffix [for]="picker" />
      <mat-datepicker #picker panelClass="ui-datepicker-panel" />
    </mat-form-field>
  `,
})
export class DatePickerComponent implements ControlValueAccessor {
  readonly value = model<Date | null>(null);
  readonly placeholder = input<string>('Pick a date');
  readonly min = input<Date | null>(null);
  readonly max = input<Date | null>(null);
  readonly disabled = model<boolean>(false);
  readonly class = input<string>('');

  protected readonly classes = computed(() => cn('inline-block', this.class()));

  protected readonly control = new FormControl<Date | null>(null);

  private onChangeFn: (v: Date | null) => void = () => {};
  private onTouchedFn: () => void = () => {};

  constructor() {
    effect(() => {
      const next = this.value();
      if (this.control.value !== next) {
        this.control.setValue(next, { emitEvent: false });
      }
    });

    effect(() => {
      const d = this.disabled();
      d ? this.control.disable({ emitEvent: false }) : this.control.enable({ emitEvent: false });
    });

    this.control.valueChanges.pipe(takeUntilDestroyed(inject(DestroyRef))).subscribe((next) => {
      untracked(() => this.value.set(next));
      this.onChangeFn(next);
      this.onTouchedFn();
    });
  }

  writeValue(v: Date | null): void {
    this.value.set(v);
  }

  registerOnChange(fn: (v: Date | null) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(state: boolean): void {
    this.disabled.set(state);
  }
}
