import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { cn } from '../../core/cn/cn.util';

@Component({
  selector: 'ui-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
})
export class AvatarComponent {
  readonly class = input<string>('');
  protected readonly classes = computed(() =>
    cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', this.class()),
  );
}

@Component({
  selector: 'ui-avatar-image',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (!failed()) {
      <img [src]="src()" [alt]="alt()" [class]="classes()" (error)="failed.set(true)" />
    }
  `,
})
export class AvatarImageComponent {
  readonly src = input.required<string>();
  readonly alt = input<string>('');
  readonly class = input<string>('');

  protected readonly failed = signal(false);
  protected readonly classes = computed(() => cn('aspect-square h-full w-full object-cover', this.class()));
}

@Component({
  selector: 'ui-avatar-fallback',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
})
export class AvatarFallbackComponent {
  readonly class = input<string>('');
  protected readonly classes = computed(() =>
    cn(
      'flex h-full w-full items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground',
      this.class(),
    ),
  );
}
