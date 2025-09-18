# @ojiepermana/angular

Angular UI Library dengan **FLAT ARCHITECTURE** dan `op-` prefix naming convention.

## 🏗️ Library Structure

```
projects/kit/src/lib/
├── components/          # All UI components (op-button, op-card, etc.)
├── services/           # All services (theme, data, etc.)
├── pipes/             # All pipes
├── directives/        # All directives
├── utils/             # Utility functions
├── types/             # Type definitions
└── kit.ts             # Main library component
```

## 📦 Installation

```bash
npm install @ojiepermana/angular
```

### Peer Dependencies

Library ini mendukung Angular Material dan TailwindCSS sebagai peer dependencies:

#### Angular Material (Required)

```bash
# Install Angular Material (jika belum ada)
ng add @angular/material

# Atau install manual
npm install @angular/material @angular/cdk
```

#### TailwindCSS (Required)

```bash
# Install TailwindCSS
npm install -D tailwindcss @tailwindcss/postcss postcss autoprefixer

# Generate config
npx tailwindcss init -p
```

"postcss": "^8.5.6",
    "tailwindcss": "^4.1.13",

**Required versions:**

- `@angular/core`: ^20.3.0
- `@angular/common`: ^20.3.0
- `@angular/material`: ^20.3.0
- `@angular/cdk`: ^20.3.0
- `tailwindcss`: ^4.1.13
- `postcss`: ^8.5.6
- `@tailwindcss/postcss`: ^4.1.13
- `autoprefixer`: ^10.4.0

## 🎯 Component Naming Convention

Semua komponen menggunakan prefix `op-` (OjiePermanA):
- **Selector**: `op-` prefix (e.g., `op-button`, `op-card`)
- **Class**: `Op` prefix dengan PascalCase (e.g., `OpButton`, `OpCard`) 
- **File**: kebab-case (e.g., `button.ts`, `theme-selector.ts`)

## 📖 Usage Examples

### Import Patterns

```typescript
// Main import (recommended)
import { OpButton, OpThemeSelector, ThemeService } from '@ojiepermana/angular';

// Specific category imports
import { OpButton, OpThemeSelector } from '@ojiepermana/angular/components';
import { ThemeService } from '@ojiepermana/angular/services';

// Individual component imports
import { OpButton } from '@ojiepermana/angular/components/button';
import { ThemeService } from '@ojiepermana/angular/services/theme';
```

### Component Usage

```typescript
import { Component } from '@angular/core';
import { OpButton, OpThemeSelector } from '@ojiepermana/angular';

@Component({
  selector: 'app-example',
  imports: [OpButton, OpThemeSelector],
  template: `
    <div>
      <op-theme-selector></op-theme-selector>
      
      <op-button variant="primary" size="md" (click)="onButtonClick()">
        Primary Button
      </op-button>
      
      <op-button variant="destructive" size="lg">
        Destructive Button
      </op-button>
    </div>
  `
})
export class ExampleComponent {
  onButtonClick() {
    console.log('Button clicked!');
  }
}
```

### Angular Material Integration

Library ini dirancang untuk bekerja dengan Angular Material. Anda dapat mengombinasikan komponen op- dengan Material components:

```typescript
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { OpButton, OpThemeSelector } from '@ojiepermana/angular';

@Component({
  selector: 'app-material-example',
  imports: [MatButtonModule, MatCardModule, OpButton, OpThemeSelector],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Theme Demo</mat-card-title>
      </mat-card-header>
      
      <mat-card-content>
        <op-theme-selector></op-theme-selector>
        
        <div style="margin-top: 16px;">
          <op-button variant="primary">Op Button</op-button>
          <button mat-raised-button color="primary">Material Button</button>
        </div>
      </mat-card-content>
    </mat-card>
  `
})
export class MaterialExampleComponent {}
```

## 🎨 Available Components

### OpButton
Button component dengan berbagai variants dan sizes.

**Variants**: `primary`, `secondary`, `destructive`, `outline`, `ghost`  
**Sizes**: `sm`, `md`, `lg`

```html
<op-button variant="primary" size="md" (click)="handleClick()">
  Click me
</op-button>
```

### OpThemeSelector
Component untuk switching theme variants dan mode (light/dark).

```html
<op-theme-selector></op-theme-selector>
```

## 🛠️ Services

### ThemeService
Service untuk managing theme state dengan signals.

```typescript
import { ThemeService } from '@ojiepermana/angular';

@Component({...})
export class MyComponent {
  private themeService = inject(ThemeService);

  changeTheme() {
    this.themeService.setVariant('blue');
    this.themeService.toggleMode();
  }

  // Access current state
  currentTheme = this.themeService.variant; // signal
  currentMode = this.themeService.mode; // signal
}
```

## 🎯 Development Guidelines

### Angular Best Practices
- Standalone components (default)
- Signals for state management
- `input()` and `output()` functions
- `computed()` for derived state
- Native control flow (`@if`, `@for`, `@switch`)
- `inject()` function for dependency injection

### Export Rules
- Each folder has `index.ts` dengan barrel exports
- Semua exports melalui `public-api.ts`
- Support subpath imports dalam package.json

## 🔧 Build Library

```bash
# Build library
ng build kit

# Publish to npm
npm publish dist/kit
```

## 📝 Version History

- **1.2.0**: Added Angular Material as peer dependency, integration examples
- **1.1.0**: Restructured to flat architecture, updated exports
- **1.0.0**: Initial release with ui/ structure

## 📄 License

MIT
