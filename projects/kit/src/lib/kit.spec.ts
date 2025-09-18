import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Kit } from './kit';

describe('Kit', () => {
  let component: Kit;
  let fixture: ComponentFixture<Kit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Kit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Kit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
