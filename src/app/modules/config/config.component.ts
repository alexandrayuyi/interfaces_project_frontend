import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ThemeService } from 'src/app/core/services/theme.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {
  colorForm: FormGroup;

  constructor(private fb: FormBuilder, private themeService: ThemeService) {
    this.colorForm = this.fb.group({
      color1: [localStorage.getItem('theme') ? JSON.parse(localStorage.getItem('theme')!).primary : ['#87C09D']],
      color2: [localStorage.getItem('theme') ? JSON.parse(localStorage.getItem('theme')!).secondary : ['#DEFCEA']],
      color3: [localStorage.getItem('theme') ? JSON.parse(localStorage.getItem('theme')!).muted : ['#000200']],
      hFont: [null],
      pFont: [null],
      h1Size: [localStorage.getItem('theme') ? JSON.parse(localStorage.getItem('theme')!).h1Size : 24], // Default h1 size
      h2Size: [localStorage.getItem('theme') ? JSON.parse(localStorage.getItem('theme')!).h2Size : 20], // Default h2 size
      pSize: [localStorage.getItem('theme') ? JSON.parse(localStorage.getItem('theme')!).pSize : 16],  // Default p size
    });
  }


  ngOnInit() {
    const hFontUrl = localStorage.getItem('hFontUrl');
    const pFontUrl = localStorage.getItem('pFontUrl');

    if (hFontUrl) {
      this.applyFont(hFontUrl, 'MiFuenteTitulos', '.dynamic-h1, .dynamic-h2, h1, h2');
    }

    if (pFontUrl) {
      this.applyFont(pFontUrl, 'MiFuenteParrafos', '.dynamic-p, body');
    }


    this.colorForm.get('color1')?.valueChanges.subscribe((color) => {
      this.themeService.updateColors({ primary: color, secondary: this.colorForm.get('color2')?.value, muted: this.colorForm.get('color3')?.value });
    });
    this.colorForm.get('color2')?.valueChanges.subscribe((color) => {
      this.themeService.updateColors({ primary: this.colorForm.get('color1')?.value, secondary: color, muted: this.colorForm.get('color3')?.value });
    });

    this.colorForm.get('color3')?.valueChanges.subscribe((color) => {
      this.themeService.updateColors({ primary: this.colorForm.get('color1')?.value, secondary: this.colorForm.get('color2')?.value, muted: color });
    });
    // Subscribe to changes in font sizes
    this.colorForm.get('h1Size')?.valueChanges.subscribe((size) => {
      this.themeService.updateFontSizes({ h1Size: this.colorForm.get('h1Size')?.value, h2Size: this.colorForm.get('h2Size')?.value, pSize: this.colorForm.get('pSize')?.value });
    });

    this.colorForm.get('h2Size')?.valueChanges.subscribe((size) => {
      this.themeService.updateFontSizes({ h1Size: this.colorForm.get('h1Size')?.value, h2Size: this.colorForm.get('h2Size')?.value, pSize: this.colorForm.get('pSize')?.value });
    });

    this.colorForm.get('pSize')?.valueChanges.subscribe((size) => {
      this.themeService.updateFontSizes({
        h1Size: this.colorForm.get('h1Size')?.value,
        h2Size: this.colorForm.get('h2Size')?.value,
        pSize: this.colorForm.get('pSize')?.value,
      });
    });

  }


  onFileSelected(event: any, fontType: string) {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const fontUrl = e.target.result;

        if (fontType === 'hFont') {
          localStorage.setItem('hFontUrl', fontUrl);
          this.applyFont(fontUrl, 'MiFuenteTitulos', '.dynamic-h1, .dynamic-h2, h2, h1');
        } else if (fontType === 'pFont') {
          localStorage.setItem('pFontUrl', fontUrl);
          this.applyFont(fontUrl, 'MiFuenteParrafos', '.dynamic-p, body, a, p, span, button, .paragraph');
        }
      };

      reader.readAsDataURL(file); // Lee el archivo como Data URL
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
  onResetTheme() {
    // Reset theme to default
    this.themeService.resetTheme();

    // Reset form to default values
    this.colorForm.reset({
      color1: '#87C09D',
      color2: '#DEFCEA',
      color3: '#000200',
      h1Size: 32,
      h2Size: 24,
      pSize: 16,
      hFont: null,
      pFont: null,
    });
  }

  onSubmit() {
    // Handle form submission if needed
  }
}
