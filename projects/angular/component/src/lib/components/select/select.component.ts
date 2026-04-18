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
import { MatFormField } from '@angular/material/form-field';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { cn } from '../../core/cn/cn.util';

@Component({
  selector: 'ui-select',
  imports: [MatFormField, MatSelect],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SelectComponent), multi: true }],
  template: `
    <mat-form-field [class]="classes()" subscriptSizing="dynamic">
      <mat-select
        #ref
        disableRipple
        panelClass="ui-select-panel"
        [value]="value()"
        [disabled]="disabled()"
        [multiple]="multiple()"
        [placeholder]="placeholder()"
        [required]="required()"
        [attr.aria-label]="ariaLabel()"
        [attr.aria-labelledby]="ariaLabelledby()"
        (selectionChange)="handleChange($event)"
        (openedChange)="openedChange.emit($event)">
        <ng-content />
      </mat-select>
    </mat-form-field>
  `,
  styleUrl: './select.component.css',
})
export class SelectComponent implements ControlValueAccessor {
  readonly placeholder = input<string>('');
  readonly multiple = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly ariaLabel = input<string | null>(null, { alias: 'aria-label' });
  readonly ariaLabelledby = input<string | null>(null, { alias: 'aria-labelledby' });
  readonly class = input<string>('');

  readonly valueChange = output<unknown>();
  readonly openedChange = output<boolean>();

  private readonly ref = viewChild.required<MatSelect>('ref');

  protected readonly value = signal<unknown>(null);
  protected readonly disabled = signal<boolean>(false);
  protected readonly classes = computed(() => cn('ui-select-field w-full', this.class()));

  private onChange: (v: unknown) => void = () => {};
  private onTouched: () => void = () => {};

  protected handleChange(e: MatSelectChange): void {
    this.value.set(e.value);
    this.onChange(e.value);
    this.onTouched();
    this.valueChange.emit(e.value);
  }

  open(): void {
    this.ref().open();
  }

  close(): void {
    this.ref().close();
  }

  focus(): void {
    this.ref().focus();
  }

  writeValue(v: unknown): void {
    this.value.set(v);
  }
  registerOnChange(fn: (v: unknown) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(d: boolean): void {
    this.disabled.set(d);
  }
}
