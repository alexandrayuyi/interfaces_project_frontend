import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ApiService } from './services/api.service'; // Adjust the path as necessary

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  map: L.Map | undefined;
  query: string = '';
  dataDirection: any[] = [];
  displayDataDirection: any[] = [];

  // Variables to store the selected location details
  country: string = '';
  state: string = '';
  city: string = '';
  lat: string = '';
  lon: string = '';
  postcode: string = '';
  street: string = '';
  name: string = '';

  // Variables for profile fields
  firstname: string = '';
  lastname: string = '';
  birthdate: Date | undefined;
  gender: string = '';
  phoneNumber: string = '';
  profilePicture: File | undefined;
  username: string = '';
  password: string = '';
  email: null | string = null;

  ngOnInit() {
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'assets/images/marker-icon-2x.svg',
      shadowUrl: 'assets/images/marker-shadow.svg'
    });
  }

  constructor(private http: HttpClient, private apiService: ApiService) {}

  ngAfterViewInit() {
    this.initializeMap();
  }

  initializeMap() {
    this.map = L.map(this.mapContainer.nativeElement).setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
  }

  search(event: any) {
    const query = event.query;
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
        this.displayDataDirection = this.dataDirection.map(item => ({
          displayName: `${item.name || 'Unknown'} - ${item.state || 'Unknown'} - ${item.country || 'Unknown'}`,
          ...item
        }));
      });
    } else {
      this.displayDataDirection = [];
    }
  }

  moveMap(event: any) {
    const selected = event.value;
    if (selected && selected.lat && selected.lon && this.map) {
    const latLng = L.latLng(selected.lat, selected.lon);

    // Update map view to the new location and set the zoom level
    this.map.setView(latLng, 13);

    // Add a marker for the selected location and bind a popup to it
    L.marker(latLng).addTo(this.map).bindPopup(selected.displayName).openPopup();

    // Update the component variables with the selected location details

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

  // Method to handle form submission
  saveProfile() {
    const updatedFields = {
      firstname: this.firstname,
      lastname: this.lastname,
      birthdate: this.birthdate,
      gender: this.gender,
      country: this.country,
      email: this.email,
      password: this.password,
      address: {
        name: this.name,
        state: this.state,
        country: this.country,
        city: this.city,
        lat: parseFloat(this.lat),
        lon: parseFloat(this.lon),
        postcode: parseInt(this.postcode),
        street: this.street
      }
    };

    // Example id; replace with the actual profile id
    const profileId = 10;

    this.updateProfile(profileId, updatedFields);
  }

  updateProfile(id: number, updatedFields: any) {
    this.apiService.patchProfile(id, updatedFields).subscribe(
      (response: any) => {
        console.log('Profile updated successfully:', response);
      },
      (error: any) => {
        console.error('Error updating profile:', error);
      }
    );
  }
}
