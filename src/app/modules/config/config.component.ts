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


  onFileSelected(event: any, type: 'h' | 'p') {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const fontUrl = e.target.result;

        if (type === 'h') {
          // Almacenar la fuente de los títulos en localStorage
          localStorage.setItem('hFontUrl', fontUrl);
          this.applyFontToElements('MiFuenteTitulos', fontUrl, ['h1', 'h2']);
        } else {
          // Almacenar la fuente de los párrafos en localStorage
          localStorage.setItem('pFontUrl', fontUrl);
          this.applyFontToElements('MiFuenteParrafos', fontUrl, ['p', 'span', 'div']);
        }
      };

      reader.readAsDataURL(file);  // Lee el archivo como Data URL
    }
  }

  applyFontToElements(fontName: string, fontUrl: string, elements: string[]) {
    const newFont = new FontFace(fontName, `url(${fontUrl})`);

    newFont.load().then((loadedFont) => {
      (document.fonts as any).add(loadedFont);

      elements.forEach((element) => {
        const tags = document.getElementsByTagName(element);
        for (let i = 0; i < tags.length; i++) {
          (tags[i] as HTMLElement).style.fontFamily = `${fontName}, sans-serif`;
        }
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
      titleFont: null,
      paragraphFont: null,
    });
  }

  onSubmit() {
    // Handle form submission if needed
  }
}
