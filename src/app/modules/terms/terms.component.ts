import { Component, OnInit } from '@angular/core';
import { FilesService } from '../landing/services/files.service'; // Asegúrate de ajustar la ruta según sea necesario

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {
  htmlContent: string = '';

  constructor(private filesService: FilesService) {}

  ngOnInit(): void {

    this.filesService.getFiles().subscribe(response => {
      const htmlFiles = response.data
        .filter((file: any) => file.mimetype === 'text/html') // Filtrar solo archivos HTML

      if (htmlFiles.length > 0) {
        const lastHtmlFile = htmlFiles[htmlFiles.length -1];
        this.htmlContent = lastHtmlFile.content; // Asumimos que el contenido está en la propiedad 'content'
        this.htmlContent = localStorage.getItem('terms') || '';
      }
    });
  }
}