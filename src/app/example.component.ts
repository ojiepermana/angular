import { Component } from '@angular/core';
import { OpButton } from '../../projects/kit/src/lib/components/button';

@Component({
  selector: 'app-example',
  imports: [OpButton],
  template: `
    <div class="example-container">
      <h1>Kit Library Example</h1>

      <div class="button-examples">
        <h2>Button Variants</h2>

        <div class="button-group">
          <op-button
            variant="primary"
            size="md"
            (click)="onButtonClick('Primary')">
            Primary Button
          </op-button>

          <op-button
            variant="secondary"
            size="md"
            (click)="onButtonClick('Secondary')">
            Secondary Button
          </op-button>

          <op-button
            variant="outline"
            size="md"
            (click)="onButtonClick('Outline')">
            Outline Button
          </op-button>

          <op-button
            variant="destructive"
            size="md"
            (click)="onButtonClick('Destructive')">
            Destructive Button
          </op-button>
        </div>

        <h2>Button Sizes</h2>
        <div class="button-group">
          <op-button
            variant="primary"
            size="sm"
            (click)="onButtonClick('Small')">
            Small
          </op-button>

          <op-button
            variant="primary"
            size="md"
            (click)="onButtonClick('Medium')">
            Medium
          </op-button>

          <op-button
            variant="primary"
            size="lg"
            (click)="onButtonClick('Large')">
            Large
          </op-button>
        </div>

        <h2>Disabled State</h2>
        <div class="button-group">
          <op-button
            variant="primary"
            size="md"
            [disabled]="true">
            Disabled Button
          </op-button>
        </div>
      </div>

      <div class="css-variable-examples">
        <h2>CSS Variable Customization</h2>

        <h3>1. Base Theme (dari styles.css)</h3>
        <div class="button-group">
          <p class="description">Button menggunakan CSS variables yang didefinisikan di global styles.css</p>
          <op-button variant="primary" size="md">Primary (Base)</op-button>
          <op-button variant="secondary" size="md">Secondary (Base)</op-button>
        </div>

        <h3>2. Theme Classes dengan CSS Variables Override</h3>
        <div class="button-group theme-brand">
          <p class="description">Button dengan custom theme class "theme-brand" yang override CSS variables</p>
          <op-button variant="primary" size="md">Brand Theme</op-button>
          <op-button variant="secondary" size="md">Brand Theme</op-button>
        </div>

        <h3>3. Inline CSS Variables</h3>
        <div class="button-group">
          <p class="description">Button dengan CSS variables inline</p>
          <op-button
            variant="primary"
            size="md"
            style="--btn-primary-bg: #8b5cf6; --btn-primary-text: white; --btn-primary-border: #8b5cf6;">
            Purple Inline
          </op-button>
        </div>

        <h3>4. Dynamic Theme Switching</h3>
        <div class="button-group" [class.dark-theme]="isDarkTheme">
          <p class="description">Click "Toggle Dark Theme" untuk melihat perubahan</p>
          <op-button variant="primary" size="md">Primary (Theme Aware)</op-button>
          <op-button variant="destructive" size="md">Destructive (Theme Aware)</op-button>
          <op-button
            variant="secondary"
            size="md"
            (click)="toggleDarkTheme()">
            Toggle Dark Theme
          </op-button>
        </div>
      </div>

      <div class="output">
        <h3>Output:</h3>
        <p>{{ message }}</p>
      </div>
    </div>
  `,
  styles: `
    .example-container {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .button-examples {
      margin: 2rem 0;
    }

    .button-group {
      display: flex;
      gap: 1rem;
      margin: 1rem 0;
      flex-wrap: wrap;
    }

    .output {
      margin-top: 2rem;
      padding: 1rem;
      background-color: #f5f5f5;
      border-radius: 0.5rem;
    }

    h1, h2, h3 {
      color: #333;
    }

    h2 {
      margin-top: 2rem;
      margin-bottom: 1rem;
    }

    h3 {
      margin-top: 1.5rem;
      margin-bottom: 0.5rem;
      font-size: 1.1rem;
    }

    .description {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
      font-style: italic;
    }

    /* Theme Classes untuk demonstrasi CSS Variables Override */
    .theme-brand {
      --btn-primary-bg: #ec4899;        /* Pink primary */
      --btn-primary-hover: #db2777;
      --btn-primary-active: #be185d;
      --btn-primary-focus: rgba(236, 72, 153, 0.5);

      --btn-secondary-bg: #f8fafc;      /* Light secondary */
      --btn-secondary-hover: #f1f5f9;
      --btn-secondary-active: #e2e8f0;
      --btn-secondary-focus: rgba(236, 72, 153, 0.3);
    }

    /* Dark Theme untuk demonstrasi */
    .dark-theme {
      --btn-primary-bg: #1f2937;        /* Dark primary */
      --btn-primary-hover: #374151;
      --btn-primary-active: #4b5563;
      --btn-primary-focus: rgba(156, 163, 175, 0.5);

      --btn-danger-bg: #dc2626;         /* Keep danger red */
      --btn-danger-hover: #b91c1c;
      --btn-danger-active: #991b1b;
      --btn-danger-focus: rgba(220, 38, 38, 0.5);
    }

    .css-variable-examples {
      margin-top: 3rem;
      padding: 2rem;
      background-color: #f9fafb;
      border-radius: 0.5rem;
      border: 1px solid #e5e7eb;
    }
  `
})
export class ExampleComponent {
  message = 'Click a button to see the output';
  isDarkTheme = false;

  onButtonClick(buttonType: string) {
    this.message = `${buttonType} button clicked at ${new Date().toLocaleTimeString()}`;
  }

  toggleDarkTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    this.message = `Dark theme ${this.isDarkTheme ? 'enabled' : 'disabled'}`;
  }
}
