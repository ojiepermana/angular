import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { LayoutHorizontalComponent } from '../../../layouts/src/horizontal';
import { LayoutVerticalComponent } from '../../../layouts/src/vertical';

describe('Layout components', () => {
  it('creates the horizontal layout shell', async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutHorizontalComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(LayoutHorizontalComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('header')).toBeTruthy();
    expect(element.textContent).toContain('Horizontal Shell');
  });

  it('creates the vertical layout shell', async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutVerticalComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(LayoutVerticalComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('aside')).toBeTruthy();
    expect(element.textContent).toContain('Vertical Shell');
  });
});
