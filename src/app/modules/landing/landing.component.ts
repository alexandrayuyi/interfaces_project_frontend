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

  constructor(private filesService: FilesService) {}

  ngOnInit(): void {
    this.filesService.getFiles().subscribe(response => {
      this.slides = response.data
        .filter((file: any) => file.mimetype.startsWith('image/')) // Filtrar solo imágenes
        .map((file: any) => ({
          imageSrc: `http://localhost:5000/uploads/${file.filename}` // Ajusta esto según la estructura de tu respuesta
        }));
      console.log(this.slides);
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