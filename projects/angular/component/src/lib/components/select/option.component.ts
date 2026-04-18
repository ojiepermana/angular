import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { cn } from '../../core/cn/cn.util';

/**
 * Option for `<ui-select>`. Wraps `mat-option` so the underlying `mat-select`
 * can still discover it via `@ContentChildren(MatOption, { descendants: true })`.
 */
@Component({
  selector: 'ui-option',
  imports: [MatOption],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()' },
  template: `
    <mat-option [value]="value()" [disabled]="disabled()">
      <ng-content />
    </mat-option>
  `,
})
export class OptionComponent {
  readonly value = input.required<unknown>();
  readonly disabled = input<boolean>(false);
  readonly class = input<string>('');

  protected readonly classes = computed(() => cn('contents', this.class()));
}
