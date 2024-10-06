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
  }

  onSubmit() {
    // Handle form submission if needed
  }
}