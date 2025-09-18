import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { OpThemeSelector, OpButton } from '@ojiepermana/angular';
import { ThemeDebugComponent } from './components/theme-debug.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, OpThemeSelector, OpButton, ThemeDebugComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Ala Design System - Angular Kit');
}
