import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { ApiService } from './services/api.service'; // Ajusta la ruta según sea necesario

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  map: L.Map | undefined;
  query: string = '';
  dataDirection: any[] = [];
  displayDataDirection: any[] = [];

  // Variables para almacenar los detalles de la ubicación seleccionada
  country: string = '';
  state: string = '';
  city: string = '';
  lat: string = '';
  lon: string = '';
  postcode: string = '';
  street: string = '';
  name: string = '';

  // Variables para los campos del perfil
  firstname: string = '';
  lastname: string = '';
  birthdate: Date | undefined;
  gender: string = '';
  phone: string = '';
  profilePicture: File | undefined;
  username: string = '';
  password: string = '';
  email: null | string = null;

  isEditing: boolean = false; // Variable para controlar el modo de edición

  constructor(private http: HttpClient, private apiService: ApiService) {}

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
      this.map.setView(latLng, 13);
      L.marker(latLng).addTo(this.map).bindPopup(selected.displayName).openPopup();

      // Actualiza las variables del componente con los detalles de la ubicación seleccionada
      this.name = selected.name || '';
      this.state = selected.state || '';
      this.country = selected.country || '';
      this.city = selected.city || '';
      this.lat = selected.lat || '';
      this.lon = selected.lon || '';
      this.postcode = selected.postcode || '';
      this.street = selected.street || '';
    } else {
      console.error('Invalid selection or map is not initialized properly.');
    }
  }

  // Método para manejar el botón de editar
  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  // Método para manejar el envío del formulario
  saveProfile() {
    const formData = new FormData();

    if (this.firstname) formData.append('firstname', this.firstname);
    if (this.lastname) formData.append('lastname', this.lastname);
    if (this.birthdate) formData.append('birthdate', this.birthdate.toISOString());
    if (this.gender) formData.append('gender', this.gender);
    if (this.phone) formData.append('phone', this.phone);
    if (this.username) formData.append('username', this.username);
    if (this.email) formData.append('email', this.email);
    if (this.password) formData.append('password', this.password);
    if (this.profilePicture) formData.append('profilePicture', this.profilePicture);

    const address: any = {};
    if (this.name) address.name = this.name;
    if (this.state) address.state = this.state;
    if (this.country) address.country = this.country;
    if (this.city) address.city = this.city;
    if (this.lat) address.lat = this.lat;
    if (this.lon) address.lon = this.lon;
    if (this.postcode) address.postcode = this.postcode;
    if (this.street) address.street = this.street;

    if (Object.keys(address).length > 0) {
      formData.append('address', JSON.stringify(address));
    }

    const profileId = localStorage.getItem('userid');

    if (profileId) {
      this.apiService.patchProfile(Number(profileId), formData).subscribe(
        (response: any) => {
          console.log('Profile updated successfully:', response);
          this.isEditing = false; // Salir del modo de edición
        },
        (error: any) => {
          console.error('Error updating profile:', error);
        }
      );
    } else {
      console.error('Profile ID is null or undefined.');
    }
  }

  // Método para manejar la selección de la imagen de perfil
  onProfilePictureChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.profilePicture = file;
    }
  }

  startEditing(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    this.isEditing = true;
  }
}
