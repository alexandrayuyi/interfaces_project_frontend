import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  slides = [
    { imageSrc: '../../../assets/images/381-800x400.jpg', caption: 'Caption Text' },
    { imageSrc: '../../../assets/images/607-800x400.jpg', caption: 'Caption Two' },
    { imageSrc: '../../../assets/images/926-800x400.jpg', caption: 'Caption Three' }
  ];

  activeIndex = 0;

  ngOnInit() {
    this.showSlides(this.activeIndex); // Initialize to show the first slide
  }

  // Increment/decrement the slide index by n
  plusSlides(n: number) {
    let newIndex = this.activeIndex + n;
    if (newIndex >= this.slides.length) {
      newIndex = 0; // Wrap back to first slide if at the end
    } else if (newIndex < 0) {
      newIndex = this.slides.length - 1; // Wrap back to last slide if before the first one
    }
    this.showSlides(newIndex);
  }

  // Show the selected slide
  currentSlide(n: number) {
    this.showSlides(n - 1); // `n` is 1-based, so subtract 1 for the correct index
  }

  showSlides(index: number) {
    this.activeIndex = index;
  }
}