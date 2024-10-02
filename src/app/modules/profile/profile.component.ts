import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { ApiService } from './services/api.service'; // Adjust the path as necessary
import { Router } from '@angular/router';

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
  phone: string = '';
  profilePicture: File | undefined;
  username: string = '';
  password: string = '';
  email: null | string = null;
  timezone: string = '';

  constructor(private http: HttpClient, private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'assets/images/marker-icon-2x.svg',
      shadowUrl: 'assets/images/marker-shadow.svg'
    });
  }

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
        console.log('Data direction:', this.dataDirection);
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

  // Método para manejar la selección del archivo de imagen
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.profilePicture = file;
    }
    console.log('Selected file:', this.profilePicture);
  }

  saveProfile() {
    const formData = new FormData();

    if (this.firstname) {
      formData.append('firstname', this.firstname);
    }
    if (this.lastname) {
      formData.append('lastname', this.lastname);
    }

    // Convert birthdate to ISO string if it's a valid date
    const birthdateValue = this.birthdate;
    if (birthdateValue) {
      const birthdate = new Date(birthdateValue);
      if (!isNaN(birthdate.getTime())) {
        formData.append('birthdate', birthdate.toISOString());
      } else {
        console.error('Invalid birthdate');
      }
    }

    if (this.gender) {
      formData.append('gender', this.gender);
    }
    if (this.phone) {
      formData.append('phone', this.phone.toString());
    }
    if (this.email) {
      formData.append('email', this.email);
    }
    if (this.password) {
      formData.append('password', this.password);
    }
    if (this.timezone) {
      formData.append('timezone', this.timezone);
    }

    const address = {
      name: this.displayDataDirection.length > 0 ? this.displayDataDirection[0].displayName : '',
      state: this.state,
      country: this.country,
      city: this.city,
      lat: this.lat,
      lon: this.lon,
      postcode: this.postcode,
      street: this.displayDataDirection.length > 0 ? this.displayDataDirection[0].displayName : '',
    };

    // Only append address if at least one field is not empty
    if (Object.values(address).some(value => value)) {
      formData.append('address', JSON.stringify(address));
    }

    if (this.profilePicture) {
      formData.append('image', this.profilePicture);
    }

    const profileId = localStorage.getItem('userid');

    if (profileId) {
      this.updateProfile(Number(profileId), formData);
    } else {
      console.error('Profile ID is null or undefined.');
    }
    console.log('Sending birthdate:', this.birthdate);
  }

  updateProfile(id: number, formData: FormData) {
    this.apiService.patchProfile(id, formData).subscribe(
      (response: any) => {
        console.log('Perfil actualizado exitosamente:', response);
        this.router.navigate(['/profile/readonly']);
      },
      (error: any) => {
        console.error('Error al actualizar el perfil:', error);
      }
    );
  }
}
