import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Theme } from '../models/theme.model';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private themeSubject = new BehaviorSubject<Theme>(this.loadTheme());
  public theme$ = this.themeSubject.asObservable();
  private userId = Number(localStorage.getItem('userid'));

  constructor(private http: HttpClient) {
  }

  loadThemeFromDatabase(userId: number) {
    return this.http.get(`http://localhost:5000/api/v1/config/${userId}`);
  }

  resetTheme() {
    this.updateColors({ primary: '#87C09D', secondary: '#DEFCEA', muted: '#000200' });
    this.updateFontSizes({ h1Size: 32, h2Size: 24, pSize: 16 });
  }


  public setThemeClass() {

    const theme = this.themeSubject.value;

    document.documentElement.style.setProperty('--primary', theme.primary || '#87C09D');
    document.documentElement.style.setProperty('--secondary', theme.secondary || '#DEFCEA');
    document.documentElement.style.setProperty('--muted', theme.muted || '#000200');
    document.documentElement.style.setProperty('--h1-size', `${theme.h1Size}px`);
    document.documentElement.style.setProperty('--h2-size', `${theme.h2Size}px`);
    document.documentElement.style.setProperty('--p-size', `${theme.pSize}px`);
    document.documentElement.style.setProperty('--font-family', 'MiFuenteTitulos, sans-serif');
  }

  private loadTheme(): Theme {
    const theme = localStorage.getItem('theme');
    return theme ? JSON.parse(theme) : {
      mode: 'dark',
      color: 'base',
      primary: '87C09D',
      secondary: 'DEFCEA',
      muted: '000200',
      h1Size: '32px',
      h2Size: '24px',
      pSize: '16px'
    };
  }

  updateColors(theme: { primary: string, secondary: string, muted: string }) {
    document.documentElement.style.setProperty('--primary', theme.primary);
    document.documentElement.style.setProperty('--secondary', theme.secondary);
    document.documentElement.style.setProperty('--muted', theme.muted);
  }

  updateFontSizes(sizes: { h1Size: number, h2Size: number, pSize: number }) {
    document.documentElement.style.setProperty('--h1-size', `${sizes.h1Size}px`);
    document.documentElement.style.setProperty('--h2-size', `${sizes.h2Size}px`);
    document.documentElement.style.setProperty('--p-size', `${sizes.pSize}px`);
  }

  applyTheme(theme: any) {
    // Aplicar colores
    this.updateColors({
      primary: theme.color1 || '#87C09D',
      secondary: theme.color2 || '#DEFCEA',
      muted: theme.color3 || '#000200',
    });

    // Aplicar tamaños de fuentes
    this.updateFontSizes({
      h1Size: parseInt(theme.h1size) || 32,
      h2Size: parseInt(theme.h2size) || 24,
      pSize: parseInt(theme.psize) || 16,
    });

    // Aplicar fuentes personalizadas (si están configuradas)
    if (localStorage.getItem('hFontUrl')) {
      this.applyFont(localStorage.getItem('hFontUrl')!, 'MiFuenteTitulos', '.dynamic-h1, .dynamic-h2, h2, h1');
    }

    if (localStorage.getItem('pFontUrl')) {
      this.applyFont(localStorage.getItem('pFontUrl')!, 'MiFuenteParrafos', '.dynamic-p, body, a, p, span, button, .paragraph');
    }
  }
  applyFont(fontUrl: string, fontName: string, selector: string) {
    const newFont = new FontFace(fontName, `url(${fontUrl})`);

    newFont.load().then((loadedFont) => {
      (document.fonts as any).add(loadedFont);

      // Aplica la fuente a los elementos con la clase especificada
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        (element as HTMLElement).style.fontFamily = `${fontName}, sans-serif`;
      });
    });
  }
}
