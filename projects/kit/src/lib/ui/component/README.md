# Button Component - CSS Variable Customization

Button component dari `@ojiepermana/kit` menggunakan CSS variables untuk memudahkan kustomisasi tema dan styling.

## Import Component

```typescript
import { Button } from '@ojiepermana/kit/ui/component/button';

@Component({
  imports: [Button],
  template: `
    <button variant="primary" size="md">Click me</button>
  `
})
```

## CSS Variables yang Tersedia

### Primary Button
- `--btn-primary-bg`: Background color (default: #3b82f6)
- `--btn-primary-text`: Text color (default: white)
- `--btn-primary-border`: Border color (default: #3b82f6)

### Secondary Button  
- `--btn-secondary-bg`: Background color (default: transparent)
- `--btn-secondary-text`: Text color (default: #3b82f6)
- `--btn-secondary-border`: Border color (default: #3b82f6)

### Success Button
- `--btn-success-bg`: Background color (default: #10b981)
- `--btn-success-text`: Text color (default: white)
- `--btn-success-border`: Border color (default: #10b981)

### Danger Button
- `--btn-danger-bg`: Background color (default: #ef4444)
- `--btn-danger-text`: Text color (default: white)
- `--btn-danger-border`: Border color (default: #ef4444)

## Cara Kustomisasi

### 1. Global Override (styles.css)

```css
:root {
  --btn-primary-bg: #8b5cf6;
  --btn-primary-text: white;
  --btn-primary-border: #8b5cf6;
  
  --btn-secondary-bg: #f3f4f6;
  --btn-secondary-text: #374151;
  --btn-secondary-border: #d1d5db;
}
```

### 2. Theme Classes

```css
.theme-brand {
  --btn-primary-bg: #ec4899;
  --btn-primary-text: white;
  --btn-primary-border: #ec4899;
}

.theme-dark {
  --btn-primary-bg: #1f2937;
  --btn-primary-text: #f9fafb;
  --btn-primary-border: #374151;
}
```

```html
<div class="theme-brand">
  <button variant="primary">Brand Button</button>
</div>

<div class="theme-dark">
  <button variant="primary">Dark Button</button>
</div>
```

### 3. Inline CSS Variables

```html
<button 
  variant="primary"
  style="--btn-primary-bg: #8b5cf6; --btn-primary-text: white;">
  Purple Button
</button>
```

### 4. Dynamic Theme dengan Angular

```typescript
@Component({
  template: `
    <div [class.dark-theme]="isDarkTheme">
      <button variant="primary">Theme Button</button>
      <button (click)="toggleTheme()">Toggle Theme</button>
    </div>
  `,
  styles: `
    .dark-theme {
      --btn-primary-bg: #1f2937;
      --btn-primary-text: #f9fafb;
      --btn-primary-border: #374151;
    }
  `
})
export class MyComponent {
  isDarkTheme = false;
  
  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
  }
}
```

### 5. CSS Variables dengan Angular Signals

```typescript
import { signal, computed } from '@angular/core';

@Component({
  template: `
    <div [style]="buttonTheme()">
      <button variant="primary">Dynamic Button</button>
    </div>
  `
})
export class MyComponent {
  themeColor = signal('#3b82f6');
  
  buttonTheme = computed(() => ({
    '--btn-primary-bg': this.themeColor(),
    '--btn-primary-border': this.themeColor()
  }));
  
  changeColor(color: string) {
    this.themeColor.set(color);
  }
}
```

## Contoh Implementasi Lengkap

```typescript
import { Component, signal } from '@angular/core';
import { Button } from '@ojiepermana/kit/ui/component/button';

@Component({
  selector: 'app-themed-buttons',
  imports: [Button],
  template: `
    <div class="theme-container" [class]="currentTheme()">
      <h2>Themed Buttons</h2>
      
      <div class="button-group">
        <button variant="primary">Primary</button>
        <button variant="secondary">Secondary</button>
        <button variant="success">Success</button>
        <button variant="danger">Danger</button>
      </div>
      
      <div class="theme-controls">
        <button 
          variant="secondary" 
          (click)="setTheme('light')"
          [class.active]="currentTheme() === 'light'">
          Light
        </button>
        <button 
          variant="secondary" 
          (click)="setTheme('dark')"
          [class.active]="currentTheme() === 'dark'">
          Dark
        </button>
        <button 
          variant="secondary" 
          (click)="setTheme('brand')"
          [class.active]="currentTheme() === 'brand'">
          Brand
        </button>
      </div>
    </div>
  `,
  styles: `
    .theme-container {
      padding: 2rem;
      border-radius: 0.5rem;
      transition: all 0.3s ease;
    }
    
    .button-group {
      display: flex;
      gap: 1rem;
      margin: 1rem 0;
    }
    
    .theme-controls {
      display: flex;
      gap: 0.5rem;
      margin-top: 2rem;
    }
    
    .theme-controls button.active {
      --btn-secondary-bg: #3b82f6;
      --btn-secondary-text: white;
    }
    
    /* Light Theme (default) */
    .light {
      background-color: #ffffff;
      color: #000000;
    }
    
    /* Dark Theme */
    .dark {
      background-color: #1f2937;
      color: #f9fafb;
      --btn-primary-bg: #374151;
      --btn-primary-border: #4b5563;
      --btn-secondary-bg: transparent;
      --btn-secondary-text: #f9fafb;
      --btn-secondary-border: #4b5563;
      --btn-success-bg: #059669;
      --btn-danger-bg: #dc2626;
    }
    
    /* Brand Theme */
    .brand {
      background-color: #fdf2f8;
      color: #831843;
      --btn-primary-bg: #ec4899;
      --btn-primary-border: #ec4899;
      --btn-secondary-bg: transparent;
      --btn-secondary-text: #ec4899;
      --btn-secondary-border: #ec4899;
      --btn-success-bg: #10b981;
      --btn-danger-bg: #f59e0b;
    }
  `
})
export class ThemedButtonsComponent {
  currentTheme = signal('light');
  
  setTheme(theme: string) {
    this.currentTheme.set(theme);
  }
}
```

## Tips dan Best Practices

1. **Fallback Values**: CSS variables selalu menggunakan fallback values, jadi button akan tetap terlihat bagus meski tidak ada custom CSS
2. **Type Safety**: ButtonVariant type memastikan hanya variant yang valid yang bisa digunakan
3. **Performance**: CSS variables lebih performat daripada mengubah class secara dinamis
4. **Konsistensi**: Gunakan naming convention yang konsisten untuk CSS variables
5. **Accessibility**: Pastikan contrast ratio tetap memenuhi standar accessibility saat mengubah warna

## Browser Support

CSS Variables didukung oleh semua browser modern:
- Chrome 49+
- Firefox 31+
- Safari 9.1+
- Edge 16+
