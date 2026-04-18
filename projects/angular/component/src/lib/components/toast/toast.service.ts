import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef } from '@angular/material/snack-bar';

export type ToastVariant = 'default' | 'destructive' | 'success';

export interface ToastOptions {
  readonly title?: string;
  readonly description?: string;
  readonly action?: string;
  readonly variant?: ToastVariant;
  readonly durationMs?: number;
  readonly horizontalPosition?: MatSnackBarConfig['horizontalPosition'];
  readonly verticalPosition?: MatSnackBarConfig['verticalPosition'];
}

/**
 * Thin, opinionated wrapper over MatSnackBar that applies shadcn styling
 * via `panelClass: ui-toast-panel` and variant data attributes.
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly snack = inject(MatSnackBar);

  show(options: ToastOptions): MatSnackBarRef<unknown> {
    const message = options.title
      ? options.description
        ? `${options.title}\n${options.description}`
        : options.title
      : (options.description ?? '');

    const variant = options.variant ?? 'default';

    return this.snack.open(message, options.action ?? '', {
      duration: options.durationMs ?? 5000,
      horizontalPosition: options.horizontalPosition ?? 'end',
      verticalPosition: options.verticalPosition ?? 'bottom',
      panelClass: ['ui-toast-panel', `ui-toast-${variant}`],
    });
  }

  success(opts: Omit<ToastOptions, 'variant'>): MatSnackBarRef<unknown> {
    return this.show({ ...opts, variant: 'success' });
  }

  error(opts: Omit<ToastOptions, 'variant'>): MatSnackBarRef<unknown> {
    return this.show({ ...opts, variant: 'destructive' });
  }

  dismiss(): void {
    this.snack.dismiss();
  }
}
