import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../layout/components/sidebar/sidebar.component';
import { NavbarComponent } from '../layout/components/navbar/navbar.component';
import { FooterComponent } from '../layout/components/footer/footer.component';
import { LayoutModule } from '../layout/layout.module';
import { BottomNavbarComponent } from "../layout/components/bottom-navbar/bottom-navbar.component";
import { ButtonComponent } from "../../shared/components/button/button.component";
import { ReactiveFormsModule } from '@angular/forms';

export interface SelectedImage {
  name: string;
  dataUrl: string;
}
@Component({
  selector: 'app-multimedia',
  templateUrl: './multimedia.component.html',
  styleUrls: ['./multimedia.component.scss'],
  standalone: true,
  imports: [CommonModule,
    LayoutModule,
    ButtonComponent,
    SidebarComponent,
    NavbarComponent,
    FooterComponent,
    BottomNavbarComponent,
    ReactiveFormsModule
  ],
})
export class MultimediaComponent {
  selectedPage: string = 'images'; // Default selection
  selectedImages: SelectedImage[] = [];

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.url.subscribe(url => {
      const path = url[0]?.path || 'images';
      this.selectedPage = path;
    });
  }

  onSelectChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedPage = selectElement.value;
  }

  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      for (let i = 0; i < input.files.length; i++) {
        const file = input.files[i];
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.selectedImages.push({
            name: file.name,
            dataUrl: e.target.result
          });
        };
        reader.readAsDataURL(file);
      }
    }
  }

  generateNewName(originalName: string): string {
    const timestamp = new Date().getTime();
    const extension = originalName.split('.').pop();
    return `${timestamp}.${extension}`;
  }
}