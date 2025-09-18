# Cara Menggunakan Struktur Bertingkat di @ojiepermana/kit

## Overview

Library `@ojiepermana/kit` telah dikonfigurasi untuk mendukung struktur pemanggilan bertingkat menggunakan barrel exports. Ini memungkinkan Anda untuk mengimpor komponen dan modul dengan cara yang lebih terorganisir dan intuitif.

## Struktur Folder Library

```
projects/kit/src/lib/
├── ui/
│   ├── component/
│   │   ├── button.ts          # Button component
│   │   └── index.ts           # Export semua components
│   ├── service/
│   │   └── index.ts           # Export semua services
│   ├── directive/
│   │   └── index.ts           # Export semua directives
│   ├── pipe/
│   │   └── index.ts           # Export semua pipes
│   └── index.ts               # Export semua UI modules
├── utils/
│   └── index.ts               # Export semua utilities
├── types/
│   └── index.ts               # Export semua types
└── kit.ts                     # Original kit component
```

## Cara Import dengan Struktur Bertingkat

### 1. Import Spesifik dari Kategori Component

```typescript
// Import semua UI components (recommended)
import { Button } from '@ojiepermana/kit';

// Alternatif: Import langsung dari path struktur (jika menggunakan alias)
// import { Button } from '@ojiepermana/kit/ui/component';
```

### 2. Import Berdasarkan Kategori

```typescript
// Import semua dari kategori UI
import { Button } from '@ojiepermana/kit';

// Import utilities (ketika tersedia)
// import { someUtil } from '@ojiepermana/kit';

// Import types (ketika tersedia)
// import { SomeType } from '@ojiepermana/kit';
```

### 3. Import Selektif dengan Alias

```typescript
// Import dengan nama spesifik
import { 
  Button,
  type ButtonVariant,
  type ButtonSize 
} from '@ojiepermana/kit';

// Menggunakan alias
import { Button as KitButton } from '@ojiepermana/kit';
```

## Contoh Penggunaan dalam Component

```typescript
import { Component } from '@angular/core';
import { Button, type ButtonVariant } from '@ojiepermana/kit';

@Component({
  selector: 'app-example',
  imports: [Button],
  template: \`
    <button 
      variant="primary" 
      size="md"
      (click)="onButtonClick()">
      Click me
    </button>
  \`
})
export class ExampleComponent {
  onButtonClick() {
    console.log('Button clicked!');
  }
}
```

## Menambahkan Komponen Baru

### 1. Buat Component Baru

```typescript
// projects/kit/src/lib/ui/component/card.ts
import { Component, input } from '@angular/core';

@Component({
  selector: 'kit-card',
  template: \`
    <div class="kit-card">
      <ng-content />
    </div>
  \`,
  styles: \`
    .kit-card {
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      padding: 1rem;
      background: white;
    }
  \`
})
export class Card {
  // Component properties
}
```

### 2. Export di Index Component

```typescript
// projects/kit/src/lib/ui/component/index.ts
export * from './button';
export * from './card';  // Tambahkan export baru
```

### 3. Pastikan Export Sudah Terintegrasi

```typescript
// projects/kit/src/lib/ui/index.ts
export * from './component';
// export * from './service';
// export * from './directive';
// export * from './pipe';
```

### 4. Update Public API

```typescript
// projects/kit/src/public-api.ts
export * from './lib/kit';
export * from './lib/ui';
// export * from './lib/utils';
// export * from './lib/types';
```

## Build dan Testing

### Build Library
\`\`\`bash
ng build kit
\`\`\`

### Testing Import
\`\`\`typescript
// Test import dalam app component
import { Button, Card } from '@ojiepermana/kit';
\`\`\`

## Best Practices

### 1. Naming Convention
- Gunakan PascalCase untuk component names
- Gunakan kebab-case untuk selectors
- Gunakan selector yang simpel dan clean

### 2. Struktur Export
- Gunakan barrel exports (index.ts) di setiap folder
- Export types bersama dengan components
- Selalu update public-api.ts

### 3. Documentation
- Dokumentasikan setiap komponen dengan JSDoc
- Berikan contoh penggunaan
- Jelaskan properties dan events

## Troubleshooting

### Import Error
Jika terjadi error import:
1. Pastikan ng build kit berhasil
2. Periksa barrel exports di index.ts
3. Pastikan public-api.ts sudah diupdate

### TypeScript Error
1. Periksa path imports
2. Pastikan types di-export dengan benar
3. Rebuild library setelah perubahan

## Struktur Pemanggilan yang Diinginkan

Dengan konfigurasi ini, Anda bisa menggunakan:

\`\`\`typescript
// Cara import yang diinginkan (simulated)
import { Button } from '@ojiepermana/kit/ui/component/button';
import { Button } from '@ojiepermana/kit/ui/component';
import { Button } from '@ojiepermana/kit/ui';
import { Button } from '@ojiepermana/kit';
\`\`\`

*Note: Untuk mencapai path import yang sangat spesifik seperti `@ojiepermana/kit/ui/component/button`, diperlukan konfigurasi secondary entry points yang lebih advanced.*
