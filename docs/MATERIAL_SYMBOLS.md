# Material Symbols Configuration

This project uses the newer Material Symbols font family with Rounded style as the default, replacing the older Material Icons.

## Default Configuration

All `mat-icon` components and `.material-icons` classes now automatically use Material Symbols Rounded with these default settings:

- **Font Family**: Material Symbols Rounded
- **Fill**: 0 (outlined)
- **Weight**: 400 (normal)
- **Grade**: 0 (normal)
- **Optical Size**: 24px

## Usage Examples

### Basic Usage (Default Rounded Style)
```html
<mat-icon>search</mat-icon>
<span class="material-icons">home</span>
```

### Using Different Styles

#### Filled Icons
```html
<mat-icon class="material-symbols-filled">favorite</mat-icon>
```

#### Different Font Variants
```html
<!-- Sharp variant -->
<mat-icon class="material-symbols-sharp">settings</mat-icon>

<!-- Outlined variant -->
<mat-icon class="material-symbols-outlined-font">notifications</mat-icon>
```

#### Different Weights
```html
<!-- Light weight -->
<mat-icon class="material-symbols-light">menu</mat-icon>

<!-- Bold weight -->
<mat-icon class="material-symbols-bold">star</mat-icon>
```

#### Different Sizes
```html
<!-- Small icons (18px) -->
<mat-icon class="material-symbols-small">close</mat-icon>

<!-- Large icons (36px) -->
<mat-icon class="material-symbols-large">add</mat-icon>

<!-- Extra large icons (48px) -->
<mat-icon class="material-symbols-xl">dashboard</mat-icon>
```

## Font Variation Settings

You can customize icons using CSS font-variation-settings:

```css
.custom-icon {
  font-variation-settings:
    'FILL' 1,     /* 0 = outlined, 1 = filled */
    'wght' 300,   /* 100-700 (weight) */
    'GRAD' 25,    /* -50 to 200 (grade/emphasis) */
    'opsz' 40;    /* 20-48 (optical size) */
}
```

## Available Font Families

1. **Material Symbols Rounded** (default)
2. **Material Symbols Outlined**
3. **Material Symbols Sharp**

## Migration from Material Icons

The configuration automatically maps old Material Icons to the new Material Symbols Rounded, so existing components will continue to work without changes.

## Icon Browser

Find icons at: https://fonts.google.com/icons

## Examples in Components

```typescript
// In Angular components, icons work the same way
@Component({
  template: `
    <mat-icon>search</mat-icon>
    <mat-icon class="material-symbols-filled">favorite</mat-icon>
    <mat-icon class="material-symbols-large">dashboard</mat-icon>
  `
})
```
