import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Website Information Component
 *
 * This component displays comprehensive information about the @ojiepermana/angular library.
 * It serves as the main landing page content for the website.
 */
@Component({
  selector: 'website-info',
  imports: [],
  template: `
    <div class="space-y-24">
      <!-- Hero Section -->
      <section class="text-center py-16 bg-gradient-to-br from-muted/50 to-accent/10 rounded-2xl border border-color">
        <h1 class="text-5xl font-bold mb-4 bg-gradient-to-br from-primary to-purple-600 bg-clip-text text-transparent">@ojiepermana/angular</h1>
        <p class="text-2xl text-muted-foreground mb-6 font-medium">Modern Angular UI Library with NavigationService Architecture</p>
        <p class="text-lg text-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
          A comprehensive Angular library featuring vertical navigation components with service-based architecture,
          35+ Material Design components, advanced theme system, and professional deployment on Firebase.
        </p>
        <div class="flex gap-4 justify-center flex-wrap">
          <a href="/demo" class="px-8 py-3 rounded-lg no-underline font-semibold transition-all duration-200 bg-primary text-primary-foreground hover:-translate-y-0.5 hover:shadow-lg">View Live Demo</a>
          <a href="https://github.com/ojiepermana/angular" target="_blank" class="px-8 py-3 rounded-lg no-underline font-semibold transition-all duration-200 bg-secondary text-secondary-foreground border-2 border-color hover:bg-primary hover:text-primary-foreground hover:-translate-y-0.5">GitHub Repository</a>
        </div>
      </section>

      <!-- Latest Updates Section -->
      <section>
        <h2 class="text-center mb-8 text-4xl text-foreground">🚀 Latest Implementation</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="p-8 bg-card rounded-2xl shadow-md border border-color">
            <h3 class="mb-4 text-card-foreground text-xl font-semibold">🏗️ NavigationService Architecture</h3>
            <p class="m-0 text-muted-foreground leading-relaxed">
              Comprehensive service-based navigation system with registry pattern, storage management,
              and utility methods (getFlatNavigation, getItem, getItemParent).
            </p>
          </div>
          <div class="p-8 bg-card rounded-2xl shadow-md border border-color">
            <h3 class="mb-4 text-card-foreground text-xl font-semibold">📱 Vertical Navigation Components</h3>
            <p class="m-0 text-muted-foreground leading-relaxed">
              Complete navigation system with basic, collapsible, group, and divider items.
              Dual input support for direct data binding and service-based management.
            </p>
          </div>
          <div class="p-8 bg-card rounded-2xl shadow-md border border-color">
            <h3 class="mb-4 text-card-foreground text-xl font-semibold">🎨 Material Design Integration</h3>
            <p class="m-0 text-muted-foreground leading-relaxed">
              35+ official Angular Material components showcase with proper Material Icons,
              organized navigation structure, and consistent URL patterns.
            </p>
          </div>
          <div class="p-8 bg-card rounded-2xl shadow-md border border-color">
            <h3 class="mb-4 text-card-foreground text-xl font-semibold">☁️ Production Deployment</h3>
            <p class="m-0 text-muted-foreground leading-relaxed">
              Live deployment on Firebase Hosting with optimized production builds,
              Git workflow management, and detailed commit documentation.
            </p>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section>
        <h2 class="text-center mb-8 text-4xl text-foreground">💡 Core Features</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="p-8 bg-card rounded-2xl shadow-md transition-transform duration-200 hover:-translate-y-1 border border-color">
            <h3 class="mb-4 text-card-foreground text-xl font-semibold">🎯 op- Selectors, Clean Exports</h3>
            <p class="m-0 text-muted-foreground leading-relaxed">Components use 'op-' selectors (op-button) but export clean class names (Button) for better developer experience.</p>
          </div>
          <div class="p-8 bg-card rounded-2xl shadow-md transition-transform duration-200 hover:-translate-y-1 border border-color">
            <h3 class="mb-4 text-card-foreground text-xl font-semibold">⚡ Modern Angular</h3>
            <p class="m-0 text-muted-foreground leading-relaxed">Built with standalone components, signals, control flow, and Angular 20+ features for optimal performance.</p>
          </div>
          <div class="p-8 bg-card rounded-2xl shadow-md transition-transform duration-200 hover:-translate-y-1 border border-color">
            <h3 class="mb-4 text-card-foreground text-xl font-semibold">🏗️ Flat Architecture</h3>
            <p class="m-0 text-muted-foreground leading-relaxed">Simple, maintainable structure: components/, services/, pipes/, directives/, utils/, types/.</p>
          </div>
          <div class="p-8 bg-card rounded-2xl shadow-md transition-transform duration-200 hover:-translate-y-1 border border-color">
            <h3 class="mb-4 text-card-foreground text-xl font-semibold">🎨 Advanced Theme System</h3>
            <p class="m-0 text-muted-foreground leading-relaxed">shadcn/ui inspired themes with Material integration, CSS variables, and multiple color schemes.</p>
          </div>
          <div class="p-8 bg-card rounded-2xl shadow-md transition-transform duration-200 hover:-translate-y-1 border border-color">
            <h3 class="mb-4 text-card-foreground text-xl font-semibold">📦 Multi-Level Imports</h3>
            <p class="m-0 text-muted-foreground leading-relaxed">Flexible import patterns: main library, category-level, or specific component imports for optimal tree-shaking.</p>
          </div>
          <div class="p-8 bg-card rounded-2xl shadow-md transition-transform duration-200 hover:-translate-y-1 border border-color">
            <h3 class="mb-4 text-card-foreground text-xl font-semibold">♿ Accessibility</h3>
            <p class="m-0 text-muted-foreground leading-relaxed">Built with accessibility in mind, following WCAG guidelines and best practices.</p>
          </div>
        </div>
      </section>

      <!-- Components Preview -->
      <section>
        <h2 class="text-center mb-8 text-4xl text-foreground">📦 Implemented Components</h2>
        <div class="flex flex-col gap-4 max-w-4xl mx-auto">
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center items-start gap-2 p-4 bg-card rounded-lg shadow-sm border border-color">
            <code class="bg-muted px-2 py-1 rounded font-mono text-primary font-semibold">op-vertical-navigation</code>
            <span class="text-muted-foreground">Complete navigation system with service-based architecture</span>
          </div>
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center items-start gap-2 p-4 bg-card rounded-lg shadow-sm border border-color">
            <code class="bg-muted px-2 py-1 rounded font-mono text-primary font-semibold">NavigationService</code>
            <span class="text-muted-foreground">Registry pattern with storage management and utility methods</span>
          </div>
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center items-start gap-2 p-4 bg-card rounded-lg shadow-sm border border-color">
            <code class="bg-muted px-2 py-1 rounded font-mono text-primary font-semibold">op-button</code>
            <span class="text-muted-foreground">Versatile button component with multiple variants</span>
          </div>
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center items-start gap-2 p-4 bg-card rounded-lg shadow-sm border border-color">
            <code class="bg-muted px-2 py-1 rounded font-mono text-primary font-semibold">op-theme-selector</code>
            <span class="text-muted-foreground">Theme switching component with multiple color schemes</span>
          </div>
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center items-start gap-2 p-4 bg-card rounded-lg shadow-sm border border-color">
            <code class="bg-muted px-2 py-1 rounded font-mono text-primary font-semibold">35+ Material Components</code>
            <span class="text-muted-foreground">Complete Angular Material showcase in demo navigation</span>
          </div>
        </div>
      </section>

      <!-- Getting Started -->
      <section class="text-center">
        <h2 class="text-center mb-8 text-4xl text-foreground">Getting Started</h2>
        <div class="bg-muted text-muted-foreground p-4 rounded-lg mb-4 overflow-x-auto border border-color">
          <pre class="m-0 font-mono"><code>npm install @ojiepermana/angular</code></pre>
        </div>
        <p class="my-4 text-muted-foreground">Import components with flexible patterns:</p>

        <!-- Import Examples -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          <div class="text-left">
            <h4 class="text-lg font-semibold mb-2 text-foreground">Main Library Import (Recommended)</h4>
            <div class="bg-muted text-muted-foreground p-4 rounded-lg overflow-x-auto border border-color">
              <pre class="m-0 font-mono text-sm"><code>import {{ '{' }} Button, Card {{ '}' }} from '@ojiepermana/angular';</code></pre>
            </div>
          </div>

          <div class="text-left">
            <h4 class="text-lg font-semibold mb-2 text-foreground">Category-Level Import</h4>
            <div class="bg-muted text-muted-foreground p-4 rounded-lg overflow-x-auto border border-color">
              <pre class="m-0 font-mono text-sm"><code>import {{ '{' }} Button {{ '}' }} from '@ojiepermana/angular/components';</code></pre>
            </div>
          </div>

          <div class="text-left">
            <h4 class="text-lg font-semibold mb-2 text-foreground">Specific Component Import</h4>
            <div class="bg-muted text-muted-foreground p-4 rounded-lg overflow-x-auto border border-color">
              <pre class="m-0 font-mono text-sm"><code>import {{ '{' }} Button {{ '}' }} from '@ojiepermana/angular/components/button';</code></pre>
            </div>
          </div>

          <div class="text-left">
            <h4 class="text-lg font-semibold mb-2 text-foreground">Mixed Import Pattern</h4>
            <div class="bg-muted text-muted-foreground p-4 rounded-lg overflow-x-auto border border-color">
              <pre class="m-0 font-mono text-sm"><code>import {{ '{' }} Button, Card {{ '}' }} from '@ojiepermana/angular/components';
import {{ '{' }} ThemeService {{ '}' }} from '@ojiepermana/angular/services';</code></pre>
            </div>
          </div>
        </div>

        <!-- Development Info -->
        <div class="bg-card p-6 rounded-xl border border-color text-left max-w-4xl mx-auto">
          <h3 class="text-xl font-semibold mb-4 text-card-foreground">📚 Development Guidelines</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="font-semibold mb-2 text-foreground">Component Structure</h4>
              <ul class="text-sm text-muted-foreground space-y-1">
                <li>• Selector: <code class="bg-muted px-1 rounded">op-button</code></li>
                <li>• Class: <code class="bg-muted px-1 rounded">Button</code></li>
                <li>• File: <code class="bg-muted px-1 rounded">button.ts</code></li>
              </ul>
            </div>
            <div>
              <h4 class="font-semibold mb-2 text-foreground">Architecture</h4>
              <ul class="text-sm text-muted-foreground space-y-1">
                <li>• Standalone components only</li>
                <li>• Signals for state management</li>
                <li>• Control flow (&#64;if, &#64;for, &#64;switch)</li>
                <li>• TypeScript strict mode</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WebsiteComponent {}
