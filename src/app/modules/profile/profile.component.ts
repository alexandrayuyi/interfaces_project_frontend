import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  myMap: any;
  markers: any[] = [];
  query: string = '';
  dataDirection: any[] = [];
  displayDataDirection: any[] = [];

  ngOnInit() {
    this.initializeMap();
  }

  initializeMap() {
    this.myMap = L.map(this.mapContainer.nativeElement).setView([10.2363953, -67.9649982], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: ['a', 'b', 'c'],
      detectRetina: true
    }).addTo(this.myMap);

    this.myMap.on('click', (e: any) => {
      this.removeExistingMarkers();
      this.addNewMarker(e.latlng);
      this.reverseSearch(e.latlng.lat, e.latlng.lng);
    });
  }

  search() {
    const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${this.query}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        this.dataDirection = data.map((item: any) => {
          return { lat: item.lat, lon: item.lon };
        });
        this.displayDataDirection = data.map((item: any) => {
          const address = item.address;
          const locationComponents = ['city', 'state', 'county', 'province'];
          const location = locationComponents.find(component => address[component] !== undefined);
          return location ? `${address[location]}, ${address['country']}` : `${address['country']}`;
        });
      });
  }

  moveMap(event: any) {
    const latlng = { lat: this.dataDirection[0].lat, lon: this.dataDirection[0].lon };
    this.myMap.setView([latlng.lat, latlng.lon], 13);
    this.removeExistingMarkers();
    this.addNewMarker(latlng);
  }

  reverseSearch(lat: number, lon: number) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log(data.address);
      });
  }

  removeExistingMarkers() {
    this.markers.forEach(marker => this.myMap.removeLayer(marker));
    this.markers = [];
  }

  addNewMarker(latlng: { lat: number, lon: number }) {
    const marker = L.marker([latlng.lat, latlng.lon]);
    marker.addTo(this.myMap);
    this.markers.push(marker);
  }
}