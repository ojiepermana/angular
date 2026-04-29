import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { EmptyLayout } from './empty';

describe('EmptyLayout', () => {
  let component: EmptyLayout;
  let fixture: ComponentFixture<EmptyLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyLayout],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
