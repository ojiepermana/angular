import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Empty layout — full-viewport, flex-centered main.
 *
 * Cocok untuk halaman login / error / onboarding (pola shadcn `login-05`).
 * Konten dirender lewat `<router-outlet>`; consumer men-style card / form
 * milik halaman route sendiri.
 *
 * Markup:
 * ```html
 * <empty>
 *   <!-- router-outlet dirender oleh komponen -->
 * </empty>
 * ```
 */
@Component({
  selector: 'empty',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
  host: {
    class: 'flex min-h-dvh w-full items-center justify-center bg-background p-6 text-foreground',
  },
  template: `
    <main class="w-full max-w-sm">
      <router-outlet />
    </main>
  `,
})
export class EmptyLayoutComponent {}
