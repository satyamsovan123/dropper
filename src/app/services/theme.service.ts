import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  constructor() {}

  switchTheme(currentTheme: string) {
    // console.log(`Theme switched to ${currentTheme}`);
    // localStorage.setItem('theme', currentTheme);
    document.body.className = currentTheme;
  }

  getCurrentTheme(): string {
    return document.body.className;
  }
}
