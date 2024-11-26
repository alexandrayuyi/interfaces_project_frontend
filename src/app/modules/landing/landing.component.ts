import { Component, AfterViewInit, OnInit } from '@angular/core';
import * as $ from 'jquery';
import 'slick-carousel';
import { FilesService } from './services/files.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, AfterViewInit {
  slides: any[] = [];
  video: any;
  subs: any;
  audios: any[] = [];

  constructor(private filesService: FilesService) {}

  ngOnInit(): void {
    this.filesService.getFiles().subscribe(response => {
      const data = response.data;
      console.log(data);
      this.slides = response.data
        .filter((file: any) => file.mimetype.startsWith('image/')) // Filtrar solo imágenes
        .map((file: any) => ({
          imageSrc: `http://localhost:5000/uploads/${file.filename}` // Ajusta esto según la estructura de tu respuesta
        }));
      //get the legth of an array of videos in the response
      this.video = response.data // buscar el ultimo video subido
        .filter((file: any) => file.mimetype.startsWith('video/')) // Filtrar solo videos
        .map((file: any) => ({
          videoSrc: `http://localhost:5000/uploads/${file.filename}` // Ajusta esto según la estructura de tu respuesta
        }))[(response.data.filter((file: any) => file.mimetype.startsWith('video/')).length)-1];
      
      this.subs = response.data // buscar el ultimo video subido
        .filter((file: any) => file.mimetype.startsWith('text/vtt'))
        .map((file: any) => ({
          subsSrc: `http://localhost:5000/uploads/${file.filename}` // Ajusta esto según la estructura de tu respuesta
        }))[(response.data.filter((file: any) => file.mimetype.startsWith('text/vtt')).length)-1];
        console.log(this.subs);
      
      this.audios = response.data
      .filter((file: any) => file.mimetype.startsWith('mp3/') || file.mimetype.startsWith('audio/'))
      console.log(this.audios)
    });
  }


  ngAfterViewInit(): void {
    this.initializeSlick();
  }

  private initializeSlick(): void {
    setTimeout(() => {
      ($('.responsive') as any).slick({
        dots: false,
        arrows: false,
        infinite: false,
        autoplay: true,
        speed: 300,
        slidesToShow: 3,
        slidesToScroll: 3,
        responsive: [
          {
            breakpoint: 2000,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              infinite: true,
              arrows: false,
              autoplay: true,
              dots: false
            }
          },
          {
            breakpoint: 1400,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2
            }
          },
          {
            breakpoint: 800,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
      });
    }, 1000);
  }
}