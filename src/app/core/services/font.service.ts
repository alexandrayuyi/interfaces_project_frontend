import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FontService {
  constructor() {}

  loadFonts() {
    const hFontUrl = localStorage.getItem('hFontUrl');
    const pFontUrl = localStorage.getItem('pFontUrl');

    if (hFontUrl) {
      this.applyFont(hFontUrl, 'MiFuenteTitulos', '.dynamic-h1, .dynamic-h2, h1, h2');
    }

    if (pFontUrl) {
      this.applyFont(pFontUrl, 'MiFuenteParrafos', '.dynamic-p, body, a, button');
    }
  }

  private applyFont(fontUrl: string, fontName: string, selector: string) {
    const newFont = new FontFace(fontName, `url(${fontUrl})`);

    newFont.load().then((loadedFont) => {
      (document.fonts as any).add(loadedFont);
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        (element as HTMLElement).style.fontFamily = `${fontName}, sans-serif`;
      });
    });
  }
}
