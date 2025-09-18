# Ala Design System - Angular Kit

## 🎨 Theme System Documentation

Sistem tema yang lengkap dan fleksibel menggunakan CSS Variables tanpa fallbacks untuk kontrol maksimal.

### 📁 Struktur File Theme

```
src/app/styles/themes/ala/
└── variable.css          # Single consolidated theme file
```

### 🎯 Fitur Utama

- ✅ **Single Source of Truth**: Semua CSS variables dalam satu file `variable.css`
- ✅ **Dark/Light Mode**: Toggle otomatis dengan system preference
- ✅ **Multiple Variants**: Default, Business, Nature, Colorful
- ✅ **Kombinasi Mode + Variant**: Dark Business, Dark Nature, etc.
- ✅ **Local Storage**: Menyimpan preferensi user
- ✅ **System Theme Detection**: Auto-detect system dark/light mode
- ✅ **Reactive Angular Service**: ThemeService dengan signals

### 🔧 CSS Variables Structure

#### Global System Variables

```css
/* Background Colors */
--bg-primary: #ffffff;          /* Main backgrounds */
--bg-secondary: #f8fafc;        /* Card backgrounds */
--bg-tertiary: #f1f5f9;         /* Section backgrounds */

/* Text Colors */
--text-primary: #1e293b;        /* Main text */
--text-secondary: #475569;      /* Secondary text */
--text-tertiary: #64748b;       /* Muted text */

/* Border Colors */
--border-primary: #e2e8f0;      /* Main borders */
--border-secondary: #cbd5e1;    /* Secondary borders */
--border-tertiary: #94a3b8;     /* Accent borders */

/* Shadows */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 25px 50px rgba(0, 0, 0, 0.25);
```

#### Button Variables

```css
/* Button Primary */
--btn-primary-bg: #3b82f6;
--btn-primary-hover: #2563eb;
--btn-primary-active: #1d4ed8;
--btn-primary-focus: rgba(59, 130, 246, 0.5);

/* Button Secondary */
--btn-secondary-bg: #6b7280;
--btn-secondary-hover: #4b5563;
--btn-secondary-active: #374151;
--btn-secondary-focus: rgba(107, 114, 128, 0.5);

/* Button Success */
--btn-success-bg: #10b981;
--btn-success-hover: #059669;
--btn-success-active: #047857;

/* Button Danger */
--btn-danger-bg: #ef4444;
--btn-danger-hover: #dc2626;
--btn-danger-active: #b91c1c;
```

### 🌙 Dark Mode Override

Dark mode menggunakan `[data-theme-mode="dark"]` selector:

```css
[data-theme-mode="dark"] {
  --bg-primary: #000000;
  --bg-secondary: #0f172a;
  --bg-tertiary: #1e293b;
  
  --text-primary: #ffffff;
  --text-secondary: #f8fafc;
  --text-tertiary: #cbd5e1;
  
  --border-primary: #334155;
  --border-secondary: #475569;
  --border-tertiary: #64748b;
}
```

### 🎨 Theme Variants

#### Business Variant (Professional Navy)
```css
[data-theme-variant="business"] {
  --btn-primary-bg: #1e3a8a;      /* Navy Blue */
  --btn-secondary-bg: #525252;     /* Professional Gray */
}
```

#### Nature Variant (Forest Green)
```css
[data-theme-variant="nature"] {
  --btn-primary-bg: #059669;      /* Forest Green */
  --btn-secondary-bg: #92400e;    /* Earth Brown */
}
```

#### Colorful Variant (Vibrant Purple)
```css
[data-theme-variant="colorful"] {
  --btn-primary-bg: #8b5cf6;      /* Vibrant Purple */
  --btn-secondary-bg: #ec4899;    /* Hot Pink */
}
```

### 🔄 Theme Service API

#### Import & Injection
```typescript
import { ThemeService } from '@ojiepermana/kit';

export class MyComponent {
  private themeService = inject(ThemeService);
}
```

