# @ojiepermana/kit

Angular UI Library dengan struktur pemanggilan bertingkat dan prefix konvensi `op-`.

## Instalasi

```bash
npm install @ojiepermana/kit
```

## Penggunaan

Library ini menggunakan prefix `op-` untuk semua komponen guna menghindari konflik penamaan dan memberikan namespace yang jelas.

### Naming Convention

Semua komponen menggunakan prefix `op-` (OjiePermanA):
- `<op-button>` untuk Button component
- `<op-theme-selector>` untuk Theme Selector component

### Import Secara Spesifik

```typescript
// Import button component secara spesifik
import { OpButton } from '@ojiepermana/kit/ui/component/button';

// Import semua UI components
import { OpButton, OpThemeSelector } from '@ojiepermana/kit/ui/component';

// Import semua UI modules (components, services, directives, pipes)
import { OpButton, OpThemeSelector } from '@ojiepermana/kit/ui';

// Import semua dari library
import { OpButton, OpThemeSelector } from '@ojiepermana/kit';
```

### Struktur Library

```
@ojiepermana/kit/
├── ui/
│   ├── component/
│   │   ├── button         # Button component
│   │   └── ...           # Component lainnya
│   ├── service/
│   │   └── ...           # Services
│   ├── directive/
│   │   └── ...           # Directives
│   └── pipe/
│       └── ...           # Pipes
├── utils/
│   └── ...               # Utility functions
└── types/
    └── ...               # Type definitions
```

## Contoh Penggunaan

### OpButton Component

```typescript
import { Component } from '@angular/core';
import { OpButton } from '@ojiepermana/kit/ui/component/button';

@Component({
  selector: 'app-example',
  imports: [OpButton],
  template: `
    <op-button 
      variant="primary" 
      size="md"
      (click)="handleClick()">
      Click me
    </op-button>
  `
})
export class ExampleComponent {
  handleClick() {
    console.log('Button clicked!');
  }
}
```

### OpButton Properties

- `variant`: 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' (default: 'primary')
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `type`: 'button' | 'submit' | 'reset' (default: 'button')
- `disabled`: boolean (default: false)

### OpButton Events

- `click`: Event emitted when button is clicked

## Development

Untuk menambahkan komponen baru:

1. Buat file component di folder yang sesuai dalam `src/lib/`
2. Export component di file `index.ts` folder tersebut
3. Pastikan path sudah di-export di `public-api.ts`
4. Buat secondary entry point jika diperlukan

## Build

```bash
ng build kit
```
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the library, run:

```bash
ng build kit
```

This command will compile your project, and the build artifacts will be placed in the `dist/` directory.

### Publishing the Library

Once the project is built, you can publish your library by following these steps:

1. Navigate to the `dist` directory:
   ```bash
   cd dist/kit
   ```

2. Run the `npm publish` command to publish your library to the npm registry:
   ```bash
   npm publish
   ```

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
