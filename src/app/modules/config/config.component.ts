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
      color1: ['#ffffff'], // Default color
      color2: ['#000000'],
      color3: ['#ff0000'],
      titleFont: [null],
      paragraphFont: [null],
      paragraphSize: [16],
      h1Size: [20], // Default h1 size
      h2Size: [24], // Default h2 size
      pSize: [16],  // Default p size
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
      this.themeService.updateFontSizes({ h1Size: size, h2Size: this.colorForm.get('h2Size')?.value, pSize: this.colorForm.get('pSize')?.value });
    });

    this.colorForm.get('h2Size')?.valueChanges.subscribe((size) => {
      this.themeService.updateFontSizes({ h1Size: this.colorForm.get('h1Size')?.value, h2Size: size, pSize: this.colorForm.get('pSize')?.value });
    });

    this.colorForm.get('pSize')?.valueChanges.subscribe((size) => {
      this.themeService.updateFontSizes({ h1Size: this.colorForm.get('h1Size')?.value, h2Size: this.colorForm.get('h2Size')?.value, pSize: size });
    });


    this.colorForm.get('titleFont')?.valueChanges.subscribe((h1Size) => {
      this.themeService.updateFontSizes({
        h1Size,
        h2Size: this.colorForm.get('paragraphFont')?.value,
        pSize: this.colorForm.get('paragraphSize')?.value,
      });
    });

    this.colorForm.get('paragraphFont')?.valueChanges.subscribe((h2Size) => {
      this.themeService.updateFontSizes({
        h1Size: this.colorForm.get('titleFont')?.value,
        h2Size,
        pSize: this.colorForm.get('paragraphSize')?.value,
      });
    });

    this.colorForm.get('paragraphSize')?.valueChanges.subscribe((pSize) => {
      this.themeService.updateFontSizes({
        h1Size: this.colorForm.get('titleFont')?.value,
        h2Size: this.colorForm.get('paragraphFont')?.value,
        pSize,
      });
    });

  }

  onSubmit() {
    // Handle form submission if needed
  }
}
