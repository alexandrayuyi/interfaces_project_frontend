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
    ButtonComponent,
    SidebarComponent,
    NavbarComponent,
    FooterComponent,
    BottomNavbarComponent,
    ReactiveFormsModule,
    PdfViewerModule,
    EditorModule,
    FormsModule
  ],
})
export class MultimediaComponent {
  selectedPage: string = 'images'; // Default selection
  selectedImages: SelectedImage[] = [];
  selectedAudios: SelectedAudio[] = [];
  selectedPDF: SelectedPDF | null = null;
  selectedVideo: SelectedVideo | null = null;
  selectedSubtitle: SelectedSubtitle | null = null;
  termsAndConditions: string = '';

  editorConfig = {
    plugins: [
      'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace',
      'table', 'visualblocks', 'wordcount', 'checklist', 'mediaembed', 'casechange', 'export', 'formatpainter',
      'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode',
      'editimage', 'advtemplate', 'ai', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags',
      'autocorrect', 'typography', 'inlinecss', 'markdown', 'importword', 'exportword', 'exportpdf'
    ],
    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table ' +
             'mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | ' +
             'checklist numlist bullist indent outdent | emoticons charmap | removeformat',
    tinycomments_mode: 'embedded',
    tinycomments_author: 'Author name',
    mergetags_list: [
      { value: 'First.Name', title: 'First Name' },
      { value: 'Email', title: 'Email' },
    ],
    ai_request: (_request: any, respondWith: any) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
    exportpdf_converter_options: { format: 'Letter', margin_top: '1in', margin_right: '1in', margin_bottom: '1in', margin_left: '1in' },
    exportword_converter_options: { document: { size: 'Letter' } },
    importword_converter_options: { formatting: { styles: 'inline', resets: 'inline', defaults: 'inline' } }
  };

  imageValidationMessage: string = '';
  audioValidationMessage: string = '';

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
      if (inputElement.files.length !== 3) {
        this.audioValidationMessage = 'Please select exactly three audio files.';
        this.selectedAudios = [];
      } else {
        this.audioValidationMessage = '';
        this.selectedAudios = [];
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
    // Implement your save logic here
    console.log('Images saved:', this.selectedImages);
  }

  saveAudios() {
    // Implement your save logic here
    console.log('Audios saved:', this.selectedAudios);
  }

  savePDF() {
    // Implement your save logic here
    console.log('PDF saved');
  }

  saveVideo() {
    if (this.selectedSubtitle) {
      console.log('Video and subtitles saved:', this.selectedVideo, this.selectedSubtitle);
    } else {
      console.log('Video saved:', this.selectedVideo);
    }
  }

  saveTerms(){
    console.log('Terms saved:', this.termsAndConditions);
  }

}