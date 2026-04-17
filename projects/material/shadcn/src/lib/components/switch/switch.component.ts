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
import { MatSlideToggle, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { cn } from '../../core/cn/cn.util';

/**
 * Switch — shadcn-styled wrapper around `mat-slide-toggle`.
 */
@Component({
  selector: 'ui-switch',
  imports: [MatSlideToggle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SwitchComponent), multi: true },
  ],
  template: `
    <mat-slide-toggle
      #ref
      hideIcon
      disableRipple
      [class]="classes()"
      [checked]="checked()"
      [disabled]="disabled()"
      [required]="required()"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-labelledby]="ariaLabelledby()"
      (change)="handleChange($event)"
    >
      <ng-content />
    </mat-slide-toggle>
  `,
  styleUrl: './switch.component.css',
})
export class SwitchComponent implements ControlValueAccessor {
  readonly required = input<boolean>(false);
  readonly ariaLabel = input<string | null>(null, { alias: 'aria-label' });
  readonly ariaLabelledby = input<string | null>(null, { alias: 'aria-labelledby' });
  readonly class = input<string>('');

  readonly checkedChange = output<boolean>();

  private readonly ref = viewChild.required<MatSlideToggle>('ref');

  protected readonly checked = signal<boolean>(false);
  protected readonly disabled = signal<boolean>(false);
  protected readonly classes = computed(() => cn('ui-switch', this.class()));

  private onChange: (v: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  protected handleChange(e: MatSlideToggleChange): void {
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
