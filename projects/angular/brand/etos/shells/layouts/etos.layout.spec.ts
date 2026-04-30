import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMaterialLayout } from '@ojiepermana/angular/layout';
import { EtosLayoutComponent } from './etos.layout';

@Component({
  imports: [EtosLayoutComponent],
  template: `
    <ng-template #profileTemplate>
      <div>Profile Panel</div>
    </ng-template>

    <etos-layout [layoutProfileTemplate]="profileTemplate" />
  `,
})
class HostComponent {}

describe('EtosLayoutComponent', () => {
  async function createFixture(options?: {
    persistedMode?: 'empty' | 'horizontal' | 'vertical';
    inputMode?: 'empty' | 'horizontal' | 'vertical';
  }): Promise<ComponentFixture<EtosLayoutComponent>> {
    localStorage.clear();

    if (options?.persistedMode) {
      localStorage.setItem('layout-mode', options.persistedMode);
    }

    await TestBed.resetTestingModule()
      .configureTestingModule({
        imports: [EtosLayoutComponent],
        providers: [provideMaterialLayout({ mode: 'vertical' })],
      })
      .compileComponents();

    const fixture = TestBed.createComponent(EtosLayoutComponent);

    if (options?.inputMode) {
      fixture.componentRef.setInput('mode', options.inputMode);
    }

    fixture.detectChanges();
    await fixture.whenStable();

    return fixture;
  }

  afterEach(() => {
    localStorage.clear();
  });

  it('renders the vertical layout from the layout service by default', async () => {
    const fixture = await createFixture();
    const host = fixture.nativeElement as HTMLElement;

    expect(host.getAttribute('data-layout-mode')).toBe('vertical');
    expect(host.querySelector('vertical')).not.toBeNull();
    expect(host.querySelector('horizontal')).toBeNull();
    expect(host.querySelector('empty')).toBeNull();
  });

  it('renders the horizontal layout from persisted layout mode', async () => {
    const fixture = await createFixture({ persistedMode: 'horizontal' });
    const host = fixture.nativeElement as HTMLElement;

    expect(host.getAttribute('data-layout-mode')).toBe('horizontal');
    expect(host.querySelector('horizontal')).not.toBeNull();
    expect(host.querySelector('vertical')).toBeNull();
    expect(host.querySelector('empty')).toBeNull();
  });

  it('renders the empty layout when the input overrides the layout service', async () => {
    const fixture = await createFixture({ inputMode: 'empty' });
    const host = fixture.nativeElement as HTMLElement;

    expect(host.getAttribute('data-layout-mode')).toBe('empty');
    expect(host.querySelector('empty')).not.toBeNull();
    expect(host.querySelector('vertical')).toBeNull();
    expect(host.querySelector('horizontal')).toBeNull();
  });

  it('uses layoutProfileTemplate as the vertical footer fallback', async () => {
    localStorage.clear();

    await TestBed.resetTestingModule()
      .configureTestingModule({
        imports: [HostComponent],
        providers: [provideMaterialLayout({ mode: 'vertical' })],
      })
      .compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const host = fixture.nativeElement as HTMLElement;

    expect(host.querySelector('vertical')).not.toBeNull();
    expect(host.textContent).toContain('Profile Panel');
  });
});
