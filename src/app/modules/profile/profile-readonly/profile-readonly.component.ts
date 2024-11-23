import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service'; // Importa ApiService

interface UserProfile {
  firstname: string;
  lastname: string;
  birthdate: Date;
  gender: string;
  phone: string;
  email: string;
  imagePath: string;
  timezone: string;
  user: {
    username: string;
    password: string;
    createdAt: Date;
    email: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postcode: string;
    lat: string;
    lon: string;
    name: string;
  };
}

@Component({
  selector: 'app-profile-readonly',
  templateUrl: './profile-readonly.component.html',
  styleUrls: ['./profile-readonly.component.scss']
})
export class ProfileReadonlyComponent implements OnInit {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  map: L.Map | undefined;

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
  profilePicture: string = ''; // URL of the profile picture
  username: string = '';
  password: string = '';
  createdAt: string = '';
  email: null | string = null;
  timezone: string = '';

  constructor(private router: Router, private apiService: ApiService) {}

  ngOnInit() {
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'assets/images/marker-icon-2x.svg',
      shadowUrl: 'assets/images/marker-shadow.svg'
    });

    // Get user ID from localStorage
    const userId = localStorage.getItem('userid');
    if (userId) {
      this.apiService.getProfile(userId).subscribe((profile: UserProfile) => {
        this.firstname = profile.firstname;
        this.lastname = profile.lastname;
        this.birthdate = profile.birthdate;
        this.gender = profile.gender;
        this.phone = profile.phone;
        this.email = profile.user.email;
        this.profilePicture = 'http://localhost:5000/' + profile.imagePath.replace(/\\/g, '/');
        console.log(this.profilePicture);
        console.log('http://localhost:5000/' + profile.imagePath);
        this.timezone = profile.timezone;
        this.username = profile.user.username;
        this.password = profile.user.password;
        this.createdAt = new Date(profile.user.createdAt).toLocaleString();
        this.street = profile.address.street;
        this.city = profile.address.city;
        this.state = profile.address.state;
        this.country = profile.address.country;
        this.postcode = profile.address.postcode;
        this.lat = profile.address.lat;
        this.lon = profile.address.lon;
        this.name = profile.address.name;

        // Initialize map with the user's location
        this.initializeMap();
      });
    }
  }

  initializeMap() {
    this.map = L.map(this.mapContainer.nativeElement).setView([parseFloat(this.lat), parseFloat(this.lon)], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
  }

  editProfile() {
    this.router.navigate(['/profile']);
  }
}
