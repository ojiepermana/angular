# CSS Variables Structure - @ojiepermana/kit

Dokumentasi struktur CSS Variables untuk library @ojiepermana/kit.

## 📁 File Structure

```
src/
├── styles.css          # Main stylesheet dengan imports
├── variable.css        # CSS Variables untuk semua komponen
└── app/
    └── example.component.ts
```

## 🎯 Struktur Baru (Opsi 2 + Organized)

### 1. **styles.css** - Main Stylesheet
```css
@import "tailwindcss";
@import "./variable.css";

/* Global application styles di sini */
```

### 2. **variable.css** - CSS Variables Hub
```css
/* ===== CSS VARIABLES FOR @OJIEPERMANA/KIT LIBRARY ===== */

:root {
  /* Button Component Variables */
  --btn-primary-bg: #3b82f6;
  --btn-primary-hover: #2563eb;
  /* ... semua button variables */
}

/* Theme Variants */
[data-theme="dark"] { /* ... */ }
.brand-theme { /* ... */ }

/* Future Component Variables */
/* Card, Input, Modal, etc. */
```

### 3. **button.ts** - Pure CSS Variables (No Fallback)
```css
:host(.btn-primary) {
  --btn-bg: var(--btn-primary-bg);  /* Tanpa fallback */
  --btn-bg-hover: var(--btn-primary-hover);
}
```

## ✅ Keuntungan Struktur Baru

### 🎨 **Organized & Scalable**
- **Separation of Concerns**: Variables terpisah dari global styles
- **Single Source of Truth**: Semua variables di satu file
- **Easy Maintenance**: Update theme cukup di variable.css
- **Future-Ready**: Siap untuk komponen library lainnya

### 📦 **Clean Dependencies**
- **Clear Import Chain**: styles.css → variable.css → components
- **Modular**: Variable.css bisa di-import terpisah jika diperlukan
- **No Redundancy**: Tidak ada duplikasi CSS variables

### 🚀 **Developer Experience**
- **Predictable**: Developer tahu persis di mana mencari variables
- **Autocomplete Friendly**: CSS variables terpusat untuk IDE autocomplete
- **Theme Management**: Mudah switch dan manage multiple themes

## 🔧 Setup untuk Aplikasi Baru

### 1. **Install Library**
```bash
npm install @ojiepermana/kit
```

### 2. **Setup CSS Structure** 
```css
/* Di styles.css aplikasi */
@import "tailwindcss";
@import "./variable.css";  /* WAJIB! */

/* Global styles aplikasi di sini */
body {
  font-family: 'Inter', sans-serif;
}
```

### 3. **Buat variable.css**
```css
/* Copy dari @ojiepermana/kit/variable.css atau customize */
:root {
  /* Required Button Variables */
  --btn-primary-bg: #your-brand-color;
  --btn-primary-hover: #your-hover-color;
  /* ... semua required variables */
}
```

### 4. **Gunakan Components**
```typescript
import { Button } from '@ojiepermana/kit/ui/component/button';

@Component({
  imports: [Button],
  template: `<button variant="primary">Click me</button>`
})
```

## 🎨 Custom Theme Examples

### **Brand Theme Override**
```css
/* Di variable.css */
:root {
  /* Override default blue dengan brand colors */
  --btn-primary-bg: #ec4899;    /* Pink brand */
  --btn-primary-hover: #db2777;
  --btn-primary-active: #be185d;
  
  /* Keep other variants default atau customize juga */
  --btn-success-bg: #10b981;    /* Keep green */
  --btn-danger-bg: #f59e0b;     /* Change red to orange */
}
```

### **Multi-Theme Support**
```css
/* Base theme */
:root {
  --btn-primary-bg: #3b82f6;
}

/* Dark theme */
[data-theme="dark"] {
  --btn-primary-bg: #6366f1;
  --btn-secondary-bg: #4b5563;
}

/* Business theme */
[data-theme="business"] {
  --btn-primary-bg: #1f2937;
  --btn-secondary-bg: #374151;
}

/* Colorful theme */
[data-theme="colorful"] {
  --btn-primary-bg: #8b5cf6;
  --btn-secondary-bg: #ec4899;
  --btn-success-bg: #10b981;
  --btn-danger-bg: #f59e0b;
}
```

### **Dynamic Theme Switching**
```typescript
@Component({
  template: `
    <div [attr.data-theme]="currentTheme">
      <button variant="primary">Themed Button</button>
      
      <select (change)="switchTheme($event)">
        <option value="">Default</option>
        <option value="dark">Dark</option>
        <option value="business">Business</option>
        <option value="colorful">Colorful</option>
      </select>
    </div>
  `
})
export class ThemeDemo {
  currentTheme = '';
  
  switchTheme(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.currentTheme = target.value;
  }
}
```

## 📋 Required Variables Checklist

Untuk Button Component, aplikasi **WAJIB** mendefinisikan:

### ✅ Primary Button
- `--btn-primary-bg`
- `--btn-primary-hover` 
- `--btn-primary-active`
- `--btn-primary-focus`

### ✅ Secondary Button
- `--btn-secondary-bg`
- `--btn-secondary-hover`
- `--btn-secondary-active` 
- `--btn-secondary-focus`

### ✅ Success Button
- `--btn-success-bg`
- `--btn-success-hover`
- `--btn-success-active`
- `--btn-success-focus`

### ✅ Danger Button
- `--btn-danger-bg`
- `--btn-danger-hover`
- `--btn-danger-active`
- `--btn-danger-focus`

## 🚀 Future Extensions

Structure ini siap untuk komponen library lainnya:

```css
/* Di variable.css - Future additions */

/* Card Component */
:root {
  --card-bg: #ffffff;
  --card-border: #e5e7eb;
  --card-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  --card-radius: 0.5rem;
}

/* Input Component */
:root {
  --input-bg: #ffffff;
  --input-border: #d1d5db;
  --input-border-focus: #3b82f6;
  --input-text: #111827;
  --input-placeholder: #9ca3af;
}

/* Modal Component */
:root {
  --modal-overlay: rgba(0, 0, 0, 0.5);
  --modal-bg: #ffffff;
  --modal-border-radius: 0.5rem;
  --modal-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}
```

## 📊 Migration Path

Jika ada aplikasi existing yang menggunakan Opsi 1:

### Step 1: Buat variable.css
```css
/* Copy semua variables dari styles.css ke variable.css */
```

### Step 2: Update styles.css  
```css
/* Replace variables dengan import */
@import "./variable.css";
```

### Step 3: Update button.ts (jika perlu)
```css
/* Remove fallback values jika menggunakan Opsi 2 */
--btn-bg: var(--btn-primary-bg); /* Tanpa fallback */
```

Struktur baru ini memberikan foundation yang solid dan scalable untuk semua komponen @ojiepermana/kit library! 🎉
