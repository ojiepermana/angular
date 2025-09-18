import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeSelector, Button } from '@ojiepermana/kit';
import { ThemeDebugComponent } from './components/theme-debug.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ThemeSelector, Button, ThemeDebugComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Ala Design System - Angular Kit');
}
