import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Theme } from '../models/theme.model';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private themeSubject = new BehaviorSubject<Theme>(this.loadTheme());
  public theme$ = this.themeSubject.asObservable();

  constructor() {
    this.setTheme();
  }

  private loadTheme(): Theme {
    const theme = localStorage.getItem('theme');
    return theme ? JSON.parse(theme) : { mode: 'dark', color: 'base', primary: '', secondary: '', textColor: '' };
  }

  private setTheme() {
    localStorage.setItem('theme', JSON.stringify(this.themeSubject.value));
    this.setThemeClass();
  }

  public get isDark(): boolean {
    return this.themeSubject.value.mode == 'dark';
  }

  public updateColors(colors: { primary: string; secondary: string; textColor: string }) {
    const updatedTheme = { ...this.themeSubject.value, ...colors };
    this.themeSubject.next(updatedTheme);
    this.setTheme();
  }

  private setThemeClass() {
    const theme = this.themeSubject.value;
    document.querySelector('html')!.className = theme.mode;
    document.querySelector('html')!.setAttribute('data-theme', theme.color);
    document.documentElement.style.setProperty('--primary-color', theme.primary);
    document.documentElement.style.setProperty('--secondary-color', theme.secondary);
    document.documentElement.style.setProperty('--text-color', theme.textColor);
  }
}
