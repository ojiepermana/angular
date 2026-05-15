import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShellPage } from './shell';

describe('Shell', () => {
  let component: ShellPage;
  let fixture: ComponentFixture<ShellPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShellPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ShellPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