#### Available Methods
```typescript
// Set theme mode
themeService.setMode('dark' | 'light');

// Set theme variant
themeService.setVariant('default' | 'business' | 'nature' | 'colorful');

// Set complete theme
themeService.setTheme({ mode: 'dark', variant: 'business' });

// Toggle mode
themeService.toggleMode();

// Reset to system preference
themeService.resetToSystem();

// Get available options
themeService.getAvailableModes();     // ['light', 'dark']
themeService.getAvailableVariants();  // ['default', 'business', 'nature', 'colorful']
```

#### Reactive Signals
```typescript
// Read-only signals
const currentMode = themeService.mode();           // 'light' | 'dark'
const currentVariant = themeService.variant();     // 'default' | 'business' | 'nature' | 'colorful'
const currentTheme = themeService.currentTheme();  // { mode: 'dark', variant: 'business' }

// Computed helpers
const isDark = themeService.isDark();              // boolean
const isLight = themeService.isLight();            // boolean

// Theme classes for conditional styling
const themeClasses = themeService.themeClasses();  // { 'theme-dark': true, 'theme-business': true }
```

### 🎛️ Theme Switcher Component

```typescript
import { ThemeSwitcherComponent } from './components/theme-switcher.component';

@Component({
  imports: [ThemeSwitcherComponent],
  template: `
    <app-theme-switcher></app-theme-switcher>
  `
})
```

### 💡 Usage Examples

#### Basic CSS Variables Usage
```html
<div style="background: var(--bg-primary); color: var(--text-primary);">
  Content with theme variables
</div>
```

#### Button with CSS Variables
```css
.my-button {
  background: var(--btn-primary-bg);
  color: white;
  border: 1px solid var(--btn-primary-bg);
}

.my-button:hover {
  background: var(--btn-primary-hover);
}

.my-button:focus {
  box-shadow: 0 0 0 3px var(--btn-primary-focus);
}
```

#### Conditional Theme Classes
```html
<div [class]="themeService.themeClasses()">
  <p>This content adapts to current theme</p>
</div>
```

### 🔧 Development Setup

#### 1. Build Library
```bash
ng build kit
```

#### 2. Path Mapping (tsconfig.json)
```json
{
  "compilerOptions": {
    "paths": {
      "@ojiepermana/kit": ["./dist/kit"]
    }
  }
}
```

#### 3. Import Theme Styles (styles.css)
```css
@import "tailwindcss";
@import "./app/styles/themes/ala/variable.css";
```

### 🎯 Best Practices

1. **Consistency**: Selalu gunakan CSS variables untuk colors, spacing, shadows
2. **No Fallbacks**: CSS variables tanpa fallback untuk kontrol maksimal
3. **Semantic Naming**: Gunakan nama yang menjelaskan fungsi (`--btn-primary-bg` vs `--blue-500`)
4. **Component Variables**: Tambahkan variables baru untuk setiap komponen
5. **Theme Testing**: Test semua kombinasi mode + variant

### 🚀 Future Extensions

#### Adding New Theme Variants
```css
/* Ocean Variant Example */
[data-theme-variant="ocean"] {
  --btn-primary-bg: #0ea5e9;      /* Ocean Blue */
  --btn-secondary-bg: #06b6d4;    /* Cyan */
  /* Add other variant-specific variables */
}
```

#### Adding Component Variables
```css
/* Card Component Variables */
--card-bg: var(--bg-primary);
--card-border: var(--border-primary);
--card-shadow: var(--shadow-md);
--card-border-radius: 0.5rem;

/* Input Component Variables */
--input-bg: var(--bg-primary);
--input-border: var(--border-primary);
--input-focus: var(--btn-primary-bg);
--input-placeholder: var(--text-tertiary);
```

### 🎨 Design Tokens

Variables ini juga bisa diekspor sebagai design tokens untuk tools lain:

```json
{
  "color": {
    "background": {
      "primary": { "value": "{bg-primary}" },
      "secondary": { "value": "{bg-secondary}" }
    },
    "button": {
      "primary": {
        "background": { "value": "{btn-primary-bg}" },
        "hover": { "value": "{btn-primary-hover}" }
      }
    }
  }
}
```

---

**Happy Theming! 🎨**
