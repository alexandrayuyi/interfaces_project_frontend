import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, ElementRef,HostListener,AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { getNames } from 'country-list';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  // Define a 2D array for rows and columns (11 rows, 8 columns)
  counters: number[][] = Array(12).fill(null).map(() => Array(8).fill(0));
  fields: string[] = ['First Name', 'Last Name', 'Birthdate', 'Gender', 'Phone Number', 'Profile Picture', 'Username', 'Password',
  'Email', 'Location', 'Country of Nationality', 'Save'
  ];

  // Function to increment the counter
  incrementCounter(rowIndex: number, colIndex: number) {
    this.counters[rowIndex][colIndex]++;
  }

  query2: string = '';
  displayDataDirection2: any[] = getNames().map(name => ({ displayName: name }));

  // Initialize country names
  private countries = getNames().map(name => ({ displayName: name }));

  search2(event: any) {
    const query = event.query.toLowerCase(); // Capture search input from p-autoComplete
    if (query && query.length > 0) {
      // Filter country names based on the query and limit the results to 5
      this.displayDataDirection2 = this.countries.filter(country =>
        country.displayName.toLowerCase().includes(query)
      ).slice(0, 5);
    } else {
      // Clear suggestions if query is empty
      this.displayDataDirection2 = [];
    }
  }

  @ViewChild('scrollableDiv') scrollableDiv!: ElementRef;

  // General function to increment the counter for any cell
  handleEvent(rowIndex: number, colIndex: number) {
    this.counters[rowIndex][colIndex]++;
    console.log(`Counter updated for row ${rowIndex}, column ${colIndex}`);
  }

keyPressCount = 0;
clickCount = 0;
scrollCount = 0;
drawCount = 0;
datePickerCount = 0;
focusCount = 0;
systemResponseCount = 0;
switchingInputCount = 0; // Counter for H (hand movement)

handleKeyDown(event: KeyboardEvent) {
  this.keyPressCount++;
  this.switchingInputCount++;
  console.log('Key pressed:', event.key);
}

handleFocus(rowIndex: number) {
  this.counters[rowIndex][3]++;
  this.counters[rowIndex][2]++;
  console.log('Focus event detected');
}

handleClick(event: MouseEvent) {
  this.clickCount++;
  this.switchingInputCount++;
  console.log('Mouse clicked at:', event.clientX, event.clientY);
}

handleScroll(event: any) {
  this.scrollCount++;
  console.log('Scroll event detected');
}

handleDrag(event: any) {
  this.drawCount++;
  console.log('Drag event detected');
}

handleAutocompleteSelection(rowIndex: number) {
  this.counters[rowIndex][7]++;
  this.counters[rowIndex][0]++;
  console.log('Autocomplete item selected:', event);
}

handleSaveClick() {
  this.counters[11][7]++;
  this.counters[11][4]++;
  console.log('Save button clicked');
}

  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  map: L.Map | undefined;
  query: string = '';
  dataDirection: any[] = []; // Store coordinates and address info
  displayDataDirection: any[] = []; // For displaying suggestions in dropdown
  currentMarker: L.Marker | undefined; // To store the active marker

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
    // Listen to the scroll event on the specific container
    // this.scrollableDiv.nativeElement.addEventListener('scroll', this.handleScroll.bind(this));
  }

  initializeMap() {
    this.map = L.map(this.mapContainer.nativeElement).setView([0, 0], 2);
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
    
    // Add event listeners for click, dragend, and zoom inside the Leaflet map
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      
      console.log('Map clicked at:', e.latlng);
    });
    
    this.map.on('dragend', (e: L.LeafletEvent) => {
      this.counters[9][6]++;
      this.counters[9][7]++;
      console.log('Map drag ended at:', this.map?.getCenter()); // Get the center of the map after dragging
    });
    
    this.map.on('zoom', (e: L.LeafletEvent) => {
      this.counters[9][5]++;
      this.counters[9][7]++;
      console.log('Map zoomed to level:', this.map?.getZoom());
    });
  }


// Search function triggered by p-autoComplete
search(event: any) {
  const query = event.query; // Capture search input from p-autoComplete
  if (query && query.length > 0) {
    const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1&limit=3&polygon_svg=1`;
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

// Move map to the selected location and ensure only one marker is displayed
moveMap(event: any) {
  const selected = event.value;
  if (selected && selected.lat && selected.lon && this.map) {
    const latLng = L.latLng(selected.lat, selected.lon);

    // Update map view to the new location
    this.map.setView(latLng, 13);

    // Remove the existing marker if it exists
    if (this.currentMarker) {
      this.map.removeLayer(this.currentMarker);
    }

    // Add a new marker for the selected location
    this.currentMarker = L.marker(latLng).addTo(this.map)
      .bindPopup(selected.displayName)
      .openPopup();

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
