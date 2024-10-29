import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ThemeService } from 'src/app/core/services/theme.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {
  colorForm: FormGroup;
  successmsg: string = '';
  private isSaved = false;

  constructor(
    private fb: FormBuilder,
    private themeService: ThemeService,
    private http: HttpClient,
    private router: Router
  ) {
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
    const userId = Number(localStorage.getItem('userid'));
    this.http.get(`http://localhost:5000/api/v1/config/${userId}`).pipe(
      catchError(error => {
        if (error.status === 401) {
          this.router.navigate(['/auth']);
        }
        return of(null); // Return a null observable to complete the stream
      })
    ).subscribe((config: any) => {
      if (config) {
        this.colorForm.patchValue({
          color1: config.color1 || '#87C09D',
          color2: config.color2 || '#DEFCEA',
          color3: config.color3 || '#000200',
          h1Size: parseInt(config.h1size) || 32,
          h2Size: parseInt(config.h2size) || 24,
          pSize: parseInt(config.psize) || 16,
        });
        // Aplicar inmediatamente el tema después de cargar los valores del backend
        this.themeService.updateColors({
          primary: config.color1,
          secondary: config.color2,
          muted: config.color3,
        });
        this.themeService.updateFontSizes({
          h1Size: parseInt(config.h1size),
          h2Size: parseInt(config.h2size),
          pSize: parseInt(config.psize)
        });
        // Guardamos en localStorage
        localStorage.setItem('theme', JSON.stringify(config));
      }
    });

    this.subscribeToFormChanges();
  }

  subscribeToFormChanges() {
    // Suscripciones a cambios de colores
    this.colorForm.get('color1')?.valueChanges.subscribe((color) => {
      this.themeService.updateColors({
        primary: color,
        secondary: this.colorForm.get('color2')?.value,
        muted: this.colorForm.get('color3')?.value,
      });
      this.saveTemporaryConfig();
    });

    this.colorForm.get('color2')?.valueChanges.subscribe((color) => {
      this.themeService.updateColors({
        primary: this.colorForm.get('color1')?.value,
        secondary: color,
        muted: this.colorForm.get('color3')?.value,
      });
      this.saveTemporaryConfig();
    });

    this.colorForm.get('color3')?.valueChanges.subscribe((color) => {
      this.themeService.updateColors({
        primary: this.colorForm.get('color1')?.value,
        secondary: this.colorForm.get('color2')?.value,
        muted: color,
      });
      this.saveTemporaryConfig();
    });

    // Suscribirse a los cambios en el tamaño de fuente
    this.colorForm.get('h1Size')?.valueChanges.subscribe(() => this.updateFontSizes());
    this.colorForm.get('h2Size')?.valueChanges.subscribe(() => this.updateFontSizes());
    this.colorForm.get('pSize')?.valueChanges.subscribe(() => this.updateFontSizes());
  }

  updateFontSizes() {
    this.themeService.updateFontSizes({
      h1Size: this.colorForm.get('h1Size')?.value,
      h2Size: this.colorForm.get('h2Size')?.value,
      pSize: this.colorForm.get('pSize')?.value,
    });
    this.saveTemporaryConfig();
  }

  async onSubmit() {
    console.log("aqui");
    try {
      await this.saveConfig();
      this.successmsg = 'Theme saved'
      // window.location.reload();
    } catch (error) {
      console.error('Error saving config', error);
    } finally {
      console.log('Config saved');
      setTimeout(() => {
        this.onLoad();
      }, 300);
      // this.onLoad();
    }
  }

  onLoad(){
    console.log("loading...")
    window.location.reload();
  }

  // Función para aplicar una fuente personalizada
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
        this.saveTemporaryConfig();
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
    this.themeService.resetTheme();
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
    this.saveConfig();
  }

  saveConfig() {
    const userId = Number(localStorage.getItem('userid'));
    const currentConfig = JSON.parse(localStorage.getItem('theme') || '{}');
    const config = {
      color1: this.colorForm.get('color1')?.value,
      color2: this.colorForm.get('color2')?.value,
      color3: this.colorForm.get('color3')?.value,
      h1size: `${this.colorForm.get('h1Size')?.value}px`,
      h2size: `${this.colorForm.get('h2Size')?.value}px`,
      psize: `${this.colorForm.get('pSize')?.value}px`,
      fonttitle: localStorage.getItem('hFontUrl') ? 'MiFuenteTitulos' : null,
      fontp: localStorage.getItem('pFontUrl') ? 'MiFuenteParrafos' : null,
      userId: userId
    };

    this.http.post('http://localhost:5000/api/v1/config/', config).subscribe(response => {
      console.log('Config saved', response);
      this.isSaved = true;
      localStorage.setItem('theme', JSON.stringify(config));
    }, error => {
      console.error('Error saving config', error);
    });
  }

  saveTemporaryConfig() {
    const userId = Number(localStorage.getItem('userid'));

    const tempConfig = {
      color1: this.colorForm.get('color1')?.value,
      color2: this.colorForm.get('color2')?.value,
      color3: this.colorForm.get('color3')?.value,
      h1size: `${this.colorForm.get('h1Size')?.value}px`,
      h2size: `${this.colorForm.get('h2Size')?.value}px`,
      psize: `${this.colorForm.get('pSize')?.value}px`,
      fonttitle: localStorage.getItem('hFontUrl') ? 'MiFuenteTitulos' : null,
      fontp: localStorage.getItem('pFontUrl') ? 'MiFuenteParrafos' : null,
      userId: userId
    };

    localStorage.setItem('theme', JSON.stringify(tempConfig));
  }
}
