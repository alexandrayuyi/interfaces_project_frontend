import { Component } from '@angular/core';
import { ThemeService } from './core/services/theme.service';
import { RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';
import { ResponsiveHelperComponent } from './shared/components/responsive-helper/responsive-helper.component';
import { NgxSonnerToaster } from 'ngx-sonner';
import { FontService } from './core/services/font.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [NgClass, RouterOutlet, ResponsiveHelperComponent, NgxSonnerToaster],
})
export class AppComponent {

  title = 'Angular Tailwind';

  constructor(public themeService: ThemeService, private fontService: FontService) {}
  ngOnInit() {
    const userId = Number(localStorage.getItem('userid'));
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      const theme = JSON.parse(savedTheme);
      this.themeService.applyTheme(theme);
    }
    if (userId) {
      this.themeService.loadThemeFromDatabase(userId).subscribe((theme: any) => {
        this.themeService.applyTheme(theme);
        localStorage.setItem('theme', JSON.stringify(theme));
      });
    }
    // Cargar las fuentes al iniciar la aplicación
    this.themeService.theme$.subscribe((theme) => {
      this.themeService.setThemeClass();
    });
    this.themeService.setThemeClass();
    this.fontService.loadFonts();
  }
}
