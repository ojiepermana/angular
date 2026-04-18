import { ChangeDetectionStrategy, Component, ElementRef, computed, inject, input } from '@angular/core';
import { cn } from '../../core/cn/cn.util';

const BASE = [
  'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1',
  'text-sm shadow-sm transition-colors',
  'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
  'placeholder:text-muted-foreground',
  'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
  'disabled:cursor-not-allowed disabled:opacity-50',
  'aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-visible:ring-destructive',
].join(' ');

/**
 * Styled native `<input>`. Works with Angular's DefaultValueAccessor,
 * so `ngModel` and reactive forms just work.
 */
@Component({
  selector: 'input[ui-input]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()' },
  template: '',
})
export class InputComponent {
  private readonly el = inject<ElementRef<HTMLInputElement>>(ElementRef);
  readonly class = input<string>('');

  protected readonly classes = computed(() => cn(BASE, this.class()));

  focus(): void {
    this.el.nativeElement.focus();
  }
}
