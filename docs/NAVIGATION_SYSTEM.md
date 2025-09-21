# Navigation System Documentation

## Overview

Angular Kit menggunakan sistem navigasi global yang memungkinkan akses data navigasi dari komponen manapun melalui `NavigationDataService`. Service ini di-provide secara global melalui `app.config.ts` dan dapat digunakan dengan mudah di seluruh aplikasi.

## Setup

### 1. App Configuration

Service sudah terkonfigurasi di `app.config.ts`:

```typescript
import { NavigationDataService } from './services';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... other providers
    NavigationDataService
  ]
};
```

### 2. Navigation Data Structure

Data navigasi disimpan dalam file `src/app/navigations.ts` dan secara otomatis dimuat oleh service.

## Usage Examples

### Basic Usage in Components

```typescript
import { Component, inject } from '@angular/core';
import { NavigationDataService } from '../services/navigation-data.service';

@Component({
  selector: 'my-component',
  template: `
    <!-- Menggunakan data navigasi langsung -->
    <op-vertical-navigation 
      [navigation]="navigationService.navigationData()"
    />
  `
})
export class MyComponent {
  navigationService = inject(NavigationDataService);
}
```

### Advanced Service Methods

```typescript
export class ExampleComponent {
  navigationService = inject(NavigationDataService);

  ngOnInit() {
    // Get specific navigation item
    const materialComponents = this.navigationService.getNavigationItem('material-components');
    
    // Get all basic items
    const basicItems = this.navigationService.getItemsByType('basic');
    
    // Get breadcrumb path to an item
    const breadcrumb = this.navigationService.getBreadcrumbPath('button');
    
    // Update navigation data (if needed)
    this.navigationService.updateNavigationData(newNavigationData);
  }
}
```

## Service API Reference

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `navigationData` | `Signal<NavigationItem[]>` | Readonly signal berisi data navigasi |

### Methods

| Method | Parameters | Return Type | Description |
|--------|------------|-------------|-------------|
| `getNavigationItem(id)` | `id: string` | `NavigationItem \| null` | Mencari item berdasarkan ID |
| `getItemsByType(type)` | `type: NavigationItem['type']` | `NavigationItem[]` | Filter item berdasarkan type |
| `getBreadcrumbPath(id)` | `id: string` | `NavigationItem[]` | Mendapatkan path hierarkis ke item |
| `updateNavigationData(data)` | `data: NavigationItem[]` | `void` | Update data navigasi |

## Navigation Components Integration

### Horizontal Navigation

```typescript
<op-horizontal-navigation
  name="main-horizontal"
  [navigation]="navigationService.navigationData()"
/>
```

### Vertical Navigation

```typescript
<op-vertical-navigation
  name="main-vertical"
  [navigation]="navigationService.navigationData()"
/>
```

## Benefits

1. **Centralized Data Management**: Semua data navigasi tersimpan di satu tempat
2. **Global Access**: Dapat diakses dari komponen manapun tanpa prop drilling
3. **Reactive**: Menggunakan signals untuk automatic updates
4. **Type Safe**: Full TypeScript support dengan proper typing
5. **Flexible**: Mendukung berbagai use cases dengan methods yang lengkap

## Best Practices

1. **Use Service Methods**: Gunakan methods yang disediakan service daripada mengakses data langsung
2. **Signal Pattern**: Gunakan `navigationData()` dengan parentheses untuk mengakses signal value
3. **Error Handling**: Selalu check null return values dari `getNavigationItem()`
4. **Performance**: Service sudah optimal dengan signal-based reactivity

## Migration from Direct Data

Jika sebelumnya menggunakan direct import:

```typescript
// BEFORE
import { demoNavigationData } from './navigations';
[navigation]="demoNavigationData"

// AFTER
navigationService = inject(NavigationDataService);
[navigation]="navigationService.navigationData()"
```

## Examples in Project

- **Demo Page**: `src/app/pages/demo/demo.ts` - Menunjukkan penggunaan basic
- **Example Component**: `src/app/components/navigation-example.component.ts` - Advanced usage dengan semua features