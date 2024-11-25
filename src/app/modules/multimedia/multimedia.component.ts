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
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { EditorModule } from '@tinymce/tinymce-angular';
import { FormsModule } from '@angular/forms';
import { FilesService } from '../landing/services/files.service'; // Importa el servicio

interface SelectedImage {
  name: string;
  dataUrl: string;
  size: number;
  width: number;
  height: number;
  extension: string;
}

interface SelectedAudio {
  file: File;
  name: string;
  duration: string;
  dataUrl: string;
}

interface SelectedPDF {
  name: string;
  dataUrl: string;
}

interface SelectedVideo {
  name: string;
  dataUrl: string;
  duration: string;
  format: string;
}

interface SelectedSubtitle {
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
    SidebarComponent,
    NavbarComponent,
    FooterComponent,
    ReactiveFormsModule,
    PdfViewerModule,
    EditorModule,
    FormsModule
  ],
  providers: [FilesService] // Provee el servicio
})
export class MultimediaComponent {
  selectedPage: string = 'images'; // Default selection
  selectedImages: SelectedImage[] = [];
  selectedAudios: SelectedAudio[] = [];
  selectedPDF: SelectedPDF | null = null;
  selectedVideo: SelectedVideo | null = null;
  selectedSubtitle: SelectedSubtitle | null = null;
  termsAndConditions: string = '';
  savedContent: string = '';

  imageValidationMessage: string = '';
  audioValidationMessage: string = '';

  editorConfig: any; // Define la propiedad editorConfig

  constructor(private router: Router, private route: ActivatedRoute, private filesService: FilesService) {
    this.editorConfig = {
      // Configuración del editor
      height: 500,
      menubar: false,
      plugins: [
        'advlist autolink lists link image charmap print preview anchor',
        'searchreplace visualblocks code fullscreen',
        'insertdatetime media table paste code help wordcount'
      ],
      toolbar: 'undo redo | formatselect | bold italic backcolor | \
                alignleft aligncenter alignright alignjustify | \
                bullist numlist outdent indent | removeformat | help'
    };
  }

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
    this.selectedImages = [];
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.imageValidationMessage = '';
      const files = Array.from(input.files);
      let valid = true;

      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const img = new Image();
          img.onload = () => {
            const aspectRatio = img.width / img.height;
            if (aspectRatio !== 2 / 1) {
              valid = false;
              this.imageValidationMessage = 'All images must have a 2:1 aspect ratio.';
            } else {
              this.imageValidationMessage = '';
              this.selectedImages.push({
                name: file.name,
                dataUrl: e.target.result,
                size: file.size,
                width: img.width,
                height: img.height,
                extension: file.name.split('.').pop() || ''
              });
            }
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      });

      if (!valid) {
        this.selectedImages = [];
      }
    }
  }

  deleteImage(image: SelectedImage): void {
    this.selectedImages = this.selectedImages.filter(i => i !== image);
  }

  generateNewName(originalName: string): string {
    const timestamp = new Date().getTime();
    const extension = originalName.split('.').pop();
    return `${timestamp}.${extension}`;
  }

  onVideoChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const video = document.createElement('video');
        video.src = e.target.result;
        video.onloadedmetadata = () => {
          this.selectedVideo = {
            name: file.name,
            dataUrl: e.target.result,
            duration: this.formatDuration(video.duration),
            format: file.type
          };
        };
      };
      reader.readAsDataURL(file);
    }
  }

  onSubtitleChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedSubtitle = {
          name: file.name,
          dataUrl: e.target.result
        };
      };
      reader.readAsDataURL(file);
    }
  }

  onAudioChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files) {
      if (this.selectedAudios.length === 3) {
        this.audioValidationMessage = 'You can only add three audios to the table.';
      } else {
        this.audioValidationMessage = '';
        Array.from(inputElement.files).forEach(file => {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            const audio = new Audio(e.target.result);
            audio.onloadedmetadata = () => {
              this.selectedAudios.push({
                file,
                name: this.generateNewName(file.name),
                duration: this.formatDuration(audio.duration),
                dataUrl: e.target.result
              });
            };
          };
          reader.readAsDataURL(file);
        });
      }
    }
  }

  deleteAudio(audio: SelectedAudio): void {
    this.selectedAudios = this.selectedAudios.filter(a => a !== audio);
  }

  formatDuration(duration: number): string {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  onPDFChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedPDF = {
          name: file.name,
          dataUrl: e.target.result
        };
      };
      reader.readAsDataURL(file);
    }
  }

  saveImages() {
    const files = this.selectedImages.map(image => this.dataURLtoFile(image.dataUrl, image.name));
    this.filesService.uploadFiles({ images: files }).subscribe(response => {
      console.log('Images uploaded:', response);
    });
  }

  saveAudios() {
    const files = this.selectedAudios.map(audio => audio.file);
    this.filesService.uploadFiles({ audios: files }).subscribe(response => {
      console.log('Audios uploaded:', response);
    });
  }

  savePDF() {
    if (this.selectedPDF) {
      const file = this.dataURLtoFile(this.selectedPDF.dataUrl, this.selectedPDF.name);
      this.filesService.uploadFiles({ pdf: file }).subscribe(response => {
        console.log('PDF uploaded:', response);
      });
    }
  }

  saveVideo() {
    const files: { video?: File, subtitle?: File } = {};
    if (this.selectedVideo) {
      files.video = this.dataURLtoFile(this.selectedVideo.dataUrl, this.selectedVideo.name);
    }
    if (this.selectedSubtitle) {
      files.subtitle = this.dataURLtoFile(this.selectedSubtitle.dataUrl, this.selectedSubtitle.name);
    }
    this.filesService.uploadFiles(files).subscribe(response => {
      console.log('Video and subtitles uploaded:', response);
    });
  }

  saveTerms() {
    const termsContent = this.termsAndConditions;
    const blob = new Blob([termsContent], { type: 'text/html' });
    const file = new File([blob], 'terms-and-conditions.html', { type: 'text/html' });
  
    this.filesService.uploadFiles({ html: file }).subscribe(response => {
      console.log('Terms and conditions uploaded:', response);
      this.savedContent = termsContent; // Guardar el contenido del WYSIWYG en una variable
    });
  }

  private dataURLtoFile(dataUrl: string, filename: string): File {
    try {
      const arr = dataUrl.split(',');
      if (arr.length !== 2) {
        throw new Error('Invalid data URL format');
      }
      const mimeMatch = arr[0].match(/:(.*?);/);
      if (!mimeMatch) {
        throw new Error('Invalid MIME type in data URL');
      }
      const mime = mimeMatch[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    } catch (error) {
      console.error('Error converting data URL to file:', error);
      throw error;
    }
  }
}
