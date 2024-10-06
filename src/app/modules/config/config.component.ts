import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ThemeService } from 'src/app/core/services/theme.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'] // Ensure this is 'styleUrls'
})
export class ConfigComponent implements OnInit {
  colorForm: FormGroup; // Declare the FormGroup

  constructor(private fb: FormBuilder, private themeService: ThemeService) {
    // Initialize the form in the constructor
    this.colorForm = this.fb.group({
      color1: ['#22c55e'], // Initial value for primary color
      color2: ['#cc0022'], // Initial value for secondary color
      color3: ['#6d28d9'], // Initial value for text color
      titleFont: [null], // Placeholder for font file input
      paragraphFont: [null], // Placeholder for font file input
      paragraphSize: [12] // Default paragraph size
    });
  }

  ngOnInit(): void {
    // Subscribe to changes in the form and update theme colors
    this.colorForm.valueChanges.subscribe(values => {
      this.updateThemeColors(values);
    });
  }

  updateThemeColors(colors: { color1: string; color2: string; color3: string }) {
    // Update theme colors dynamically
    this.themeService.updateColors({
      primary: colors.color1,
      secondary: colors.color2,
      textColor: colors.color3
    });
  }

  onSubmit(): void {
    if (this.colorForm.valid) {
      console.log('Form submitted with values:', this.colorForm.value);
      // Save changes, handle font files, etc.
    } else {
      console.log('Form is invalid');
    }
  }
}