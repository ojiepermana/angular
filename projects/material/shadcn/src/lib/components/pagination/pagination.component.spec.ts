import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { PaginationComponent } from './pagination.component';

@Component({
  imports: [PaginationComponent],
  template: `<ui-pagination [(page)]="page" [total]="total" (pageChange)="last.set($event)" />`,
})
class Host {
  page = 3;
  total = 10;
  last = signal(0);
}

describe('PaginationComponent', () => {
  function render() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const buttons = Array.from(root.querySelectorAll('button')) as HTMLButtonElement[];
    return { fixture, root, buttons };
  }

  it('exposes nav[aria-label="pagination"] and marks current page', () => {
    const { root } = render();
    expect(root.querySelector('ui-pagination')!.getAttribute('role')).toBe('navigation');
    expect(root.querySelector('ui-pagination')!.getAttribute('aria-label')).toBe('pagination');
    const current = root.querySelector('button[aria-current="page"]')!;
    expect(current.textContent?.trim()).toBe('3');
  });

  it('disables Previous on page=1', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.page = 1;
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const prev = root.querySelector('button[aria-label="Go to previous page"]') as HTMLButtonElement;
    expect(prev.disabled).toBe(true);
  });

  it('disables Next on page=total', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.page = 10;
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const next = root.querySelector('button[aria-label="Go to next page"]') as HTMLButtonElement;
    expect(next.disabled).toBe(true);
  });

  it('emits pageChange and updates two-way bound page on click', () => {
    const { fixture, root } = render();
    const pageFiveBtn = Array.from(root.querySelectorAll('button')).find((b) => b.textContent?.trim() === '5') as
      | HTMLButtonElement
      | undefined;
    // Page 5 is not in window (siblingCount=1 default around current=3) so pick Next.
    const next = root.querySelector('button[aria-label="Go to next page"]') as HTMLButtonElement;
    next.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.last()).toBe(4);
    expect(fixture.componentInstance.page).toBe(4);

    // ensure silence when we click the ghost page 5 button if it exists (won't in this window)
    expect(pageFiveBtn).toBeUndefined();
  });

  it('renders ellipsis when page is near the middle of a large range', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.total = 20;
    fixture.componentInstance.page = 10;
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const ellipses = root.querySelectorAll('span[aria-hidden="true"]');
    expect(ellipses.length).toBeGreaterThanOrEqual(2);
  });
});
