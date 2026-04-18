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
import { MatRadioButton, MatRadioChange, MatRadioGroup } from '@angular/material/radio';
import { cn } from '../../core/cn/cn.util';

@Component({
  selector: 'ui-radio-group',
  imports: [MatRadioGroup],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => RadioGroupComponent), multi: true }],
  template: `
    <mat-radio-group
      #ref
      [class]="classes()"
      [value]="value()"
      [disabled]="disabled()"
      [name]="name()"
      (change)="handleChange($event)">
      <ng-content />
    </mat-radio-group>
  `,
  styleUrl: './radio.component.css',
})
export class RadioGroupComponent implements ControlValueAccessor {
  readonly name = input<string>('');
  readonly orientation = input<'horizontal' | 'vertical'>('vertical');
  readonly class = input<string>('');

  readonly valueChange = output<string>();

  private readonly ref = viewChild.required<MatRadioGroup>('ref');

  protected readonly value = signal<string | null>(null);
  protected readonly disabled = signal<boolean>(false);
  protected readonly classes = computed(() =>
    cn(
      'ui-radio-group grid gap-2',
      this.orientation() === 'horizontal' ? 'grid-flow-col auto-cols-max' : '',
      this.class(),
    ),
  );

  private onChange: (v: string | null) => void = () => {};
  private onTouched: () => void = () => {};

  protected handleChange(e: MatRadioChange): void {
    this.value.set(e.value);
    this.onChange(e.value);
    this.onTouched();
    this.valueChange.emit(e.value);
  }

  focus(): void {
    this.ref()._radios?.first?.focus();
  }

  writeValue(v: string | null): void {
    this.value.set(v ?? null);
  }
  registerOnChange(fn: (v: string | null) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(d: boolean): void {
    this.disabled.set(d);
  }
}

@Component({
  selector: 'ui-radio',
  imports: [MatRadioButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-radio-button disableRipple [class]="classes()" [value]="value()" [disabled]="disabled()">
      <ng-content />
    </mat-radio-button>
  `,
  styleUrl: './radio.component.css',
})
export class RadioComponent {
  readonly value = input.required<string>();
  readonly disabled = input<boolean>(false);
  readonly class = input<string>('');

  protected readonly classes = computed(() => cn('ui-radio', this.class()));
}
