import { Component, inject } from '@angular/core';
import { ThemeService } from '@ojiepermana/kit';

@Component({
  selector: 'app-theme-debug',
  imports: [],
  template: `
    <div style="padding: 20px; border: 2px solid black; margin: 20px; background: white;">
      <h3>Theme Debug Panel</h3>
      <div style="font-family: monospace; line-height: 1.6;">
        <p><strong>Current Theme:</strong> {{ themeService.variant() }}</p>
        <p><strong>Current Mode:</strong> {{ themeService.mode() }}</p>
        <p><strong>HTML Classes:</strong> {{ getHtmlClasses() }}</p>
        <p><strong>HTML data-theme:</strong> {{ getHtmlTheme() }}</p>
        <p><strong>--primary value:</strong> {{ getPrimaryValue() }}</p>
        <p><strong>--primary-foreground value:</strong> {{ getPrimaryForegroundValue() }}</p>
        <p><strong>--background value:</strong> {{ getBackgroundValue() }}</p>
      </div>

      <div style="margin: 20px 0;">
        <button (click)="testDarkMode()" style="margin-right: 10px; padding: 10px; background: #007acc; color: white; border: none; border-radius: 4px;">
          Toggle Dark Mode
        </button>
      </div>

      <div style="margin: 20px 0;">
        <h4>Theme Variants:</h4>
        <button (click)="testDefaultTheme()" style="margin: 5px; padding: 8px 12px; background: #6b7280; color: white; border: none; border-radius: 4px;">
          Default
        </button>
        <button (click)="testRedTheme()" style="margin: 5px; padding: 8px 12px; background: #dc2626; color: white; border: none; border-radius: 4px;">
          Red
        </button>
        <button (click)="testRoseTheme()" style="margin: 5px; padding: 8px 12px; background: #f43f5e; color: white; border: none; border-radius: 4px;">
          Rose
        </button>
        <button (click)="testOrangeTheme()" style="margin: 5px; padding: 8px 12px; background: #f97316; color: white; border: none; border-radius: 4px;">
          Orange
        </button>
        <button (click)="testGreenTheme()" style="margin: 5px; padding: 8px 12px; background: #22c55e; color: white; border: none; border-radius: 4px;">
          Green
        </button>
        <button (click)="testBlueTheme()" style="margin: 5px; padding: 8px 12px; background: #3b82f6; color: white; border: none; border-radius: 4px;">
          Blue
        </button>
        <button (click)="testYellowTheme()" style="margin: 5px; padding: 8px 12px; background: #f59e0b; color: white; border: none; border-radius: 4px;">
          Yellow
        </button>
        <button (click)="testVioletTheme()" style="margin: 5px; padding: 8px 12px; background: #8b5cf6; color: white; border: none; border-radius: 4px;">
          Violet
        </button>
        <button (click)="testZincTheme()" style="margin: 5px; padding: 8px 12px; background: #52525b; color: white; border: none; border-radius: 4px;">
          Zinc
        </button>
        <button (click)="testSlateTheme()" style="margin: 5px; padding: 8px 12px; background: #475569; color: white; border: none; border-radius: 4px;">
          Slate
        </button>
        <button (click)="testStoneTheme()" style="margin: 5px; padding: 8px 12px; background: #57534e; color: white; border: none; border-radius: 4px;">
          Stone
        </button>
      </div>

      <div style="padding: 10px; background: rgb(var(--primary)); color: rgb(var(--primary-foreground)); margin: 10px 0; border-radius: 4px;">
        <strong>Primary Color Test</strong><br>
        Background: rgb(var(--primary))<br>
        Color: rgb(var(--primary-foreground))
      </div>
      <div style="padding: 10px; background: rgb(var(--background)); color: rgb(var(--foreground)); border: 1px solid; margin: 10px 0; border-radius: 4px;">
        <strong>Background Color Test</strong><br>
        Background: rgb(var(--background))<br>
        Color: rgb(var(--foreground))
      </div>
    </div>
  `,
  styles: []
})
export class ThemeDebugComponent {
  readonly themeService = inject(ThemeService);

  testDarkMode() {
    console.log('Toggling dark mode...');
    this.themeService.toggleMode();
  }

  testDefaultTheme() {
    console.log('Setting default theme...');
    this.themeService.setVariant('default');
  }

  testRedTheme() {
    console.log('Setting red theme...');
    this.themeService.setVariant('red');
  }

  testRoseTheme() {
    console.log('Setting rose theme...');
    this.themeService.setVariant('rose');
  }

  testOrangeTheme() {
    console.log('Setting orange theme...');
    this.themeService.setVariant('orange');
  }

  testGreenTheme() {
    console.log('Setting green theme...');
    this.themeService.setVariant('green');
  }

  testBlueTheme() {
    console.log('Setting blue theme...');
    this.themeService.setVariant('blue');
  }

  testYellowTheme() {
    console.log('Setting yellow theme...');
    this.themeService.setVariant('yellow');
  }

  testVioletTheme() {
    console.log('Setting violet theme...');
    this.themeService.setVariant('violet');
  }

  testZincTheme() {
    console.log('Setting zinc theme...');
    this.themeService.setVariant('zinc');
  }

  testSlateTheme() {
    console.log('Setting slate theme...');
    this.themeService.setVariant('slate');
  }

  testStoneTheme() {
    console.log('Setting stone theme...');
    this.themeService.setVariant('stone');
  }

  getHtmlClasses(): string {
    return document.documentElement.classList.toString();
  }

  getHtmlTheme(): string {
    return document.documentElement.getAttribute('data-theme') || 'none';
  }

  getPrimaryValue(): string {
    return getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
  }

  getPrimaryForegroundValue(): string {
    return getComputedStyle(document.documentElement).getPropertyValue('--primary-foreground').trim();
  }

  getBackgroundValue(): string {
    return getComputedStyle(document.documentElement).getPropertyValue('--background').trim();
  }
}
