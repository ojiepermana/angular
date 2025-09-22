# Material Symbols Configuration

This project uses the newer Material Symbols font family with Rounded style as the default, replacing the older Material Icons.

## Default Configuration

All `mat-icon` components and `.material-icons` classes now automatically use Material Symbols Rounded with these default settings:

- **Font Family**: Material Symbols Rounded
- **Fill**: 0 (outlined)
- **Weight**: 400 (normal)
- **Grade**: 0 (normal)
- **Optical Size**: 24px

## Why Only One Font Family?

We use only Material Symbols Rounded for several reasons:
- **Performance**: Loading only one font family reduces bundle size and loading time
- **Consistency**: Single font family ensures consistent design language
- **Flexibility**: All icon variations (filled, outlined, different weights) can be achieved using font-variation-settings
- **Simplicity**: Easier to maintain and fewer CSS rules

## Font Variation Settings

Material Symbols Rounded supports all variations through CSS font-variation-settings:

- **FILL**: 0 (outlined) to 1 (filled)
- **wght**: 100-700 (weight/thickness)  
- **GRAD**: -50 to 200 (grade/emphasis)
- **opsz**: 20-48 (optical size)

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

#### Different Variations
```html
<!-- Simulate "Sharp" look with different GRAD settings -->
<mat-icon style="font-variation-settings: 'FILL' 0, 'wght' 500, 'GRAD' -25, 'opsz' 24;">settings</mat-icon>

<!-- Simulate "Outlined" look (default) -->
<mat-icon>notifications</mat-icon>
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

## Available Styles

Since we use Material Symbols Rounded with font-variation-settings, you can achieve different looks:

1. **Outlined** (default): FILL = 0
2. **Filled**: FILL = 1  
3. **Different weights**: wght = 100-700
4. **Different grades**: GRAD = -50 to 200
5. **Different sizes**: opsz = 20-48

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
