import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { AvatarComponent, AvatarFallbackComponent, AvatarImageComponent } from './avatar.component';

@Component({
  imports: [AvatarComponent, AvatarImageComponent, AvatarFallbackComponent],
  template: `
    <ui-avatar>
      <ui-avatar-image [src]="src" alt="OP" />
      <ui-avatar-fallback>OP</ui-avatar-fallback>
    </ui-avatar>
  `,
})
class Host {
  src = 'https://example.test/avatar.png';
}

describe('Avatar primitives', () => {
  it('renders the image with src/alt and exposes a fallback', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const img = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    expect(img.getAttribute('src')).toBe('https://example.test/avatar.png');
    expect(img.getAttribute('alt')).toBe('OP');
    expect(fixture.nativeElement.querySelector('ui-avatar-fallback')!.textContent).toContain('OP');
    expect(fixture.nativeElement.querySelector('ui-avatar')!.className).toContain('rounded-full');
  });

  it('hides the <img> once it errors, revealing the fallback', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const img = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    img.dispatchEvent(new Event('error'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('img')).toBeNull();
  });
});
