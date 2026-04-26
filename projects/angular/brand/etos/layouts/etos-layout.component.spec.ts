import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { provideEtosBrand } from '../core/etos-brand.provider';
import { EtosLayoutComponent } from './etos-layout.component';

describe('EtosLayoutComponent', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the Etos vertical shell by default', () => {
    TestBed.configureTestingModule({
      imports: [EtosLayoutComponent],
      providers: [
        provideRouter([]),
        provideEtosBrand({
          materialDefaults: false,
          theme: {
            modeStorageKey: null,
            brandStorageKey: null,
            colorStorageKey: null,
            styleStorageKey: null,
          },
          layout: {
            storageKey: null,
            widthStorageKey: null,
          },
        }),
      ],
    });

    const fixture = TestBed.createComponent(EtosLayoutComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('etos-vertical-layout')).toBeTruthy();
    expect(root.querySelector('vertical')).toBeNull();
  });

  it('renders the Etos horizontal shell when layout mode is horizontal', () => {
    TestBed.configureTestingModule({
      imports: [EtosLayoutComponent],
      providers: [
        provideRouter([]),
        provideEtosBrand({
          materialDefaults: false,
          theme: {
            modeStorageKey: null,
            brandStorageKey: null,
            colorStorageKey: null,
            styleStorageKey: null,
          },
          layout: {
            mode: 'horizontal',
            storageKey: null,
            widthStorageKey: null,
          },
        }),
      ],
    });

    const fixture = TestBed.createComponent(EtosLayoutComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('etos-horizontal-layout')).toBeTruthy();
    expect(root.querySelector('horizontal')).toBeNull();
  });
});
