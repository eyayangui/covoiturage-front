import { Component, OnInit } from '@angular/core';
import { RouteService } from '../../services/Route/route.service';
import { RouteP } from 'src/app/Models/RouteP';
import * as Leaflet from 'leaflet'; // Import de Leaflet
import 'leaflet-control-geocoder';
import { AnnouncementDriverService } from 'src/app/services/announcement/announcement-driver.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClaimService } from 'src/app/services/Claim/claim.service';
import { AnnouncementDriver } from 'src/app/Models/AnnouncementDriver';
import Swal from 'sweetalert2';
import 'leaflet-routing-machine'; 
import { ActivatedRoute } from '@angular/router';

 

Leaflet.Icon.Default.imagePath = 'assets/';




@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit{ 
  map!: Leaflet.Map;
  selectedRayon: string = '';
  routeControl: any;
  route: Leaflet.Polyline | undefined;
  geocoder: any;
  addForm: FormGroup;
  markers: Leaflet.Marker[] = [];
  departureAddress: string | undefined;
  destinationAddress: string | undefined;
  assemblyPoints: string[] = [];
  annoncements: AnnouncementDriver[] = [];
  routeIDToUpdate: number | undefined; 
  isLoggedIn: boolean = false;
  assemblyPointId: number | undefined;
  today: string = new Date().toISOString().split('T')[0]; 


  options = {
    layers: [
      Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      })
    ],
    zoom: 6,
    center: { lat: 0, lng: 0 }
  };

  constructor(private routeService: RouteService,private announcementDriverService: AnnouncementDriverService, 
    private router: Router, private fb: FormBuilder,private routeA: ActivatedRoute,
   

    private claimService: ClaimService ){
      this.addForm = this.fb.group({
        rayon: ['', Validators.required],
        dateCovoiturage: ['', Validators.required],
        nbrPlaces: ['', Validators.required],
        prix: ['', Validators.required],
        aller_Retour: [false, Validators.required],
        heureDepart: ['', Validators.required],
        heureRetour: [],
        bagage: [false],
        fumer: [false],
        music: [false],
        datePublication: [],
        routeID: []
      });}
      ngOnInit(): void {
        // Récupérer l'ID de la route à partir des paramètres de la route
        this.routeA.params.subscribe(params => {
            this.routeIDToUpdate = params['routeID'];
        });
    }
      initMarkers() {
        const initialMarkers = [
          {
            position: { lat: 33.892166, lng: 9.561555 },
            draggable: true
          },
        ];
        for (let index = 0; index < initialMarkers.length; index++) {
          const data = initialMarkers[index];
          const marker = this.generateMarker(data, index);
          marker.addTo(this.map).bindPopup(`<b>${data.position.lat}, ${data.position.lng}</b>`);
          this.map.panTo(data.position);
          this.markers.push(marker);
        }
      }
    

  generateMarker(data: any, index: number) {
    return Leaflet.marker(data.position, { draggable: data.draggable })
      .on('click', (event) => this.markerClicked(event, index))
      .on('dragend', (event) => this.markerDragEnd(event, index));
  }
  

  onMapReady($event: Leaflet.Map) {
    this.map = $event;
    this.initMarkers();
    this.addDeparture();
    this.addDestination();
    this.addAssemblyPoints();
    this.locateUser();
  }


  async mapClicked($event: any) {
    console.log($event.latlng.lat, $event.latlng.lng);
    try {
      const address = await this.getAddress($event.latlng.lat, $event.latlng.lng);
      console.log(address);

      const data = {
        position: { lat: $event.latlng.lat, lng: $event.latlng.lng },
        draggable: true
      };
      const marker = this.generateMarker(data, this.markers.length);
      marker.addTo(this.map).bindPopup(`<b>${address}</b>`).openPopup();
      this.markers.push(marker);
      this.drawRouteBetweenPoints(); // Draw route after adding marker
    } catch (error) {
      console.error('Address not found');
    }
  }
  

  
  markerClicked($event: any, index: number) {
    console.log($event.latlng.lat, $event.latlng.lng);
    this.removeMarker(this.markers[index], index);
  }

  markerDragEnd($event: any, index: number) {
    console.log($event.target.getLatLng());
    const newLatLng = $event.target.getLatLng();
    this.markers[index].setLatLng(newLatLng);
    
  }

  removeMarker(marker: Leaflet.Marker, index: number) {
    this.map.removeLayer(marker);
    this.markers.splice(index, 1);
   
  }

  
 addDeparture() {
  const geocoder = (Leaflet.Control as any).geocoder({
    defaultMarkGeocode: false
  }).on('markgeocode', (e: any) => {
    const latlng = e.geocode.center;
    const address = e.geocode.name;

    const marker = Leaflet.marker(latlng).addTo(this.map);
    marker.bindPopup(address).openPopup();

    marker.on('click', () => {
      this.map.removeLayer(marker);
      this.departureAddress = undefined; // Optionally reset the departure address
      this.markers = this.markers.filter(m => m !== marker);
      this.drawRouteBetweenPoints(); // Update route after removing marker
    });

    this.map.panTo(latlng);
    this.departureAddress = address;
    this.markers.push(marker);

    // Draw the route if both departure and destination are set
    this.drawRouteBetweenPoints();
  }).addTo(this.map);
}

