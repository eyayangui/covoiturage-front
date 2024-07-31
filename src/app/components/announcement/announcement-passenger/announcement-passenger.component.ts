import { AfterViewInit , Component, OnInit } from '@angular/core';
import { AnnouncementPassengerService } from 'src/app/services/announcement/announcement-passenger.service';
import { Router } from '@angular/router';
import { AnnoncePassenger } from 'src/app/Models/AnnoncePassenger';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouteService } from 'src/app/services/Route/route.service';
import { RouteP } from 'src/app/Models/RouteP';
import * as Leaflet from 'leaflet'; 
import 'leaflet-control-geocoder';
import { AnnouncementDriverService } from 'src/app/services/announcement/announcement-driver.service';
import { ClaimService } from 'src/app/services/Claim/claim.service';
import { AnnouncementDriver } from 'src/app/Models/AnnouncementDriver';
import 'leaflet-routing-machine'; 
import { ActivatedRoute } from '@angular/router';
import { CollaboratorsService } from 'src/app/services/auth/collaborators.service';
import { CollaboratorDTO } from 'src/app/Models/CollaboratorDTO';
import { forkJoin } from 'rxjs';


Leaflet.Icon.Default.imagePath = 'assets/';

@Component({
  selector: 'app-announcement-passenger',
  templateUrl: './announcement-passenger.component.html',
  styleUrls: ['./announcement-passenger.component.css']
})
export class AnnouncementPassengerComponent implements OnInit  {
  annoncements: AnnoncePassenger[] = [];
  selectedAnnouncement: AnnoncePassenger | null = null;
  updateForm: FormGroup;
  selectedRayon: string = '';
  addForm: FormGroup;
  searchDate: string | undefined;
  userFirstName: string | undefined;
  loggedInUserId: string | undefined;
  isLoggedIn: boolean = false;
  map!: Leaflet.Map;
  routeControl: any;
  route: Leaflet.Polyline | undefined;
  geocoder: any;
  markers: Leaflet.Marker[] = [];
  departureAddress: string | undefined;
  destinationAddress: string | undefined;
  assemblyPoints: string[] = [];
  routeIDToUpdate: number | undefined; 
  p: number = 1;
  isAdmin: boolean = false;
  today: string = new Date().toISOString().split('T')[0]; 
  originalAnnouncements: AnnoncePassenger[] = [];
  collaboratorMap: Map<number, CollaboratorDTO> = new Map<number, CollaboratorDTO>();
  collaborator?: CollaboratorDTO ;
  routeDuration: string = '';
  totalPages: number;
  options = {
    layers: [
      Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      })
    ],
    zoom: 6,
    center: { lat: 0, lng: 0 }
  };


  constructor(
    private announcementPassengerService: AnnouncementPassengerService,
    private router: Router,
    private fb: FormBuilder,
    private routeService: RouteService,
    private collaboratorsService: CollaboratorsService


  ) {
    this.addForm = this.fb.group({
      rayon: [''],
      dateCovoiturage: ['', Validators.required],
      nbrPlaces: ['', Validators.required],
      aller_Retour: [false],
      heureDepart: ['', Validators.required],
      heureRetour: [''],
      bagage: [false],
      telephone: ['', Validators.required], 
      datePublication: [''],
      routeID: ['']
    });
    this.totalPages = Math.ceil(this.annoncements.length / 6);
    this.updateForm = this.fb.group({
      rayon: ['', Validators.required],
      dateCovoiturage: ['', Validators.required],
      nbrPlaces: ['', Validators.required],
      aller_Retour: [false , Validators.required],
      heureDepart: ['', Validators.required],
      heureRetour: [''],
      bagage: [false],
      telephone: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]] ,
      datePublication: [''],
      description:[],
      routeID: ['']
    });
  }

  ngOnInit(): void {
    this.announcementPassengerDate();
    this.isAdmin = localStorage.getItem('role') === 'ADMINISTRATOR';

    
  }
 
 
  addGeocoderControls() {
    const geocoder = (Leaflet.Control as any).geocoder();
    geocoder.addTo(this.map);
    geocoder.on('markgeocode', (e: any) => {
      const latlng = e.geocode.center;
      const address = e.geocode.name;
      const marker = Leaflet.marker(latlng).addTo(this.map);
      marker.bindPopup(address).openPopup();
      this.markers.push(marker);
    });
  }
  currentUserMatchesAnnouncementUserId(userId: number): boolean {
    const loggedInUserId = localStorage.getItem('userId');
    return loggedInUserId !== null && parseInt(loggedInUserId) === userId;
  }
  announcementPassengerDate(): void {
    this.announcementPassengerService.announcementPassengerDate().subscribe(
      annoncements => {
        console.log('Annoncements:', annoncements); 
        this.annoncements = annoncements;
        this.originalAnnouncements = [...annoncements];
        this.loadAnnouncements(annoncements);


      },
      error => {
        console.error('Error fetching planned annoncements:', error);
      }
    );
  }
  loadAnnouncements(annoncements: AnnoncePassenger[]): void {
    this.annoncements = annoncements;
    const userIds = new Set(annoncements.map(annonce => annonce.userId));
    const requests = Array.from(userIds).map(userId => this.collaboratorsService.getCollaboratorById(userId));
    
    forkJoin(requests).subscribe(
      collaborators => {
        collaborators.forEach(collaborator => {
          this.collaboratorMap.set(collaborator.idCollaborator ?? 0, collaborator);
        });
      },
      error => {
        console.error('Error fetching collaborators:', error);
      }
    );
  }

  getCollaboratorName(userId: number | undefined): string {
    if (userId === undefined) {
      return ''; // Gérer le cas où userId est indéfini
    }
  
    const collaborator = this.collaboratorMap.get(userId);
    return collaborator ? `${collaborator.firstName} ${collaborator.lastName}` : '';
  }



  formatDateOnly(dateString: Date): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
     return new Date(dateString).toLocaleDateString(undefined, options);}

     convertBooleanToYesNo(value: Boolean): string {
      return value ? 'Oui' : 'Non';
    }

  getAnnouncementPassenger(): void {
    this.announcementPassengerService.getAnnouncementPassenger().subscribe(
      annoncements => {
        this.annoncements = annoncements;
      },
      error => {
        console.error('Error fetching annoncements:', error);
      }
    );
  }

  
  deleteAnnouncementDriver(annonceID: number): void {
    Swal.fire({
        title: 'Êtes-vous sûr ?',
        text: "Vous ne pourrez pas revenir en arrière !",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ff7900',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oui, supprimer !',
        cancelButtonText: 'Annuler'
    }).then((result) => {
        if (result.isConfirmed) {
          this.announcementPassengerService.deleteAnnouncementDriver(annonceID).subscribe(
            () => {
                    Swal.fire(
                        'Supprimé !',
                        'L\'annonce a été supprimée.',
                        'success'
                    ).then(() => {
                        location.reload();
                    });
                    
                },
                
            );
        }
        location.reload();
    });
}

  

  viewDetails(annonce: AnnoncePassenger, routeID: number): void {
    this.routeService.routeById(routeID).subscribe(
      (route: RouteP) => {
        Swal.fire({
          title: annonce.rayon,
          color: '#000',
          html: `
          <hr>
          <p>Date de Covoiturage:<strong> ${this.formatDateOnly(annonce.dateCovoiturage)} </strong></p> 
          <p>Nombre des places:<strong> ${annonce.nbrPlaces}</strong></p>
          <p>Aller Retour:<strong> ${this.convertBooleanToYesNo(annonce.aller_Retour)}</strong></p>
          <p>Heure de Depart:<strong> ${annonce.heureDepart}</strong></p>
          ${annonce.heureRetour ? `<p>Heure de Retour:<strong> ${annonce.heureRetour}</strong></p>` : ''}
          <p>Bagage:<strong> ${this.convertBooleanToYesNo(annonce.bagage)}</strong></p>
          <p>Date publication:<strong> ${annonce.datePublication}</strong></p>
          ${annonce.description ? `<p>Description:<strong> ${annonce.description}</strong></p>` : ''}

            <hr>
            <p><strong>Départ:</strong><br> ${route.departure}</p>
            <p><strong>Destination:</strong> <br>${route.destination}</p>

            <ul>
              ${route.assemblyPoints.map(point => `<li>${point.points}</li>`).join('')}
            </ul>
          `,
          confirmButtonColor: '#ff7900',
        });
      },
      error => {
        console.error('Error fetching route details:', error);
        Swal.fire('Error', 'Failed to fetch route details!', 'error');
      }
    );
  }
  
  
  viewPhone(annonce: AnnoncePassenger): void {
    this.selectedAnnouncement = annonce; 
    Swal.fire({
      html: `
      <p>Téléphone: <strong>${annonce.telephone}</strong></p>
      `,
      confirmButtonColor: '#ff7900',
    });
  }
  getRemainingDays(dateCovoiturage: Date): string {
    const currentDate = new Date();
    const covoiturageDate = new Date(dateCovoiturage);
    const differenceInTime = covoiturageDate.getTime() - currentDate.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
  
    if (differenceInDays > 1) {
      return `${differenceInDays} jours`;
    } else if (differenceInDays === 1) {
      return 'Demain';
    } else if (differenceInDays === 0) {
      return 'Aujourd\'hui';
    } else {
      return ''; 
    }
  }

  openUpdateModal(announcement: AnnoncePassenger): void {
    this.selectedAnnouncement = announcement;
    this.updateForm.patchValue({
      rayon: announcement.rayon,
      dateCovoiturage: new Date(announcement.dateCovoiturage).toISOString().substring(0, 10), 
      nbrPlaces: announcement.nbrPlaces,
      aller_Retour: announcement.aller_Retour,
      heureDepart: announcement.heureDepart,
      heureRetour: announcement.heureRetour,
      bagage: announcement.bagage,
      telephone: announcement.telephone, 
      datePublication: announcement.datePublication,
      routeID: announcement.routeID,
      description : announcement.description
    });
    this.selectedRayon = announcement.rayon;
  }

  

  selectRayon(rayon: string): void {
    this.selectedRayon = rayon;
    this.updateForm.get('rayon')?.setValue(rayon);
  }
  selectRayonAdd(rayon: string): void {
    this.selectedRayon = rayon;
    this.addForm.get('rayon')?.setValue(rayon);
  }

  onSubmit(): void {
    if (this.updateForm.valid && this.selectedAnnouncement) {
      const updatedAnnouncement: AnnoncePassenger = {
        ...this.selectedAnnouncement,
        ...this.updateForm.value
      };

      this.announcementPassengerService.updateAnnouncementPassenger(updatedAnnouncement).subscribe(
        () => {
          Swal.fire('Success', 'Announcement updated successfully!', 'success');
          this.announcementPassengerDate();
        },
        error => {
          console.error('Error updating announcement:', error);
          Swal.fire('Error', 'Failed to update announcement!', 'error');
        }
      );
    }
  }
  


  onAddSubmit(): void {
    const newAnnouncement: AnnoncePassenger = this.addForm.value;
    this.announcementPassengerService.addAnnouncementPassenger(newAnnouncement).subscribe(
      (response: AnnoncePassenger) => {
        Swal.fire('Success', 'Announcement added successfully!', 'success');
        this.announcementPassengerDate();
        this.addForm.reset();
      },
      (error: any) => {
        console.error('Error adding announcement:', error);
        Swal.fire('Error', 'Failed to add announcement!', 'error');
      }
    );
  }
  filterAnnouncements(rayon: string): void {
    this.selectedRayon = rayon;
    this.announcementPassengerService.getAnnouncementPassengerByRayon(rayon).subscribe(
      annonces => {
        if (Array.isArray(annonces)) {
          this.originalAnnouncements = annonces.filter(annonce => 
            new Date(annonce.dateCovoiturage) > new Date()
          ); 
        } else {
          this.originalAnnouncements = [annonces].filter(annonce => 
            new Date(annonce.dateCovoiturage) > new Date()
          );
        }
        this.annoncements = [...this.originalAnnouncements]; 
      },
      error => {
        console.error('Error fetching announcements by rayon:', error);
      }
    );
  }
  
  
  /* searchByDate(): void {
    if (this.searchDate) {
      const selectedDate = new Date(this.searchDate);
      this.annoncements = this.annoncements.filter(annonce =>
        new Date(annonce.dateCovoiturage).toDateString() === selectedDate.toDateString()
      );
    }
  }  */
  searchByDate(): void {
    this.filterByDate();
  }

  filterByDate(): void {
    let filteredAnnouncements = [...this.originalAnnouncements];
  
    if (this.searchDate) {
      const selectedDate = new Date(this.searchDate);
      filteredAnnouncements = filteredAnnouncements.filter(annonce => {
        const annonceDate = new Date(annonce.dateCovoiturage);
        return (
          annonceDate.getFullYear() === selectedDate.getFullYear() &&
          annonceDate.getMonth() === selectedDate.getMonth() &&
          annonceDate.getDate() === selectedDate.getDate()
        );
      });
    }
  
   
    this.annoncements = filteredAnnouncements;
  }

  confirmAndUpdateSeats(announcement: AnnoncePassenger): void {
    announcement.nbrPlaces = 0;
  
  
    this.announcementPassengerService.updateAnnouncementPassenger(announcement).subscribe(
      () => {
        
        Swal.fire('Success', 'Seats confirmed !', 'success');
      },
      error => {
        console.error('Error updating announcement:', error);
        Swal.fire('Error', 'Failed to update announcement!', 'error');
      }
    );
  }
 
  
  showRouteDetails(routeID: number): void {
    this.routeService.routeById(routeID).subscribe(
      (route: RouteP) => {
        Swal.fire({
          html: `
            <p><strong>Departure:</strong><br> ${route.departure}</p>
            <p><strong>Destination:</strong><br> ${route.destination}</p>
            <ul>
              ${route.assemblyPoints.map(point => `<li>${point.points}</li>`).join('')}
            </ul>
          `,
          confirmButtonColor: '#ff7900',
        });
      },
      error => {
        console.error('Error fetching route details:', error);
        Swal.fire('Error', 'Failed to fetch route details!', 'error');
      }
    );
  }
  openMap() {
    this.router.navigate(['update-route']);
  }
  
  openMapWithRoute(routeID: number): void {
    this.router.navigate(['/update-route', routeID]);
  }
  

  //////////////////////////////////////////
 
  
  openUpdateModalRoute(routeID: number): void {
    this.routeIDToUpdate = routeID;
   
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
  this.destinationAddress = undefined; 
  this.markers = this.markers.filter(m => m !== marker);
  this.drawRouteBetweenPoints(); 
});

