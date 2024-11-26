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
  id: string;
  name: string;
  dataUrl: string;
  size: number;
  extension: string;
}

interface SelectedAudio {
  id: string;
  index: number;
  file: File;
  name: string;
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
  dbAudios: any[] = [];
  tableAudios: any[] = [];
  selectedPDF: SelectedPDF | null = null;
  selectedVideo: SelectedVideo | null = null;
  selectedSubtitle: SelectedSubtitle | null = null;
  termsAndConditions: string = '';
  savedContent: string = '';
  dbImages: any[] = [];
  tableImages: any[] = [];
  data: any[] = [];

  imageValidationMessage: string = '';
  audioValidationMessage: string = '';

  editorConfig: any; // Define la propiedad editorConfig

  showModal: boolean = false;
  showSaveModal: boolean = false;
  imageToDelete: SelectedImage | null = null;
  audioToDelete: SelectedAudio | null = null;
i: number = 0;

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

    this.filesService.getFiles().subscribe(response => {
      this.data = response.data;
      this.dbImages = response.data
        .filter((file: any) => file.mimetype.startsWith('image/')) // Filtrar solo imágenes
        //create an image object
        .map((file: any) => ({
          id: file.id,
          name: file.filename,
          dataUrl: `http://localhost:5000/uploads/${file.filename}`,
          size: file.size,
          extension: file.filename.split('.').pop() || ''
        }));
        //push dbImages to selectedImages
        this.tableImages.push(...this.dbImages);

      this.dbAudios = response.data
        .filter((file: any) => file.mimetype.startsWith('audio/')) // Filtrar solo audios
        .map((file: any) => ({
          id: file.id,
          name: file.filename,
          index: file.audioIndex,
          duration: '00:00',
          dataUrl: `http://localhost:5000/uploads/${file.filename}`
        }));
        //sort the elements by audioIndex
        this.tableAudios.push(...this.dbAudios.sort((a, b) => a.index - b.index));
  });
}

  onSelectChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedPage = selectElement.value;
  }

  onImageChange(event: Event): void {
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
                id: Math.floor(Math.random() * 1000).toString(),
                name: file.name,
                dataUrl: e.target.result,
                size: file.size,
                extension: file.name.split('.').pop() || ''
              });
              this.tableImages.push({
                id: Math.floor(Math.random() * 1000).toString(),
                name: file.name,
                dataUrl: e.target.result,
                size: file.size,
                extension: file.name.split('.').pop() || ''
              });
            }
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      });

      if (!valid) {
      }
    }
  }

  deleteImage(image: SelectedImage): void {

    this.selectedImages = this.selectedImages.filter(i => i !== image);
    this.tableImages = this.tableImages.filter(i => i !== image);
    this.filesService.deleteFile(image.id).subscribe(response => {
      console.log('Image deleted:', response);
    });
  }

  openDeleteModalIMG(image: SelectedImage): void {
    this.imageToDelete = image;
    this.showModal = true;
  }

  openDeleteModalAudio(audio: SelectedAudio): void {
    this.audioToDelete = audio;
    this.showModal = true;
  }

  openDeleteModal(): void {
    this.showModal = true;
  }

  cancelDelete(): void {
    this.showModal = false;
  }

  confirmDeleteSub(): void {
    this.deleteSub();
    this.showModal = false;
  }

  cancelDeleteIMG(): void {
    this.showModal = false;
    this.imageToDelete = null;
  }

  cancelDeleteAudio(): void {
    this.showModal = false;
    this.audioToDelete = null;
  }

  confirmDeleteIMG(): void {
    if (this.imageToDelete) {
      this.selectedImages = this.selectedImages.filter(i => i !== this.imageToDelete);
      this.tableImages = this.tableImages.filter(i => i !== this.imageToDelete);
      this.filesService.deleteFile(this.imageToDelete.id).subscribe(response => {
        console.log('Image deleted:', response);
      });
      this.cancelDeleteIMG();
    }
  }

  confirmDeleteAudio(): void {
    if (this.audioToDelete) {
      this.selectedAudios = this.selectedAudios.filter(a => a !== this.audioToDelete);
      this.tableAudios = this.tableAudios.filter(a => a !== this.audioToDelete);
      this.filesService.deleteFile(this.audioToDelete.id).subscribe(response => {
        console.log('Audio deleted:', response);
      });
      this.cancelDeleteAudio();
  }
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
        this.i ++;
        this.audioValidationMessage = '';
        Array.from(inputElement.files).forEach(file => {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            const audio = new Audio(e.target.result);
            audio.onloadedmetadata = () => {
              this.selectedAudios.push({
                index: 1,
                id: Math.floor(Math.random() * 1000).toString(),
                file,
                name: file.name,
                dataUrl: e.target.result
              });
              this.tableAudios.push({
                file,
                name: file.name,
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
    this.fshowSaveModal();
  }

  saveAudios() {
    const files = this.selectedAudios.map(audio => audio.file);
    this.filesService.uploadFiles({ audios: files }).subscribe(response => {
      console.log('Audios uploaded:', response);
    });
    this.fshowSaveModal();
  }

  savePDF() {
    if (this.selectedPDF) {
      const file = this.dataURLtoFile(this.selectedPDF.dataUrl, this.selectedPDF.name);
      this.filesService.uploadFiles({ pdf: file }).subscribe(response => {
        console.log('PDF uploaded:', response);
      });
      this.fshowSaveModal();
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
    this.fshowSaveModal();
  }

  deleteSub(){
    //show modal to confirm delete
    this.showModal = true;
    const files = this.data.filter((file: any) => file.mimetype.startsWith('text/vtt'));
    //delete the files from the database
    files.forEach((file: any) => {
      this.filesService.deleteFile(file.id).subscribe(response => {
        console.log('Subtitle deleted:', response);
      });
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
    this.fshowSaveModal();
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

  fshowSaveModal(){
    this.showSaveModal = true;
  }

  closeSaveModal(){
    this.showSaveModal = false;
  }
}
