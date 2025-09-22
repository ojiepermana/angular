import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-material-symbols-demo',
  template: `
    <div class="p-6 space-y-8">
      <h1 class="text-2xl font-bold mb-6">Material Symbols Demo</h1>
      
      <!-- Default Rounded Style -->
      <section class="space-y-4">
        <h2 class="text-xl font-semibold">Default Style (Rounded)</h2>
        <div class="flex items-center space-x-4">
          <mat-icon>search</mat-icon>
          <mat-icon>home</mat-icon>
          <mat-icon>favorite</mat-icon>
          <mat-icon>settings</mat-icon>
          <mat-icon>account_circle</mat-icon>
        </div>
      </section>

      <!-- Filled Style -->
      <section class="space-y-4">
        <h2 class="text-xl font-semibold">Filled Style</h2>
        <div class="flex items-center space-x-4">
          <mat-icon class="material-symbols-filled">search</mat-icon>
          <mat-icon class="material-symbols-filled">home</mat-icon>
          <mat-icon class="material-symbols-filled">favorite</mat-icon>
          <mat-icon class="material-symbols-filled">settings</mat-icon>
          <mat-icon class="material-symbols-filled">account_circle</mat-icon>
        </div>
      </section>

      <!-- Sharp Style -->
      <section class="space-y-4">
        <h2 class="text-xl font-semibold">Sharp Style</h2>
        <div class="flex items-center space-x-4">
          <mat-icon class="material-symbols-sharp">search</mat-icon>
          <mat-icon class="material-symbols-sharp">home</mat-icon>
          <mat-icon class="material-symbols-sharp">favorite</mat-icon>
          <mat-icon class="material-symbols-sharp">settings</mat-icon>
          <mat-icon class="material-symbols-sharp">account_circle</mat-icon>
        </div>
      </section>

      <!-- Different Weights -->
      <section class="space-y-4">
        <h2 class="text-xl font-semibold">Different Weights</h2>
        <div class="flex items-center space-x-4">
          <div class="text-center">
            <mat-icon class="material-symbols-light">star</mat-icon>
            <p class="text-xs mt-1">Light</p>
          </div>
          <div class="text-center">
            <mat-icon>star</mat-icon>
            <p class="text-xs mt-1">Normal</p>
          </div>
          <div class="text-center">
            <mat-icon class="material-symbols-bold">star</mat-icon>
            <p class="text-xs mt-1">Bold</p>
          </div>
        </div>
      </section>

      <!-- Different Sizes -->
      <section class="space-y-4">
        <h2 class="text-xl font-semibold">Different Sizes</h2>
        <div class="flex items-center space-x-4">
          <div class="text-center">
            <mat-icon class="material-symbols-small">dashboard</mat-icon>
            <p class="text-xs mt-1">Small (18px)</p>
          </div>
          <div class="text-center">
            <mat-icon>dashboard</mat-icon>
            <p class="text-xs mt-1">Normal (24px)</p>
          </div>
          <div class="text-center">
            <mat-icon class="material-symbols-large">dashboard</mat-icon>
            <p class="text-xs mt-1">Large (36px)</p>
          </div>
          <div class="text-center">
            <mat-icon class="material-symbols-xl">dashboard</mat-icon>
            <p class="text-xs mt-1">XL (48px)</p>
          </div>
        </div>
      </section>

      <!-- Custom Styles Example -->
      <section class="space-y-4">
        <h2 class="text-xl font-semibold">Custom Style Example</h2>
        <div class="flex items-center space-x-4">
          <mat-icon 
            style="font-variation-settings: 'FILL' 1, 'wght' 700, 'GRAD' 25, 'opsz' 48; font-size: 48px;"
          >
            favorite
          </mat-icon>
          <div class="text-sm">
            <p><strong>Custom Settings:</strong></p>
            <p>FILL: 1 (filled)</p>
            <p>wght: 700 (bold)</p>
            <p>GRAD: 25 (emphasized)</p>
            <p>opsz: 48 (large optical size)</p>
          </div>
        </div>
      </section>
    </div>
  `,
  imports: [MatIconModule]
})
export class MaterialSymbolsDemo { }