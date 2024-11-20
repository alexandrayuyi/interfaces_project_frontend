import { Component, OnInit } from '@angular/core';
import { FilesService } from '../landing/services/files.service';

@Component({
  selector: 'app-user-guide',
  templateUrl: './user-guide.component.html',
  styleUrl: './user-guide.component.scss'
})
export class UserGuideComponent implements OnInit {
  pdfSrc: string = '';

  constructor(private filesService: FilesService) {}

  ngOnInit(): void {
    this.filesService.getFiles().subscribe(response => {
      const pdfFile = response.data
        .filter((file: any) => file.mimetype === 'application/pdf') // Filtrar solo PDFs
        .map((file: any) => ({
          pdfSrc: `http://localhost:5000/uploads/${file.filename}` // Ajusta esto según la estructura de tu respuesta
        }))[0]; // Asumimos que solo hay un PDF

      if (pdfFile) {
        this.pdfSrc = pdfFile.pdfSrc;
      }
      console.log(this.pdfSrc);
    });
  }
}