import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { OpButton } from '@ojiepermana/angular';

@Component({
  selector: 'app-material-icons-demo',
  imports: [MatIconModule, MatButtonModule, OpButton],
  template: `
    <div class="material-icons-demo">
      <h2>Google Material Icons Demo</h2>

      <div class="section">
        <h3>1. Basic Material Icons</h3>
        <div class="icon-grid">
          <div class="icon-item">
            <mat-icon>home</mat-icon>
            <span>home</span>
          </div>
          <div class="icon-item">
            <mat-icon>favorite</mat-icon>
            <span>favorite</span>
          </div>
          <div class="icon-item">
            <mat-icon>settings</mat-icon>
            <span>settings</span>
          </div>
          <div class="icon-item">
            <mat-icon>search</mat-icon>
            <span>search</span>
          </div>
          <div class="icon-item">
            <mat-icon>account_circle</mat-icon>
            <span>account_circle</span>
          </div>
          <div class="icon-item">
            <mat-icon>notifications</mat-icon>
            <span>notifications</span>
          </div>
        </div>
      </div>

      <div class="section">
        <h3>2. Material Buttons with Icons</h3>
        <div class="button-group">
          <button mat-raised-button color="primary">
            <mat-icon>add</mat-icon>
            Add Item
          </button>

          <button mat-raised-button color="accent">
            <mat-icon>edit</mat-icon>
            Edit
          </button>

          <button mat-raised-button color="warn">
            <mat-icon>delete</mat-icon>
            Delete
          </button>

          <button mat-fab color="primary" aria-label="Add">
            <mat-icon>add</mat-icon>
          </button>

          <button mat-mini-fab color="accent" aria-label="Edit">
            <mat-icon>edit</mat-icon>
          </button>
        </div>
      </div>

      <div class="section">
        <h3>3. Op Buttons with Material Icons</h3>
        <div class="button-group">
          <op-button variant="primary" size="md">
            <mat-icon>dashboard</mat-icon>
            Dashboard
          </op-button>

          <op-button variant="secondary" size="md">
            <mat-icon>analytics</mat-icon>
            Analytics
          </op-button>

          <op-button variant="outline" size="md">
            <mat-icon>download</mat-icon>
            Download
          </op-button>

          <op-button variant="destructive" size="md">
            <mat-icon>logout</mat-icon>
            Logout
          </op-button>
        </div>
      </div>

      <div class="section">
        <h3>4. Different Icon Sizes</h3>
        <div class="size-demo">
          <div class="size-item">
            <mat-icon class="size-18">star</mat-icon>
            <span>18px</span>
          </div>
          <div class="size-item">
            <mat-icon class="size-24">star</mat-icon>
            <span>24px (default)</span>
          </div>
          <div class="size-item">
            <mat-icon class="size-36">star</mat-icon>
            <span>36px</span>
          </div>
          <div class="size-item">
            <mat-icon class="size-48">star</mat-icon>
            <span>48px</span>
          </div>
        </div>
      </div>

      <div class="section">
        <h3>5. Colored Icons</h3>
        <div class="color-demo">
          <mat-icon class="color-primary">favorite</mat-icon>
          <mat-icon class="color-accent">star</mat-icon>
          <mat-icon class="color-warn">warning</mat-icon>
          <mat-icon class="color-success">check_circle</mat-icon>
          <mat-icon class="color-info">info</mat-icon>
        </div>
      </div>
    </div>
  `,
  styles: `
    .material-icons-demo {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .section {
      margin: 2rem 0;
      padding: 1.5rem;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: #fafafa;
    }

    .section h3 {
      margin-top: 0;
      color: #374151;
    }

    .icon-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 1rem;
    }

    .icon-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      background: white;
      transition: all 0.2s;
    }

    .icon-item:hover {
      border-color: #3b82f6;
      box-shadow: 0 2px 4px rgba(59, 130, 246, 0.1);
    }

    .icon-item mat-icon {
      margin-bottom: 0.5rem;
      color: #4b5563;
    }

    .icon-item span {
      font-size: 0.75rem;
      color: #6b7280;
      text-align: center;
    }

    .button-group {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      align-items: center;
    }

    .button-group button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .button-group op-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .size-demo {
      display: flex;
      gap: 2rem;
      align-items: end;
    }

    .size-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .size-item span {
      font-size: 0.75rem;
      color: #6b7280;
    }

    .color-demo {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    /* Icon sizes */
    .size-18 {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .size-24 {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .size-36 {
      font-size: 36px;
      width: 36px;
      height: 36px;
    }

    .size-48 {
      font-size: 48px;
      width: 48px;
      height: 48px;
    }

    /* Icon colors */
    .color-primary {
      color: #3b82f6;
    }

    .color-accent {
      color: #f59e0b;
    }

    .color-warn {
      color: #ef4444;
    }

    .color-success {
      color: #10b981;
    }

    .color-info {
      color: #06b6d4;
    }
  `
})
export class MaterialIconsDemoComponent {
}
