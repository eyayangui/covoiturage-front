import { Component } from '@angular/core';
import { RouteP } from 'src/app/Models/RouteP';
import * as Leaflet from 'leaflet';
import 'leaflet-control-geocoder';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClaimService } from 'src/app/services/Claim/claim.service';
import Swal from 'sweetalert2';
import { AnnoncePassenger } from 'src/app/Models/AnnoncePassenger';
import { AnnouncementPassengerService } from 'src/app/services/announcement/announcement-passenger.service';
import { RouteService } from 'src/app/services/Route/route.service';
import 'leaflet-routing-machine'; 

@Component({
  selector: 'app-add-announcement-passenger',
  templateUrl: './add-announcement-passenger.component.html',
  styleUrls: ['./add-announcement-passenger.component.css']
  
})
export class AddAnnouncementPassengerComponent {
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
  annoncements: AnnoncePassenger[] = [];
  drawnRoutes: Leaflet.Polyline[] = [];
  today: string = new Date().toISOString().split('T')[0]; 
  routeDuration: string = '';

 
  options = {
    layers: [
      Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      })
    ],
    zoom: 6,
    center: { lat: 0, lng: 0 }
  };

  constructor(private routeService: RouteService,private announcementpassagerService: AnnouncementPassengerService, 
    private router: Router, private fb: FormBuilder,
   

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
        telephone: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]] ,
        datePublication: [],
        description:[],
        routeID: []
      });}

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
    //this.addAssemblyPoints();
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
    const newLatLng = { lat: 0, lng: 0 };
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
        this.departureAddress = undefined; // Optionnel : réinitialiser l'adresse de départ
      });
  
      this.map.panTo(latlng);
      this.departureAddress = address;
      this.markers.push(marker);
  
      // Draw the route if both departure and destination are set
      this.drawRouteBetweenPoints();
    }).addTo(this.map);
  }
  
  /* addAssemblyPoints() {
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
      });
  
      this.map.panTo(latlng);
      this.assemblyPoints.push(address);
      this.markers.push(marker);
  
      this.drawRouteBetweenPoints();
    }).addTo(this.map);
  } */
  
  addDestination() {
    const geocoder = (Leaflet.Control as any).geocoder({
      defaultMarkGeocode: false
    }).on('markgeocode', (e: any) => {
      const latlng = e.geocode.center;
      const address = e.geocode.name;
  
      const marker = Leaflet.marker(latlng).addTo(this.map);
      marker.bindPopup(address).openPopup();
  
      marker.on('click', () => {
        this.map.removeLayer(marker);
        this.destinationAddress = undefined; // Optionnel : réinitialiser l'adresse de destination
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
    if (departureMarker && destinationMarker ) {
      this.drawRoute(departureMarker, destinationMarker);
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
  drawRoute(startCoords: Leaflet.LatLng, endCoords: Leaflet.LatLng) {
    if (this.routeControl) {
      this.map.removeControl(this.routeControl);
    }
  
    const waypoints = [startCoords, endCoords]; // Include all waypoints
    
    this.routeControl = Leaflet.Routing.control({
      waypoints: waypoints,
      routeWhileDragging: true,
      showAlternatives: false,
      lineOptions: {
        styles: [{ color: 'orange', weight: 5 }],
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
      duration: this.routeDuration, // Assigner la durée calculée

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
    const newAnnouncement: AnnoncePassenger = this.addForm.value;
    this.announcementpassagerService.addAnnouncementPassenger(newAnnouncement).subscribe(
      (response: AnnoncePassenger) => {
        Swal.fire('Success', 'Announcement added successfully!', 'success');
        this.router.navigate(['/annoncement-passenger']);
        this.addForm.reset();
      },
      (error: any) => {
        console.error('Error adding announcement:', error);
        Swal.fire('Error', 'Failed to add announcement!', 'error');
      }
    );
  }

selectRayonAdd(rayon: string): void {
  this.selectedRayon = rayon;
  this.addForm.get('rayon')?.setValue(rayon);
}

addRouteAndAnnouncement() {
  if (!this.departureAddress || !this.destinationAddress) {
    console.error('Le point de départ ou la destination est manquant.');
    return;
  }

  // Récupérer l'identifiant du collaborateur à partir du stockage local
  const userId = localStorage.getItem('userId');
  if (!userId) {
    console.error('User ID not found in local storage.');
    return;
  }

  // Convertir l'identifiant du collaborateur en nombre
  const userIdNumber = parseInt(userId, 10);
  if (isNaN(userIdNumber)) {
    console.error('User ID is not a valid number.');
    return;
  }

  const route: RouteP = {
    routeID: 0, // L'ID sera généré par le backend
    departure: this.departureAddress,
    destination: this.destinationAddress,
    duration: this.routeDuration, // Assigner la durée calculée

    assemblyPoints: this.assemblyPoints.map((point, index) => ({
      assemblyPointsID: index,
      points: point
    }))
  };

  // Ajouter la route
  this.routeService.addRoute(route).subscribe(response => {
    console.log('Route ajoutée avec succès', response);

    // Maintenant que la route est ajoutée, soumettre l'annonce
    const newAnnouncement: AnnoncePassenger = this.addForm.value;
    newAnnouncement.routeID = response.routeID; // Assigner l'ID de la route à l'annonce
    newAnnouncement.userId = userIdNumber; // Associer l'annonce à l'utilisateur connecté
    this.announcementpassagerService.addAnnouncementPassenger(newAnnouncement).subscribe(
      (announcementpassagerService: AnnoncePassenger) => {
        Swal.fire('Success', 'Announcement added successfully!', 'success');
        this.router.navigate(['/annoncement-passenger']);
        this.addForm.reset();
      },
      (error: any) => {
        console.error('Error adding announcement:', error);
        Swal.fire('Error', 'Failed to add announcement!', 'error');
      }
    );

  }, error => {
    console.error('Erreur lors de l\'ajout de la route', error);
  });
}

}