addAssemblyPoints() {
  const geocoder = (Leaflet.Control as any).geocoder({
    defaultMarkGeocode: false
  }).on('markgeocode', (e: any) => {
    const latlng = e.geocode.center;
    const address = e.geocode.name;

    const marker = Leaflet.marker(latlng).addTo(this.map);
    marker.bindPopup(address).openPopup();

    marker.on('click', () => {
      this.map.removeLayer(marker);
      this.assemblyPoints = this.assemblyPoints.filter(point => point !== address);
      this.markers = this.markers.filter(m => m !== marker);
      this.drawRouteBetweenPoints(); // Update route after removing marker
    });

    this.map.panTo(latlng);
    this.assemblyPoints.push(address);
    this.markers.push(marker);

    this.drawRouteBetweenPoints();
  }).addTo(this.map);
}

addDestination() {
  const redIcon = Leaflet.icon({
    iconUrl: 'assets/marker-icon-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'assets/marker-shadow.png',
    shadowSize: [41, 41]
  });
  const geocoder = (Leaflet.Control as any).geocoder({
    defaultMarkGeocode: false
  }).on('markgeocode', (e: any) => {
    const latlng = e.geocode.center;
    const address = e.geocode.name;

    const marker = Leaflet.marker(latlng).addTo(this.map);
    marker.bindPopup(address).openPopup();

    marker.on('click', () => {
      this.map.removeLayer(marker);
      this.destinationAddress = undefined; // Optionally reset the destination address
      this.markers = this.markers.filter(m => m !== marker);
      this.drawRouteBetweenPoints(); // Update route after removing marker
    });

    this.map.panTo(latlng);
    this.destinationAddress = address;
    this.markers.push(marker);

    // Draw the route if both departure and destination are set
    this.drawRouteBetweenPoints();
  }).addTo(this.map);
}  
  drawRouteBetweenPoints() {
    const departureMarker = this.markers.find(m => m.getPopup()?.getContent() === this.departureAddress)?.getLatLng();
    const destinationMarker = this.markers.find(m => m.getPopup()?.getContent() === this.destinationAddress)?.getLatLng();
    if (departureMarker && destinationMarker && this.assemblyPoints.length > 0) {
      const assemblyPointsLatLng = this.assemblyPoints.map(address => this.markers.find(m => m.getPopup()?.getContent() === address)?.getLatLng()!);
      this.drawRoute(departureMarker, destinationMarker, assemblyPointsLatLng);
    }
  }
  
  getAddress(lat: number, lng: number) {
    const geocoder = (Leaflet.Control as any).Geocoder.nominatim();
    return new Promise((resolve, reject) => {
      geocoder.reverse(
        { lat, lng },
        this.map.getZoom(),
        (results: any) => results.length ? resolve(results[0].name) : reject('No address found')
      );
    });
  }   
  locateUser() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const userPosition = { lat: userLat, lng: userLng };

        this.map.setView(userPosition, this.map.getZoom());

        const marker = Leaflet.marker(userPosition, { draggable: false }).addTo(this.map)
          .bindPopup(`<b>You are here: ${userLat}, ${userLng}</b>`)
          .openPopup();
        this.markers.push(marker);
      }, (error) => {
        console.error('Geolocation error:', error);
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }
  drawRoute(startCoords: Leaflet.LatLng, endCoords: Leaflet.LatLng, assemblyPoints: Leaflet.LatLng[]) {
    if (this.routeControl) {
      this.map.removeControl(this.routeControl);
    }
  
    const waypoints = [startCoords, ...assemblyPoints, endCoords]; // Include all waypoints
    
    this.routeControl = Leaflet.Routing.control({
      waypoints: waypoints,
      routeWhileDragging: true,
      showAlternatives: false,
      lineOptions: {
        styles: [{ color: 'blue', weight: 5 }],
        addWaypoints: false,
        extendToWaypoints: false,
        missingRouteTolerance: 50 // You can adjust the tolerance value according to your needs
      }
    }).addTo(this.map);
  }
  
  

  geocodeLatLng(latlng: Leaflet.LatLng) {
    this.geocoder.reverse(latlng, this.map.getZoom(), (results: any) => {
      if (results && results[0]) {
        const address = results[0].name;
        this.map.eachLayer((layer: any) => {
          if (layer instanceof Leaflet.Marker && layer.getLatLng().equals(latlng)) {
            layer.bindPopup(address).openPopup();
          }
        });
      } else {
        console.error('Adresse introuvable');
      }
    });
  }

  // Méthode pour ajouter une route
  addRoute() {
    if (!this.departureAddress || !this.destinationAddress) {
      console.error('Le point de départ ou la destination est manquant.');
      return;
    }

    const route: RouteP = {
      routeID: 0, // L'ID sera généré par le backend
      departure: this.departureAddress,
      destination: this.destinationAddress,
      assemblyPoints: this.assemblyPoints.map((point, index) => ({
        assemblyPointsID: index,
        points: point
      }))
    };

    this.routeService.addRoute(route).subscribe(response => {
      console.log('Route ajoutée avec succès', response);
    }, error => {
      console.error('Erreur lors de l\'ajout de la route', error);
    });
  }
  onAddSubmit(): void {
    
    const newAnnouncement: AnnouncementDriver = this.addForm.value;
    this.announcementDriverService.addAnnouncementDriver(newAnnouncement).subscribe(
      (response: AnnouncementDriver) => {
        Swal.fire('Success', 'Announcement added successfully!', 'success');
        
        this.router.navigate(['/annoncement-driver']);
        this.addForm.reset();
      },
    
      (error: any) => {
        console.error('Error adding announcement:', error);
        Swal.fire('Error', 'Failed to add announcement!', 'error');
      },
      
    );
    
}
selectRayonAdd(rayon: string): void {
  this.selectedRayon = rayon;
  this.addForm.get('rayon')?.setValue(rayon);
}

