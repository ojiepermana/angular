import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
} from '@angular/core';
import { cn } from '../../core/cn/cn.util';

/**
 * Styled native range input. Works with `ngModel` / `FormControl` via
 * Angular's built-in `RangeValueAccessor`. Keyboard + ARIA handled by the browser.
 */
@Component({
  selector: 'input[type=range][ui-slider]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()' },
  template: '',
  styleUrl: './slider.component.css',
})
export class SliderComponent {
  private readonly el = inject<ElementRef<HTMLInputElement>>(ElementRef);
  readonly class = input<string>('');

  protected readonly classes = computed(() =>
    cn(
      'ui-slider relative w-full appearance-none bg-transparent',
      'focus-visible:outline-none',
      'disabled:pointer-events-none disabled:opacity-50',
      this.class(),
    ),
  );

  focus(): void {
    this.el.nativeElement.focus();
  }
}