this.map.panTo(latlng);
this.destinationAddress = address;
this.markers.push(marker);


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

const waypoints = [startCoords, ...assemblyPoints, endCoords]; 

this.routeControl = Leaflet.Routing.control({
  waypoints: waypoints,
  routeWhileDragging: true,
  showAlternatives: false,
  lineOptions: {
    styles: [{ color: 'blue', weight: 5 }],
    addWaypoints: false,
    extendToWaypoints: false,
    missingRouteTolerance: 50 
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


addRoute() {
if (!this.departureAddress || !this.destinationAddress) {
  console.error('Le point de départ ou la destination est manquant.');
  return;
}

const route: RouteP = {
  routeID: 0, 
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



updateRouteAndAnnouncement() {
  if (!this.departureAddress || !this.destinationAddress || !this.routeIDToUpdate) {
    console.error('Le point de départ, la destination ou l\'ID de la route est manquant.');
    return;
  }

  const route: RouteP = {
    routeID: this.routeIDToUpdate,
    departure: this.departureAddress,
    destination: this.destinationAddress,
    duration: this.routeDuration, // Assigner la durée calculée

    assemblyPoints: this.assemblyPoints.map((point, index) => ({
      assemblyPointsID: index,
      points: point
    }))
  };

  this.routeService.updateRoute(route).subscribe(updatedRoute => {
    console.log('Route mise à jour avec succès', updatedRoute);
    this.drawRouteBetweenPoints();
    Swal.fire('Success', 'Route mise à jour avec succès!', 'success');
  }, error => {
    console.error('Erreur lors de la mise à jour de la route', error);
    Swal.fire('Error', 'Échec de la mise à jour de la route!', 'error');
  });
}

}

