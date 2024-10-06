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
    return theme ? JSON.parse(theme) : { mode: 'dark', color: 'base', primary: '', secondary: '', muted: '' };
  }

  private setTheme() {
    localStorage.setItem('theme', JSON.stringify(this.themeSubject.value));
    this.setThemeClass();
  }

  public get isDark(): boolean {
    return this.themeSubject.value.mode == 'dark';
  }

  public updateColors(colors: { primary: string; secondary: string; muted: string }) {
    const updatedTheme = { ...this.themeSubject.value, ...colors };
    this.themeSubject.next(updatedTheme);
    this.setTheme();
  }

  private setThemeClass() {
    const theme = this.themeSubject.value;
  // document.querySelector('html')!.className = theme.mode;
  // document.querySelector('html')!.setAttribute('data-theme', theme.color);
  
   // Update CSS variables
   document.documentElement.style.setProperty('--primary', theme.primary || '#22c55e'); // Fallback to default
  document.documentElement.style.setProperty('--secondary', theme.secondary || '#cc0022'); // Fallback to default
  document.documentElement.style.setProperty('--muted', theme.muted || '#6d28d9'); // Fallback to default
   
   console.log('Updated CSS Variables:', {
     primary: theme.primary,
     secondary: theme.secondary,
     muted: theme.muted,
   });
  }

  public getPrimaryColor(): string {
    return this.themeSubject.value.primary || '#22c55e'; // Default
  }
  
  public getSecondaryColor(): string {
    return this.themeSubject.value.secondary || '#cc0022'; // Default
  }
  
  public getMutedColor(): string {
    return this.themeSubject.value.muted || '#6d28d9'; // Default
  }
}
