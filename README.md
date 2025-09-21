# @ojiepermana/angular

Modern Angular UI Library Template with Navigation System and Theme Support

## Overview

This project serves as both a **development template** and **showcase** for the `@ojiepermana/angular` UI library. It demonstrates a complete Angular application with professional navigation components, advanced theme system, and Material Design integration.

### 🎯 Project Purpose

- **UI Library Development**: Template for building and testing Angular UI components
- **Component Showcase**: Live demo of all library components and features
- **Development Reference**: Best practices for Angular library architecture
- **Production Template**: Ready-to-use foundation for Angular applications

## Library Features

### 📦 @ojiepermana/angular Library

The core library (`projects/kit/`) includes:

- **Navigation Components**: Complete vertical navigation system with service architecture
- **Theme System**: Advanced theming with CSS variables and dark/light mode support
- **Button Components**: Versatile button components with multiple variants
- **Material Integration**: Seamless integration with Angular Material components
- **TypeScript Support**: Full type safety with strict TypeScript configuration

### 🏗️ Architecture

```txt
projects/kit/src/lib/
├── components/          # UI Components (op-button, op-navigation, etc.)
├── services/           # Services (NavigationService, ThemeService)
├── pipes/             # Custom pipes
├── directives/        # Custom directives
├── utils/             # Utility functions
└── types/             # TypeScript type definitions
```

### 🎨 Design System

- **Component Prefix**: All components use `op-` selector prefix
- **Clean Exports**: Components export clean class names (Button, not OpButton)
- **Flat Architecture**: Simple, maintainable folder structure
- **Modern Angular**: Built with standalone components, signals, and Angular 20+
- **Theme Compatible**: Full CSS variables integration for theming

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.2.1.

## Development server

To start a local development server, run:

```bash
npm start
# or
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

### 🌐 Live Demo

The application is deployed and available at: [https://angular-kit.web.app](https://angular-kit.web.app)

### 📋 Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for development
- `npm run build:prod` - Build for production
- `npm run deploy` - Build and deploy to Firebase
- `npm run firebase:serve` - Build and serve locally with Firebase
- `npm run firebase:deploy` - Deploy to Firebase hosting only

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Library Usage

### Installation

```bash
npm install @ojiepermana/angular
```

### Import Patterns

The library supports flexible import patterns for optimal tree-shaking:

```typescript
// Main library import (recommended)
import { Button, NavigationService } from '@ojiepermana/angular';

// Category-level import
import { Button } from '@ojiepermana/angular/components';
import { NavigationService } from '@ojiepermana/angular/services';

// Specific component import
import { Button } from '@ojiepermana/angular/components/button';
```

### Component Examples

```typescript
// Navigation Service Usage
import { NavigationService } from '@ojiepermana/angular';

@Component({
  template: `
    <op-vertical-navigation navigationKey="main"></op-vertical-navigation>
  `
})
export class MyComponent implements OnInit {
  private navigationService = inject(NavigationService);
  
  ngOnInit() {
    this.navigationService.register('main', navigationData);
  }
}
```

```typescript
// Button Component Usage
import { Button } from '@ojiepermana/angular';

@Component({
  imports: [Button],
  template: `
    <op-button variant="primary" size="medium">
      Click me
    </op-button>
  `
})
export class MyComponent {}
```

## Building

### Application Build

To build the main application:

```bash
npm run build:prod
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

### Library Build

To build the @ojiepermana/angular library:

```bash
ng build kit
```

The library build artifacts will be stored in `dist/kit/` directory and can be published to npm.

### Deployment

Deploy to Firebase Hosting:

```bash
npm run deploy
```

This command will build the production application and deploy it to Firebase Hosting.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Technologies Used

- **Angular 20+**: Latest Angular features with standalone components
- **TypeScript**: Strict type checking and modern JavaScript features
- **TailwindCSS**: Utility-first CSS framework for styling
- **Angular Material**: Material Design components integration
- **Firebase Hosting**: Production deployment platform
- **RxJS**: Reactive programming with observables

## Project Structure

```txt
src/
├── app/
│   ├── layouts/           # Layout components and shared UI
│   ├── pages/            # Page components (website, demo)
│   ├── services/         # Application services
│   └── styles/           # Global styles and themes
├── projects/kit/         # @ojiepermana/angular library source
└── public/               # Static assets
```

## Additional Resources

### Links

- [Live Demo](https://angular-kit.web.app)
- [Angular CLI Documentation](https://angular.dev/tools/cli)
- [Angular Material](https://material.angular.io)
- [TailwindCSS](https://tailwindcss.com)

### Development Guidelines

- Use standalone components (no NgModules)
- Implement signals for state management
- Follow `op-` prefix for component selectors
- Export clean class names (Button, not OpButton)
- Use CSS variables for theming compatibility
- Maintain flat architecture in library structure

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
