import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, ElementRef } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  map: L.Map | undefined;
  query: string = '';
  dataDirection: any[] = []; // Store coordinates and address info
  displayDataDirection: any[] = []; // For displaying suggestions in dropdown

  // Variables to store the selected location details
  country: string = '';
  state: string = '';
  city: string = '';
  lat: string = '';
  lon: string = '';
  postcode: string = '';
  street: string = '';
  name: string = '';

  ngOnInit() {
    // Set the default path for Leaflet icons
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'assets/images/marker-icon-2x.svg',
      shadowUrl: 'assets/images/marker-shadow.svg'
    });
  }
  constructor(private http: HttpClient) {}

  ngAfterViewInit() {
    this.initializeMap();
  }

  initializeMap() {
    this.map = L.map(this.mapContainer.nativeElement).setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
  }

// Search function triggered by p-autoComplete
search(event: any) {
  const query = event.query; // Capture search input from p-autoComplete
  if (query && query.length > 0) {
    const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1&limit=5&polygon_svg=1`;
    this.http.get<any[]>(url).subscribe(data => {
      this.dataDirection = data.map(item => ({
        lat: item.lat,
        lon: item.lon,
        displayName: `${item.display_name}`,
        name: item.address?.name || '',
        state: item.address?.state || '',
        country: item.address?.country || '',
        city: item.address?.city || item.address?.town || item.address?.village || '',
        postcode: item.address?.postcode || '',
        street: item.address?.road || ''
      }));
      
      // Set displayDataDirection to include the full data object
      this.displayDataDirection = this.dataDirection.map(item => ({
        displayName: `${item.name || 'Unknown'} - ${item.state || 'Unknown'} - ${item.country || 'Unknown'}`,
        ...item  // Spread the full object to include all properties
      }));
    });
  } else {
    this.displayDataDirection = [];
  }
}

  // Move map to the selected location
moveMap(event: any) {
  console.log('Selected event:', event);  // Debug log to check structure

  const selected = event.value;  // Access the full selected item from the event
  if (selected && selected.lat && selected.lon && this.map) {
    // Convert latitude and longitude to a Leaflet LatLng object
    const latLng = L.latLng(selected.lat, selected.lon);

    // Update map view to the new location and set the zoom level
    this.map.setView(latLng, 13);

    // Add a marker for the selected location and bind a popup to it
    L.marker(latLng).addTo(this.map).bindPopup(selected.displayName).openPopup();

    // Update the component variables with the selected location details
    this.name = selected.name;
    this.state = selected.state;
    this.country = selected.country;
    this.city = selected.city;
    this.lat = selected.lat;
    this.lon = selected.lon;
    this.postcode = selected.postcode;
    this.street = selected.street;
  } else {
    console.error('Invalid selection or map is not initialized properly.');
  }
}
}
