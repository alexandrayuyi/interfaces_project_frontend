import { Component, OnInit } from '@angular/core';
import { getNames } from 'country-list';

@Component({
  selector: 'app-country-select',
  templateUrl: './country-select.component.html',
  styleUrls: ['./country-select.component.scss']
})
export class CountrySelectComponent implements OnInit {
  countries: string[] = [];

  ngOnInit(): void {
    this.countries = getNames();  // Fetches the list of country names
  }
}
