import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { CardComponent } from './card.component';
import { CardHeaderComponent } from './card-header.component';
import { CardTitleComponent } from './card-title.component';
import { CardDescriptionComponent } from './card-description.component';
import { CardContentComponent } from './card-content.component';
import { CardFooterComponent } from './card-footer.component';

@Component({
  imports: [
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardDescriptionComponent,
    CardContentComponent,
    CardFooterComponent,
  ],
  template: `
    <ui-card>
      <ui-card-header>
        <ui-card-title>Title</ui-card-title>
        <ui-card-description>Desc</ui-card-description>
      </ui-card-header>
      <ui-card-content>Body</ui-card-content>
      <ui-card-footer>Foot</ui-card-footer>
    </ui-card>
  `,
})
class Host {}

describe('Card primitives', () => {
  it('composes with all parts and applies shadcn styling tokens', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('ui-card')!.className).toContain('rounded-lg');
    expect(root.querySelector('ui-card')!.className).toContain('bg-card');
    expect(root.querySelector('ui-card-header')).toBeTruthy();
    expect(root.querySelector('ui-card-title')!.textContent).toContain('Title');
    expect(root.querySelector('ui-card-description')!.textContent).toContain('Desc');
    expect(root.querySelector('ui-card-content')!.textContent).toContain('Body');
    expect(root.querySelector('ui-card-footer')!.textContent).toContain('Foot');
  });
});
