import { Component, OnInit } from '@angular/core';
import { FilesService } from '../../services/files.service'; // Asegúrate de ajustar la ruta según sea necesario

@Component({
  standalone: true,
  imports: [],
  selector: 'app-tangram3d',
  templateUrl: './tangram3d.component.html',
  styleUrl: './tangram3d.component.css'
})
export class Tangram3dComponent implements OnInit {
  audios: any[] = [];

  constructor(private filesService: FilesService) {}

  ngOnInit(): void {
    this.filesService.getFiles().subscribe(response => {
      this.audios = response.data
        .filter((file: any) => file.mimetype.startsWith('audio/')); // Filtrar solo archivos de audio

      console.log(this.audios);
    });
  }
}