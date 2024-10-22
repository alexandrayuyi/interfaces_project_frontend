import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { getNames } from 'country-list';
@Component({
  selector: 'app-country-select',
  templateUrl: './country-select.component.html',
  styleUrls: ['./country-select.component.scss']
})
export class CountrySelectComponent implements OnInit {
  countries: string[] = [];


  @Output() scroll = new EventEmitter<Event>();

  ngOnInit(): void {
    this.countries = getNames();  // Fetches the list of country names
  }

  onScroll(event: Event): void {
    this.scroll.emit(event);  // Emit scroll event to parent
  }
}