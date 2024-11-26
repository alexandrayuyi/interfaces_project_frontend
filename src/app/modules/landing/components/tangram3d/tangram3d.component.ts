import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilesService } from '../../services/files.service'; // Asegúrate de ajustar la ruta según sea necesario

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-tangram3d',
  templateUrl: './tangram3d.component.html',
  styleUrls: ['./tangram3d.component.css']
})
export class Tangram3dComponent implements OnInit {
  audios: any[] = [];

  constructor(private filesService: FilesService) {}

  ngOnInit(): void {
    this.filesService.getFiles().subscribe(response => {
      this.audios = response.data
        .filter((file: any) => file.mimetype.startsWith('audio/')); // Filtrar solo archivos de audio

      console.log(this.audios);

      // Set audio sources
      this.audios.forEach((audio, index) => {
        const audioElement = document.getElementById(`audio-${audio.audioIndex}`) as HTMLAudioElement;
        if (audioElement) {
          audioElement.src = `http://localhost:5000/${audio.path}`;
        }
      });

      // Attempt to play audios automatically
      this.playAudiosInSequence();
    });
  }

  playAudiosInSequence(): void {
    let index = 0;

    const playNextAudio = () => {
      if (index < this.audios.length) {
        const audioElement = document.getElementById(`audio-${this.audios[index].audioIndex}`) as HTMLAudioElement;
        if (audioElement) {
          audioElement.play().then(() => {
              setTimeout(() => {
                index++;
                if (index >= this.audios.length) {
                  index = 0; // Reiniciar el índice para reproducir en bucle
                }
                playNextAudio();
              }, 2000); // Esperar 2 segundos antes de reproducir el siguiente audio
          }).catch(error => {
            console.error('Audio playback failed:', error);
            // Handle the error (e.g., show a message to the user)
          });
        }
      }
    };

    playNextAudio();
  }
}