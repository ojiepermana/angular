import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ShellPagesComponent } from './shell-pages';

@Component({
  imports: [ShellPagesComponent],
  template: `
    <shell-pages>
      <div shell-pages-header>Header content</div>
      <div shell-pages-main>Main content</div>
      <div shell-pages-footer>Footer content</div>
    </shell-pages>
  `,
})
class HostWithFooterComponent {}

@Component({
  imports: [ShellPagesComponent],
  template: `
    <shell-pages>
      <div shell-pages-header>Header content</div>
      <div shell-pages-main>Main content</div>
    </shell-pages>
  `,
})
class HostWithoutFooterComponent {}

describe('ShellPagesComponent', () => {
  async function createFixture(component: typeof HostWithFooterComponent | typeof HostWithoutFooterComponent) {
    await TestBed.resetTestingModule()
      .configureTestingModule({
        imports: [component],
      })
      .compileComponents();

    const fixture = TestBed.createComponent(component);
    fixture.detectChanges();
    await fixture.whenStable();

    return fixture;
  }

  it('projects header, main, and footer slots', async () => {
    const fixture = await createFixture(HostWithFooterComponent);
    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('header')?.textContent).toContain('Header content');
    expect(root.querySelector('main')?.textContent).toContain('Main content');
    expect(root.querySelector('footer')?.textContent).toContain('Footer content');
  });

  it('hides the footer shell when the consumer omits the footer slot', async () => {
    const fixture = await createFixture(HostWithoutFooterComponent);
    const root = fixture.nativeElement as HTMLElement;
    const footer = root.querySelector('footer') as HTMLElement;

    expect(footer.textContent?.trim()).toBe('');
    expect(getComputedStyle(footer).display).toBe('none');
  });
});
