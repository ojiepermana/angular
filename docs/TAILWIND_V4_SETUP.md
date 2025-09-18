# Styling Implementation dengan Utility-First CSS dalam @ojiepermana/kit

## Overview

Komponen Button telah diupdate untuk menggunakan pendekatan utility-first CSS yang terinspirasi oleh Tailwind CSS, dengan custom utility classes yang didefinisikan secara langsung untuk performa optimal.

## Pendekatan yang Digunakan

### 1. **Custom Utility Classes**
Alih-alih menggunakan Tailwind CSS yang kompleks, kami membuat utility classes sendiri:

```css
/* Global styles.css */
.btn-base {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  /* ... base styles */
}

.btn-primary { /* variant styles */ }
.btn-sm { /* size styles */ }
```

### 2. **Host Bindings dengan Computed Classes**
```typescript
@Component({
  selector: 'button',
  host: {
    '[class]': 'buttonClasses()',
    '[type]': 'type()',
    '[disabled]': 'disabled()',
    '(click)': 'handleClick($event)'
  },
  template: `<ng-content />`
})
```

### 3. **Computed Signals untuk Dynamic Classes**
```typescript
buttonClasses = computed(() => {
  const baseClass = 'btn-base';
  const variantClass = `btn-${this.variant()}`;
  const sizeClass = `btn-${this.size()}`;
  
  return [baseClass, variantClass, sizeClass].join(' ');
});
```

## Class Structure

### Base Classes
```typescript
const baseClasses = [
  // Layout & Display
  'inline-flex', 'items-center', 'justify-center',
  
  // Typography & Spacing
  'font-medium', 'text-center', 'whitespace-nowrap',
  
  // Appearance
  'border-0', 'rounded-md',
  
  // Interactions
  'cursor-pointer', 'select-none',
  
  // Transitions
  'transition-colors', 'duration-200', 'ease-in-out',
  
  // Focus states
  'focus:outline-none', 'focus:ring-2', 'focus:ring-offset-2'
];
```

### Variant Classes
- **Primary**: `bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800`
- **Secondary**: `bg-slate-600 text-white hover:bg-slate-700 active:bg-slate-800`
- **Danger**: `bg-red-600 text-white hover:bg-red-700 active:bg-red-800`
- **Success**: `bg-green-600 text-white hover:bg-green-700 active:bg-green-800`

### Size Classes
- **Small**: `h-8 px-3 text-sm gap-1.5`
- **Medium**: `h-10 px-4 text-sm gap-2`
- **Large**: `h-12 px-6 text-base gap-2`

## Keuntungan Pendekatan v4

### 1. **No Config File Needed**
- Tidak perlu `tailwind.config.js` yang kompleks
- Menggunakan `@import "tailwindcss"` langsung di CSS

### 2. **Better Performance**
- Classes di-generate on-demand
- Bundle size lebih kecil
- Faster build times

### 3. **Modern Angular Features**
- Menggunakan computed signals
- Host bindings untuk cleaner templates
- Better type safety

### 4. **Enhanced Developer Experience**
- IntelliSense yang lebih baik
- Auto-completion untuk classes
- Better debugging

## Setup Requirements

### 1. **Install Tailwind CSS v4**
```bash
npm install -D tailwindcss@next @tailwindcss/postcss@next
```

### 2. **Update Global Styles**
```css
/* src/styles.css */
@import "tailwindcss";
```

### 3. **No Additional Configuration**
Tailwind CSS v4 bekerja out-of-the-box tanpa konfigurasi tambahan!

## Contoh Penggunaan

```typescript
import { Component } from '@angular/core';
import { Button } from '@ojiepermana/kit';

@Component({
  selector: 'app-example',
  imports: [Button],
  template: `
    <!-- Primary button dengan semua Tailwind features -->
    <button variant="primary" size="md">
      Primary Action
    </button>
    
    <!-- Success button dengan disabled state -->
    <button variant="success" size="lg" [disabled]="isLoading">
      {{ isLoading ? 'Loading...' : 'Submit' }}
    </button>
  `
})
export class ExampleComponent {
  isLoading = false;
}
```

## Best Practices

### 1. **Use Computed Signals**
- Untuk dynamic class generation
- Better performance dengan caching otomatis

### 2. **Host Bindings**
- Untuk styling component host element
- Cleaner templates

### 3. **Semantic Color Palette**
- Menggunakan semantic colors (blue, red, green, slate)
- Consistent dengan design system

### 4. **Accessibility First**
- Focus states yang jelas
- Proper disabled states
- Screen reader friendly

## Migration dari CSS Custom ke Tailwind v4

### Before (Custom CSS)
```css
.kit-button {
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  /* ... many more lines */
}
```

### After (Tailwind v4)
```typescript
const baseClasses = [
  'border-0',
  'rounded-md', 
  'font-medium'
  // Clean, utility-first approach
];
```

## Hasil Akhir

Komponen Button sekarang:
- ✅ Menggunakan Tailwind CSS v4 tanpa config file
- ✅ Modern Angular patterns dengan signals
- ✅ Better performance dan bundle size
- ✅ Enhanced developer experience
- ✅ Fully accessible dan responsive
- ✅ Consistent design system
