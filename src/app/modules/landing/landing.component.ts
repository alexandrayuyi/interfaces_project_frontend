import { Component, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';
import 'slick-carousel';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements AfterViewInit {
  slides = [
    { imageSrc: '../../../assets/images/381-800x400.jpg', caption: 'Caption Text' },
    { imageSrc: '../../../assets/images/607-800x400.jpg', caption: 'Caption Two' },
    { imageSrc: '../../../assets/images/926-800x400.jpg', caption: 'Caption Three' },
    { imageSrc: '../../../assets/images/381-800x400.jpg', caption: 'Caption Text' },
    { imageSrc: '../../../assets/images/607-800x400.jpg', caption: 'Caption Two' },
    { imageSrc: '../../../assets/images/381-800x400.jpg', caption: 'Caption Text' },
    { imageSrc: '../../../assets/images/607-800x400.jpg', caption: 'Caption Two' }
  ];

  ngAfterViewInit(): void {
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
  }
}