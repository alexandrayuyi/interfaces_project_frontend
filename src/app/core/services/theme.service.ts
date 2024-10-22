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

  resetTheme() {
    const defaultTheme: Theme = { mode: 'dark', color: 'base', primary: '87C09D', secondary: 'DEFCEA', muted: '000200', h1Size: 32, h2Size: 24, pSize: 16 };
    this.themeSubject.next(defaultTheme);
    this.setTheme();
    this.setThemeClass();
  }

  private loadTheme(): Theme {
    const theme = localStorage.getItem('theme');
    return theme ? JSON.parse(theme) : { mode: 'dark', color: 'base', primary: '87C09D', secondary: 'DEFCEA', muted: '000200', h1Size: '32px', h2Size: '24px', pSize: '16px' };
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

  public updateFontSizes(sizes: { h1Size: number; h2Size: number; pSize: number }) {
    const updatedTheme = { ...this.themeSubject.value, ...sizes };
    this.themeSubject.next(updatedTheme);
    this.setTheme();
  }

  private setThemeClass() {
    const theme = this.themeSubject.value;
  // document.querySelector('html')!.className = theme.mode;
  // document.querySelector('html')!.setAttribute('data-theme', theme.color);

   // Update CSS variables
    document.documentElement.style.setProperty('--primary', theme.primary || '#87C09D'); // Fallback to default
    document.documentElement.style.setProperty('--secondary', theme.secondary || '#DEFCEA'); // Fallback to default
    document.documentElement.style.setProperty('--muted', theme.muted || '#000200'); // Fallback to default

    // Actualizar las variables de tamaño de fuente en CSS
    document.documentElement.style.setProperty('--h1-size', `${theme.h1Size}px`);
    document.documentElement.style.setProperty('--h2-size', `${theme.h2Size}px`);
    document.documentElement.style.setProperty('--p-size', `${theme.pSize}px`);
    document.documentElement.style.setProperty('--font-family', 'MiFuenteTitulos, sans-serif'); // Roboto como fallback

   console.log('Updated CSS Variables:', {
     primary: theme.primary,
     secondary: theme.secondary,
     muted: theme.muted,
     h1Size: theme.h1Size,
     h2Size: theme.h2Size,
     pSize: theme.pSize,
     fontFamily: 'Roboto, sans-serif', // Log para depurar la fuente
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
