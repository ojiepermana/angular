import { ComponentFixture, TestBed } from '@angular/core/testing';
import * as layoutsPublicApi from '../../layouts/public-api';
import * as rootPublicApi from '../public-api';

import { Library } from './library';

describe('Library', () => {
  let component: Library;
  let fixture: ComponentFixture<Library>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Library],
    }).compileComponents();

    fixture = TestBed.createComponent(Library);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('does not export layout shells from the root entry point', () => {
    expect('LayoutHorizontalComponent' in rootPublicApi).toBe(false);
    expect('LayoutVerticalComponent' in rootPublicApi).toBe(false);
  });

  it('exports layout shells from the layouts secondary entry point', () => {
    expect(layoutsPublicApi.LayoutHorizontalComponent).toBeTruthy();
    expect(layoutsPublicApi.LayoutVerticalComponent).toBeTruthy();
  });
});
