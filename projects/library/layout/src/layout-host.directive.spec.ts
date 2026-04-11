import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LayoutHostDirective } from './layout-host.directive';
import { provideNgLayout } from './layout.provider';
import { LayoutService } from './layout.service';

@Component({
  imports: [LayoutHostDirective],
  template: `
    <section ngtLayoutHost>
      <span>Projected content</span>
    </section>
  `,
})
class LayoutHostTestComponent {}

describe('LayoutHostDirective', () => {
  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [LayoutHostTestComponent],
      providers: [
        provideNgLayout({
          defaultMode: 'vertical',
          defaultContainer: 'full',
        }),
      ],
    }).compileComponents();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    localStorage.clear();
  });

  it('mirrors the layout contract onto the host element', () => {
    const fixture = TestBed.createComponent(LayoutHostTestComponent);
    const layout = TestBed.inject(LayoutService);

    fixture.detectChanges();
    layout.setMode('horizontal');
    layout.setContainer('boxed');
    TestBed.flushEffects();
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('section') as HTMLElement;

    expect(host.getAttribute('data-layout-mode')).toBe('horizontal');
    expect(host.getAttribute('data-layout-container')).toBe('boxed');
  });
});
