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

  constructor(private fb: FormBuilder, private themeService:
    ThemeService) {
    this.colorForm = this.fb.group({
      color1: [localStorage.getItem('theme') ? JSON.parse(localStorage.getItem('theme')!).primary : ['#87C09D']],
      color2: [localStorage.getItem('theme') ? JSON.parse(localStorage.getItem('theme')!).secondary : ['#DEFCEA']],
      color3: [localStorage.getItem('theme') ? JSON.parse(localStorage.getItem('theme')!).muted : ['#000200']],
      titleFont: [null],
      paragraphFont: [null],
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

  onSubmit() {
    // Handle form submission if needed
  }
}
