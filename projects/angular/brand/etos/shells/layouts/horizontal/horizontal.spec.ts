import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DEFAULT_NAVIGATION_ID, NavigationService, type NavigationItem } from '@ojiepermana/angular/navigation';

import { HorizontalLayout } from './horizontal';

const navigationItems: NavigationItem[] = [{ id: 'home', type: 'basic', title: 'Home', link: '/' }];

@Component({
  imports: [HorizontalLayout],
  template: `
    <ng-template #brand>
      <span>Brand</span>
    </ng-template>

    <ng-template #profile>
      <div class="flex min-w-0 items-center gap-3">
        <button type="button">Profile</button>
        <div class="min-w-0 flex flex-col gap-px">
          <span>Ojie Permana</span>
          <span>Etos design system navigator</span>
        </div>
      </div>
    </ng-template>

    <horizontal [brandTemplate]="brand" [profileTemplate]="profile" />
  `,
})
class HostComponent {}

describe('HorizontalLayout', () => {
  let component: HorizontalLayout;
  let fixture: ComponentFixture<HorizontalLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorizontalLayout],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HorizontalLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the shared topbar navigation with projected slots', async () => {
    await TestBed.resetTestingModule()
      .configureTestingModule({
        imports: [HostComponent],
        providers: [provideRouter([])],
      })
      .compileComponents();

    const navigation = TestBed.inject(NavigationService);
    navigation.registerItems(DEFAULT_NAVIGATION_ID, navigationItems);

    const hostFixture = TestBed.createComponent(HostComponent);
    hostFixture.detectChanges();
    await hostFixture.whenStable();

    const host = hostFixture.nativeElement as HTMLElement;

    expect(host.querySelector('topbar')).not.toBeNull();
    expect(host.querySelector('[data-topbar-slot="start"]')?.textContent).toContain('Brand');
    const endSlot = host.querySelector('[data-topbar-slot="end"]') as HTMLElement | null;

    expect(endSlot?.textContent).toContain('Profile');
    expect(endSlot?.textContent).toContain('Ojie Permana');
    expect(endSlot?.textContent).toContain('Etos design system navigator');
    expect(endSlot?.className).toContain('[&>[topbar-end]>*>*:nth-child(n+2)]:hidden');
    expect(host.querySelector('[role="menubar"]')?.textContent).toContain('Home');
    expect(host.querySelector('main router-outlet')).not.toBeNull();
  });
});
