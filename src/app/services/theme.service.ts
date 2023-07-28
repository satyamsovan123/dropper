import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  constructor() {}

  switchTheme(currentTheme: string) {
    document.body.className = currentTheme;
  }

  getCurrentTheme(): string {
    return document.body.className;
  }
}
