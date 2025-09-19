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
    <div class="w-full">
      <!-- Hero Section -->
      <section class="text-center py-16 bg-gradient-to-br from-[rgb(var(--muted))] to-blue-100 rounded-2xl mb-16 border border-[rgb(var(--border))]">
        <h1 class="text-5xl font-bold mb-4 bg-gradient-to-br from-[rgb(var(--primary))] to-purple-600 bg-clip-text text-transparent">@ojiepermana/angular</h1>
        <p class="text-2xl text-[rgb(var(--muted-foreground))] mb-6 font-medium">Modern Angular UI Library with op- Prefix Components</p>
        <p class="text-lg text-[rgb(var(--foreground))] max-w-2xl mx-auto mb-8 leading-relaxed">
          A comprehensive collection of reusable Angular components designed for scalable web applications.
          Built with TypeScript, signals, and following Angular best practices.
        </p>
        <div class="flex gap-4 justify-center flex-wrap">
          <a href="/demo" class="px-8 py-3 rounded-lg no-underline font-semibold transition-all duration-200 bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))] hover:-translate-y-0.5 hover:shadow-lg">View Demo</a>
          <a href="https://github.com/ojiepermana/angular" target="_blank" class="px-8 py-3 rounded-lg no-underline font-semibold transition-all duration-200 bg-[rgb(var(--secondary))] text-[rgb(var(--secondary-foreground))] border-2 border-[rgb(var(--border))] hover:bg-[rgb(var(--primary))] hover:text-[rgb(var(--primary-foreground))] hover:-translate-y-0.5">GitHub</a>
        </div>
      </section>

      <!-- Features Section -->
      <section class="mb-16">
        <h2 class="text-center mb-8 text-4xl text-[rgb(var(--foreground))]">Key Features</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="p-8 bg-[rgb(var(--card))] rounded-2xl shadow-md transition-transform duration-200 hover:-translate-y-1 border border-[rgb(var(--border))]">
            <h3 class="mb-4 text-[rgb(var(--card-foreground))] text-xl font-semibold">🎯 op- Prefix Components</h3>
            <p class="m-0 text-[rgb(var(--muted-foreground))] leading-relaxed">All components use the 'op-' prefix for clear identification and avoiding naming conflicts.</p>
          </div>
          <div class="p-8 bg-[rgb(var(--card))] rounded-2xl shadow-md transition-transform duration-200 hover:-translate-y-1 border border-[rgb(var(--border))]">
            <h3 class="mb-4 text-[rgb(var(--card-foreground))] text-xl font-semibold">⚡ Modern Angular</h3>
            <p class="m-0 text-[rgb(var(--muted-foreground))] leading-relaxed">Built with standalone components, signals, and latest Angular features for optimal performance.</p>
          </div>
          <div class="p-8 bg-[rgb(var(--card))] rounded-2xl shadow-md transition-transform duration-200 hover:-translate-y-1 border border-[rgb(var(--border))]">
            <h3 class="mb-4 text-[rgb(var(--card-foreground))] text-xl font-semibold">🏗️ Flat Architecture</h3>
            <p class="m-0 text-[rgb(var(--muted-foreground))] leading-relaxed">Simple, maintainable project structure with clear separation of concerns.</p>
          </div>
          <div class="p-8 bg-[rgb(var(--card))] rounded-2xl shadow-md transition-transform duration-200 hover:-translate-y-1 border border-[rgb(var(--border))]">
            <h3 class="mb-4 text-[rgb(var(--card-foreground))] text-xl font-semibold">🎨 Theme System</h3>
            <p class="m-0 text-[rgb(var(--muted-foreground))] leading-relaxed">Comprehensive theming system with CSS variables and multiple color schemes.</p>
          </div>
          <div class="p-8 bg-[rgb(var(--card))] rounded-2xl shadow-md transition-transform duration-200 hover:-translate-y-1 border border-[rgb(var(--border))]">
            <h3 class="mb-4 text-[rgb(var(--card-foreground))] text-xl font-semibold">📱 Responsive Design</h3>
            <p class="m-0 text-[rgb(var(--muted-foreground))] leading-relaxed">Mobile-first approach with responsive components that work on all devices.</p>
          </div>
          <div class="p-8 bg-[rgb(var(--card))] rounded-2xl shadow-md transition-transform duration-200 hover:-translate-y-1 border border-[rgb(var(--border))]">
            <h3 class="mb-4 text-[rgb(var(--card-foreground))] text-xl font-semibold">♿ Accessibility</h3>
            <p class="m-0 text-[rgb(var(--muted-foreground))] leading-relaxed">Built with accessibility in mind, following WCAG guidelines and best practices.</p>
          </div>
        </div>
      </section>

      <!-- Components Preview -->
      <section class="mb-16">
        <h2 class="text-center mb-8 text-4xl text-[rgb(var(--foreground))]">Available Components</h2>
        <div class="flex flex-col gap-4 max-w-2xl mx-auto">
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center items-start gap-2 p-4 bg-[rgb(var(--card))] rounded-lg shadow-sm border border-[rgb(var(--border))]">
            <code class="bg-[rgb(var(--muted))] px-2 py-1 rounded font-mono text-[rgb(var(--primary))] font-semibold">op-button</code>
            <span class="text-[rgb(var(--muted-foreground))]">Versatile button component with multiple variants</span>
          </div>
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center items-start gap-2 p-4 bg-[rgb(var(--card))] rounded-lg shadow-sm border border-[rgb(var(--border))]">
            <code class="bg-[rgb(var(--muted))] px-2 py-1 rounded font-mono text-[rgb(var(--primary))] font-semibold">op-card</code>
            <span class="text-[rgb(var(--muted-foreground))]">Flexible card component for content organization</span>
          </div>
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center items-start gap-2 p-4 bg-[rgb(var(--card))] rounded-lg shadow-sm border border-[rgb(var(--border))]">
            <code class="bg-[rgb(var(--muted))] px-2 py-1 rounded font-mono text-[rgb(var(--primary))] font-semibold">op-theme-selector</code>
            <span class="text-[rgb(var(--muted-foreground))]">Theme switching component with multiple color schemes</span>
          </div>
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center items-start gap-2 p-4 bg-[rgb(var(--card))] rounded-lg shadow-sm border border-[rgb(var(--border))]">
            <span class="text-[rgb(var(--muted-foreground))] italic">More components coming soon...</span>
          </div>
        </div>
      </section>

      <!-- Getting Started -->
      <section class="text-center">
        <h2 class="text-center mb-8 text-4xl text-[rgb(var(--foreground))]">Getting Started</h2>
        <div class="bg-[rgb(var(--muted))] text-[rgb(var(--muted-foreground))] p-4 rounded-lg mb-4 overflow-x-auto border border-[rgb(var(--border))]">
          <pre class="m-0 font-mono"><code>npm install @ojiepermana/angular</code></pre>
        </div>
        <p class="my-4 text-[rgb(var(--muted-foreground))]">Import components in your Angular application:</p>
        <div class="bg-[rgb(var(--muted))] text-[rgb(var(--muted-foreground))] p-4 rounded-lg overflow-x-auto border border-[rgb(var(--border))]">
          <pre class="m-0 font-mono"><code>import {{ '{' }} OpButton, OpCard {{ '}' }} from '@ojiepermana/angular';</code></pre>
        </div>
      </section>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WebsiteComponent {}
