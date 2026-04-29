import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { VerticalLayout } from './vertical';

describe('VerticalLayout', () => {
  let component: VerticalLayout;
  let fixture: ComponentFixture<VerticalLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerticalLayout],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(VerticalLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
