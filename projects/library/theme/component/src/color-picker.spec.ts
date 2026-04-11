import { TestBed } from '@angular/core/testing';

import { provideNgTheme } from '../../service/src/theme.provider';
import { ThemeService } from '../../service/src/theme.service';
import { ColorPickerComponent } from './color-picker';

describe('ColorPickerComponent', () => {
  beforeEach(async () => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: vi.fn().mockImplementation(
        (query: string): MediaQueryList =>
          ({
            matches: false,
            media: query,
            onchange: null,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            addListener: vi.fn(),
            removeListener: vi.fn(),
            dispatchEvent: vi.fn(),
          }) as MediaQueryList,
      ),
    });

    await TestBed.configureTestingModule({
      imports: [ColorPickerComponent],
      providers: [
        provideNgTheme({
          colors: ['brand', 'green'],
        }),
      ],
    }).compileComponents();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    localStorage.clear();
  });

  it('renders only the configured color presets', () => {
    const fixture = TestBed.createComponent(ColorPickerComponent);
    fixture.detectChanges();

    const swatches = Array.from(
      fixture.nativeElement.querySelectorAll('.color-picker-swatch') as NodeListOf<HTMLElement>,
    );

    expect(swatches.map((swatch) => swatch.getAttribute('data-theme-color'))).toEqual([
      'brand',
      'green',
    ]);
  });

  it('updates the theme color through the shared service', () => {
    const fixture = TestBed.createComponent(ColorPickerComponent);
    const theme = TestBed.inject(ThemeService);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll(
      'button',
    ) as NodeListOf<HTMLButtonElement>;
    buttons[1].click();
    fixture.detectChanges();

    expect(theme.color()).toBe('green');
  });
});
