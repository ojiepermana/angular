import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { describe, expect, it, vi } from 'vitest';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  function configure(open = vi.fn()) {
    TestBed.configureTestingModule({
      providers: [ToastService, { provide: MatSnackBar, useValue: { open, dismiss: vi.fn() } }],
    });
    return { service: TestBed.inject(ToastService), open };
  }

  it('calls MatSnackBar.open with shadcn panel classes', () => {
    const { service, open } = configure();
    service.show({ title: 'Saved', description: 'Changes persisted.' });
    expect(open).toHaveBeenCalledTimes(1);
    const [msg, action, cfg] = open.mock.calls[0];
    expect(msg).toContain('Saved');
    expect(msg).toContain('Changes persisted.');
    expect(action).toBe('');
    expect(cfg.panelClass).toEqual(['ui-toast-panel', 'ui-toast-default']);
    expect(cfg.duration).toBe(5000);
  });

  it('success and error set the variant panel class', () => {
    const { service, open } = configure();
    service.success({ title: 'Done' });
    service.error({ title: 'Boom' });
    expect(open.mock.calls[0][2].panelClass).toEqual(['ui-toast-panel', 'ui-toast-success']);
    expect(open.mock.calls[1][2].panelClass).toEqual(['ui-toast-panel', 'ui-toast-destructive']);
  });
});
