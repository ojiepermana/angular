# Layout Service Documentation

The Layout Service provides a comprehensive solution for managing different layout types in your Angular application using signals for reactive state management.

## Features

### ✅ Available Layout Types
- **Empty**: Minimal layout with no chrome, perfect for auth pages
- **Default**: Dashboard-style layout with sidebar navigation  
- **Modern**: Contemporary layout with header, footer, and gradient backgrounds

### ✅ Reactive State Management
- Built with Angular signals for optimal performance
- Computed properties for layout state
- Type-safe layout configurations

### ✅ Dynamic Layout Switching
- Switch layouts programmatically
- Route-based layout assignment
- Configuration per layout type

## Usage

### Basic Setup

The service is automatically registered in `app.config.ts`:

```typescript
import { LayoutService } from './services/layout.service';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... other providers
    LayoutService
  ]
};
```

### Using the Layout Service

```typescript
import { Component, inject } from '@angular/core';
import { LayoutService } from './services/layout.service';

@Component({
  template: `
    <div>
      Current Layout: {{ layoutService.currentLayout() }}
      <button (click)="switchToModern()">Switch to Modern</button>
    </div>
  `
})
export class MyComponent {
  readonly layoutService = inject(LayoutService);

  switchToModern() {
    this.layoutService.setLayout('modern');
  }
}
```

### Layout Configuration

Each layout type has its own configuration:

```typescript
// Get configuration for a specific layout
const modernConfig = layoutService.getLayoutConfig('modern');

// Update current layout configuration
layoutService.updateLayoutConfig({
  title: 'My Custom Title',
  showHeader: false
});
```

### Route-Based Layout Assignment

```typescript
// Automatically set layout based on route
layoutService.setLayoutForRoute('/auth'); // Sets 'empty' layout
layoutService.setLayoutForRoute('/dashboard'); // Sets 'default' layout
```

## Layout Components

### Empty Layout
- Minimal template with only `<router-outlet/>`
- Perfect for authentication pages
- No header, sidebar, or footer

### Default Layout  
- Dashboard-style with sidebar navigation
- Header with title and theme info
- Left sidebar with navigation links
- Footer with copyright information

### Modern Layout
- Contemporary design with gradients
- Sticky header with backdrop blur
- Clean typography and spacing
- Modern footer with branding

## Available Properties

### Reactive State
```typescript
// Layout type signals
layoutService.currentLayout()     // Current layout type
layoutService.layoutConfig()      // Current configuration

// Layout type checks  
layoutService.isEmptyLayout()     // true if empty layout
layoutService.isDefaultLayout()   // true if default layout
layoutService.isModernLayout()    // true if modern layout

// Layout feature flags
layoutService.showHeader()        // Should show header
layoutService.showSidebar()       // Should show sidebar  
layoutService.showFooter()        // Should show footer
```

### Utility Methods
```typescript
// Get all available layouts
const layouts = layoutService.getAvailableLayouts(); // ['empty', 'default', 'modern']

// Get current layout selector for dynamic components
const selector = layoutService.getCurrentLayoutSelector(); // 'layout-default'

// Reset to default layout
layoutService.resetToDefault();
```

## Demo

Visit `/demo/layout` to see the layout service in action with:
- Current layout display
- Layout switching buttons  
- Configuration preview
- Real-time layout properties

## Integration with Routing

The main layout component (`app-layout`) uses Angular's control flow to dynamically render the appropriate layout:

```typescript
@switch (layoutService.currentLayout()) {
  @case ('empty') {
    <layout-empty />
  }
  @case ('default') {
    <layout-default />
  }
  @case ('modern') {
    <layout-modern />
  }
}
```

This provides seamless layout switching without page reloads while maintaining router state.
