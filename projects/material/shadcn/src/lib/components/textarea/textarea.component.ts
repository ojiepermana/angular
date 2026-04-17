import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
} from '@angular/core';
import { cn } from '../../core/cn/cn.util';

@Component({
  selector: 'textarea[ui-textarea]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()' },
  template: '',
})
export class TextareaComponent {
  private readonly el = inject<ElementRef<HTMLTextAreaElement>>(ElementRef);
  readonly class = input<string>('');

  protected readonly classes = computed(() =>
    cn(
      [
        'flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2',
        'text-sm shadow-sm transition-colors',
        'placeholder:text-muted-foreground',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-visible:ring-destructive',
      ].join(' '),
      this.class(),
    ),
  );

  focus(): void {
    this.el.nativeElement.focus();
  }
}
