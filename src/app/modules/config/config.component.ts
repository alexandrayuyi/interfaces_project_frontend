import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemeService } from 'src/app/core/services/theme.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {
  configForm: FormGroup;

  constructor(private fb: FormBuilder, private themeService: ThemeService) {
    this.configForm = this.fb.group({
      primary: ['#ff0000', Validators.required],
      secondary: ['#f0f0f0', Validators.required],
      textColor: ['#000000', Validators.required],
      paragraphSize: [12, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    // Listen to color changes in real-time
    // this.configForm.get('primary')?.valueChanges.subscribe(() => this.updateColors());
    // this.configForm.get('secondary')?.valueChanges.subscribe(() => this.updateColors());
    // this.configForm.get('textColor')?.valueChanges.subscribe(() => this.updateColors());
  }

  // updateColors(): void {
  //   const { primary, secondary, textColor } = this.configForm.value;
  //   this.themeService.updateColors({ primary, secondary, textColor });
  // }

  onSubmit(): void {
    if (this.configForm.valid) {
      console.log('Saved changes:', this.configForm.value);
      // Save changes in localStorage or any persistence layer here
    } else {
      console.log('Form is invalid');
    }
  }
}