updateRouteAndAnnouncement() {
  if (!this.departureAddress || !this.destinationAddress || !this.routeIDToUpdate) {
    console.error('Le point de départ, la destination ou l\'ID de la route est manquant.');
    return;
  }

  const route: RouteP = {
    routeID: this.routeIDToUpdate,
    departure: this.departureAddress,
    destination: this.destinationAddress,
    assemblyPoints: this.assemblyPoints.map((point, index) => ({
      assemblyPointsID: index,
      points: point
    }))
  };

  // Mettre à jour la route
  this.routeService.updateRoute(route).subscribe(updatedRoute => {
    console.log('Route mise à jour avec succès', updatedRoute);

    // Vous pouvez ensuite ajouter la logique pour mettre à jour l'annonce liée à cette route si nécessaire
    // Exemple : this.announcementDriverService.updateAnnouncement(updatedRoute);

  }, error => {
    console.error('Erreur lors de la mise à jour de la route', error);
  });
}
modifierPointAssemblage(assemblyPointId: number): void {
  if (!assemblyPointId) {
    console.error('L\'identifiant de l\'assemblage point est manquant.');
    return;
  }

  // Récupérer les détails de l'assemblage point à partir du service en utilisant son identifiant
  this.routeService.pointByid(assemblyPointId).subscribe(
    (assemblyPoint: any) => {
      // Clear existing assembly point markers
      this.markers.forEach(marker => this.map.removeLayer(marker));
      this.markers = [];

      // Add marker for the retrieved assembly point
      const latlng = { lat: assemblyPoint.lat, lng: assemblyPoint.lng };
      const marker = Leaflet.marker(latlng).addTo(this.map);
      marker.bindPopup('Assembly Point').openPopup();
      this.markers.push(marker);

      // Redraw route
      this.drawRouteBetweenPoints();
    },
    (error: any) => {
      console.error('Erreur lors de la récupération des détails de l\'assemblage point', error);
    }
  );
}
}