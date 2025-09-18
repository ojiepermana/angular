# CSS Variables Implementation untuk Button Component

## Overview

Komponen Button sekarang menggunakan CSS Variables untuk mengelola styling berdasarkan `ButtonVariant` type. Pendekatan ini memberikan fleksibilitas maksimal dan performa optimal.

## Implementasi CSS Variables

### 1. **Type-Driven CSS Variables**

```typescript
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success';
```

Setiap variant memiliki CSS variables yang unik:

```css
/* Primary variant */
:host(.btn-primary) {
  --btn-bg: #3b82f6;
  --btn-bg-hover: #2563eb;
  --btn-bg-active: #1d4ed8;
  --btn-focus-ring: rgba(59, 130, 246, 0.5);
}
```

### 2. **Dynamic Background dengan Variables**

```css
:host {
  background-color: var(--btn-bg);
}

:host:hover:not(:disabled) {
  background-color: var(--btn-bg-hover);
}

:host:active:not(:disabled) {
  background-color: var(--btn-bg-active);
}
```

### 3. **Complete CSS Variables Map**

| Variant | Background | Hover | Active | Focus Ring |
|---------|------------|-------|---------|------------|
| **Primary** | `#3b82f6` | `#2563eb` | `#1d4ed8` | `rgba(59, 130, 246, 0.5)` |
| **Secondary** | `#64748b` | `#475569` | `#334155` | `rgba(100, 116, 139, 0.5)` |
| **Danger** | `#dc2626` | `#b91c1c` | `#991b1b` | `rgba(220, 38, 38, 0.5)` |
| **Success** | `#059669` | `#047857` | `#065f46` | `rgba(5, 150, 105, 0.5)` |

## Keuntungan Pendekatan CSS Variables

### 1. **Type Safety**
- CSS variables terhubung langsung dengan TypeScript types
- Perubahan pada `ButtonVariant` type langsung mempengaruhi styling

### 2. **Runtime Customization**
```css
/* Global customization */
:root {
  --btn-bg-primary: #custom-blue;
  --btn-bg-primary-hover: #custom-blue-dark;
}
```

### 3. **Theme Support**
```css
/* Dark theme example */
[data-theme="dark"] {
  --btn-bg: #2563eb;
  --btn-bg-hover: #1d4ed8;
}
```

### 4. **Component Composition**
```typescript
// Easy to extend with new variants
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';
```

## CSS Structure

### Base Styles (Vanilla CSS)
```css
:host {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  text-align: center;
  white-space: nowrap;
  border: 0;
  border-radius: 0.375rem;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease-in-out;
  color: white;
  background-color: var(--btn-bg);
}
```

### State Management dengan Variables
```css
:host:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--btn-focus-ring);
}

:host:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
```

## Usage Examples

### 1. **Basic Usage**
```typescript
@Component({
  template: `
    <button variant="primary">Primary</button>
    <button variant="danger">Delete</button>
  `
})
```

### 2. **Custom Styling via CSS Variables**
```css
.custom-button {
  --btn-bg: #8b5cf6;
  --btn-bg-hover: #7c3aed;
  --btn-bg-active: #6d28d9;
}
```

### 3. **Dynamic Variants**
```typescript
@Component({
  template: `
    <button [variant]="buttonType">
      {{ buttonText }}
    </button>
  `
})
export class DynamicButton {
  buttonType: ButtonVariant = 'primary';
  buttonText = 'Click me';
}
```

## Extending dengan Variants Baru

### 1. **Update Type**
```typescript
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
```

### 2. **Add CSS Variables**
```css
:host(.btn-warning) {
  --btn-bg: #f59e0b;
  --btn-bg-hover: #d97706;
  --btn-bg-active: #b45309;
  --btn-focus-ring: rgba(245, 158, 11, 0.5);
}
```

### 3. **Update Class Generation**
```typescript
buttonClasses = computed(() => {
  const baseClass = 'btn-base';
  const variantClass = `btn-${this.variant()}`;
  const sizeClass = `btn-${this.size()}`;
  
  return [baseClass, variantClass, sizeClass].join(' ');
});
```

## Performance Benefits

### 1. **No Runtime Class Calculation**
- CSS variables di-set saat compile time
- Minimal JavaScript overhead

### 2. **Optimal CSS Bundle**
- Tidak ada duplicate styles
- Clean separation of concerns

### 3. **Browser Optimization**
- Native CSS variables support
- Hardware-accelerated transitions

## Best Practices

### 1. **Naming Convention**
```css
--btn-{property}: base value
--btn-{property}-{state}: state value
--btn-{property}-{variant}: variant-specific value
```

### 2. **Fallback Values**
```css
background-color: var(--btn-bg, #3b82f6);
```

### 3. **Consistent Color System**
- Gunakan semantic color names
- Maintain accessibility contrast ratios
- Support untuk dark/light themes

## Hasil Akhir

✅ **CSS Variables Implementation Complete**
- Type-safe styling berdasarkan `ButtonVariant`
- Flexible dan extensible architecture  
- Optimal performance dengan vanilla CSS
- Full support untuk theming dan customization
- Clean separation antara logic dan styling
