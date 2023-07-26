import { Component } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  constructor(public themeService: ThemeService) {}

  currentTheme: string = 'light';
  currentThemeIcon: string = '../../../assets/light-theme.svg';

  switchTheme() {
    if (this.currentTheme === 'light') {
      this.currentTheme = 'dark';
      this.currentThemeIcon = '../../../assets/dark-theme.svg';
    } else {
      this.currentTheme = 'light';
      this.currentThemeIcon = '../../../assets/light-theme.svg';
    }
    this.themeService.switchTheme(this.currentTheme);
  }
}
