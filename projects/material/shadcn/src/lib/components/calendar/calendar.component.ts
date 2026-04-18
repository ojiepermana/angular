import { ChangeDetectionStrategy, Component, computed, forwardRef, input, model } from '@angular/core';
import { MatCalendar } from '@angular/material/datepicker';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { cn } from '../../core/cn/cn.util';

/**
 * Inline calendar built on MatCalendar. Requires a date adapter provider in the
 * consumer app (e.g. `provideNativeDateAdapter()` from `@angular/material/core`).
 */
@Component({
  selector: 'ui-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCalendar],
  host: { '[class]': 'classes()' },
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CalendarComponent), multi: true }],
  template: `
    <mat-calendar
      class="ui-calendar"
      [selected]="value()"
      [minDate]="min()"
      [maxDate]="max()"
      [startAt]="startAt()"
      (selectedChange)="onSelect($event)" />
  `,
  styles: [
    `
      :host {
        display: inline-block;
        padding: 0.75rem;
        border-radius: var(--radius);
        border: 1px solid hsl(var(--border));
        background: hsl(var(--background));
        color: hsl(var(--foreground));
      }
      .ui-calendar {
        display: block;
      }
    `,
  ],
})
export class CalendarComponent implements ControlValueAccessor {
  readonly value = model<Date | null>(null);
  readonly min = input<Date | null>(null);
  readonly max = input<Date | null>(null);
  readonly startAt = input<Date | null>(null);
  readonly class = input<string>('');

  protected readonly classes = computed(() => cn('', this.class()));

  private onChangeFn: (v: Date | null) => void = () => {};
  private onTouchedFn: () => void = () => {};

  protected onSelect(d: Date | null): void {
    this.value.set(d);
    this.onChangeFn(d);
    this.onTouchedFn();
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
}
