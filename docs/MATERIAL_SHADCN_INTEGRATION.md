# Angular Material + shadcn/ui Integration Guide

## 📋 Analisis dan Strategi Implementasi

### Situasi Awal
- **shadcn/ui theme system**: Menggunakan CSS variables dengan semantic naming (`--primary`, `--background`, dll)
- **Angular Material**: Menggunakan Material 3 design tokens (`--mat-sys-*`)
- **Konflik potensial**: Body styling dan typography overrides

### Solusi Terintegrasi

## 🔧 Implementasi

### 1. **Bridge File: `material-shadcn-bridge.scss`**
File ini bertindak sebagai jembatan antara kedua sistem theme:

#### **Key Features:**
- **Variable Mapping**: Maps shadcn/ui variables ke Material variables
- **Dynamic Theme Support**: Otomatis adapt ketika theme berubah
- **Component Overrides**: Ensures Material components respect shadcn theme
- **Dark Mode Integration**: Seamless dark/light mode switching

#### **Core Mapping:**
```scss
:root {
  // Bridge shadcn variables to Material
  --mat-sys-primary: rgb(var(--primary));
  --mat-sys-on-primary: rgb(var(--primary-foreground));
  --mat-sys-surface: rgb(var(--background));
  --mat-sys-on-surface: rgb(var(--foreground));
}
```

### 2. **Enhanced Theme Service**
Service yang mengelola kedua sistem theme secara bersamaan:

#### **Features:**
- ✅ **Reactive signals** untuk theme state
- ✅ **Local storage persistence**
- ✅ **System color mode detection**
- ✅ **Dynamic theme switching**
- ✅ **Material integration**

#### **Usage:**
```typescript
// Inject service
themeService = inject(EnhancedThemeService);

// Change theme
themeService.setTheme('blue');

// Toggle color mode
themeService.toggleColorMode();

// React to changes
effect(() => {
  console.log('Current theme:', themeService.currentTheme());
});
```

### 3. **Enhanced Theme Selector Component**
UI component untuk theme switching dengan preview:

#### **Features:**
- ✅ **Visual theme previews**
- ✅ **Color mode toggle**
- ✅ **Real-time updates**
- ✅ **Responsive design**

## 🎯 Kaidah Override Material Components

### **Priority System:**
1. **CSS Custom Properties** (Highest priority)
2. **Component-specific overrides**
3. **Global theme variables**
4. **Material defaults** (Lowest priority)

### **Override Patterns:**

#### **Buttons:**
```scss
.mat-mdc-button {
  &.mat-primary {
    --mdc-filled-button-container-color: rgb(var(--primary));
    --mdc-filled-button-label-text-color: rgb(var(--primary-foreground));
  }
}
```

#### **Cards:**
```scss
.mat-mdc-card {
  --mdc-elevated-card-container-color: rgb(var(--card));
  --mdc-elevated-card-container-surface-tint-layer-color: rgb(var(--card-foreground));
}
```

#### **Form Fields:**
```scss
.mat-mdc-form-field {
  --mdc-outlined-text-field-outline-color: rgb(var(--border));
  --mdc-filled-text-field-container-color: rgb(var(--input));
}
```

## 🔄 Dynamic Theme Flow

### **Theme Change Process:**
1. User selects theme via `EnhancedThemeSelectorComponent`
2. `EnhancedThemeService.setTheme()` called
3. DOM `data-theme` attribute updated
4. CSS variables automatically cascade
5. Material components pick up new values
6. Custom event dispatched for additional components

### **Color Mode Process:**
1. User toggles color mode
2. `EnhancedThemeService.setColorMode()` called
3. `.dark` class added/removed from `<html>`
4. CSS variables switch to dark variants
5. Material `color-scheme` updated

## 🚀 Integration Steps

### **1. Import Bridge:**
```css
/* styles.css */
@import "tailwindcss";
@import "./app/styles/themes.css";
@import "./material-shadcn-bridge.scss";
```

### **2. Use Enhanced Service:**
```typescript
// In your component
export class MyComponent {
  themeService = inject(EnhancedThemeService);
  
  ngOnInit() {
    // Service automatically initializes and applies saved theme
  }
}
```

### **3. Add Theme Selector:**
```html
<!-- In your layout -->
<enhanced-theme-selector />
```

## 🎨 Available Themes

### **Color Themes:**
- `default` - Neutral gray
- `red` - Red primary
- `rose` - Rose pink
- `orange` - Orange
- `green` - Green
- `blue` - Blue (custom slate background)
- `yellow` - Yellow/amber
- `violet` - Purple/violet
- `zinc` - Cool gray
- `slate` - Blue-gray
- `stone` - Warm gray

### **Color Modes:**
- `light` - Light mode
- `dark` - Dark mode  
- `system` - Follow system preference

## ⚡ Performance Benefits

### **Optimizations:**
- ✅ **CSS Variables**: Runtime theme switching without rebuilds
- ✅ **Single Source of Truth**: One theme system for both libraries
- ✅ **Minimal JavaScript**: Theme logic handled by CSS
- ✅ **Tree Shaking**: Unused theme variants can be removed
- ✅ **Lazy Loading**: Theme service only loads when needed

## 🔍 Debugging

### **Theme Inspection:**
```typescript
// Check current theme state
console.log({
  theme: themeService.currentTheme(),
  colorMode: themeService.colorMode(),
  isDark: themeService.isDark()
});

// Listen for theme changes
window.addEventListener('themeChanged', (event) => {
  console.log('Theme changed:', event.detail);
});
```

### **CSS Variable Inspection:**
```javascript
// Check computed CSS variables
const root = document.documentElement;
const style = getComputedStyle(root);
console.log('Primary color:', style.getPropertyValue('--primary'));
console.log('Material primary:', style.getPropertyValue('--mat-sys-primary'));
```

## 🛡️ Conflict Resolution

### **Resolved Conflicts:**

#### **Body Styling:**
- ❌ **Before**: Material overwrote body background
- ✅ **After**: Bridge ensures shadcn variables take precedence

#### **Typography:**
- ❌ **Before**: Material font variables conflicted
- ✅ **After**: Consistent Roboto family with proper fallbacks

#### **Color Variables:**
- ❌ **Before**: Separate variable systems
- ✅ **After**: Unified system with automatic mapping

### **Best Practices:**
1. **Always use the Enhanced Theme Service** for theme changes
2. **Test components in all themes and color modes**
3. **Use CSS custom properties for component styling**
4. **Avoid hardcoded colors in component styles**
5. **Follow the override hierarchy for Material components**

## 📦 File Structure

```
src/
├── styles.css                          # Main styles import
├── material-shadcn-bridge.scss         # Bridge implementation
├── app/
│   ├── styles/
│   │   └── themes.css                  # shadcn/ui themes
│   ├── services/
│   │   └── enhanced-theme.service.ts   # Theme management
│   └── components/
│       └── enhanced-theme-selector.ts  # Theme UI
└── custom-theme.scss                   # Original Material theme
```

Implementasi ini memastikan kedua sistem theme bekerja harmonis tanpa konflik sambil mempertahankan fleksibilitas dan performa optimal.
