import { Component, OnInit } from '@angular/core';
import { AnnouncementDriver } from 'src/app/Models/AnnouncementDriver';
import { AnnouncementDriverService } from 'src/app/services/announcement/announcement-driver.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClaimService } from 'src/app/services/Claim/claim.service';
import { formatDate } from '@angular/common';
import { CollaboratorDTO } from 'src/app/Models/CollaboratorDTO';
import { CollaboratorsService } from 'src/app/services/auth/collaborators.service';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { forkJoin } from 'rxjs';
import { RouteP } from 'src/app/Models/RouteP';
import { RouteService } from 'src/app/services/Route/route.service';
import * as Leaflet from 'leaflet';
import { VehicleService } from 'src/app/services/vehicle.service';
import { Vehicle } from 'src/app/Models/Vehicle';

@Component({
  selector: 'app-history-announcement-driver',
  templateUrl: './history-announcement-driver.component.html',
  styleUrls: ['./history-announcement-driver.component.css']
})
export class HistoryAnnouncementDriverComponent implements OnInit {
  announcements: AnnouncementDriver[] = [];
  p: number = 1;
  selectedAnnouncement: AnnouncementDriver | null = null;
  updateForm: FormGroup;
  claimForm: FormGroup;
  collaborator?: CollaboratorDTO;
  collaboratorMap: Map<number, CollaboratorDTO> = new Map<number, CollaboratorDTO>();
  selectedAnnonceID: number | null = null;
  annoncements: AnnouncementDriver[] = [];
  searchDate: string | undefined;
  paginatedAnnouncements: AnnouncementDriver[] = [];
    selectedRayon: string = '';
  userFirstName: string | undefined;
  loggedInUserId: string | undefined;
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  today: string = new Date().toISOString().split('T')[0]; 
  searchPrice: number | undefined;
  originalAnnouncements: AnnouncementDriver[] = [];
  userId: number | undefined;
  constructor(
    private announcementDriverService: AnnouncementDriverService,
    private router: Router,
    private fb: FormBuilder,
    private routeService: RouteService,
    private collaboratorsService: CollaboratorsService,
    private claimService: ClaimService,
    private authService: AuthenticationService,
    private vehicleService: VehicleService
  ) {
    this.updateForm = this.fb.group({
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
      climatiseur: [false],
      datePublication: [],
      routeID: [],
      description: []
    });

    this.claimForm = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
      type: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUserAnnouncements();
  }

  currentUserMatchesAnnouncementUserId(userId: number): boolean {
    const loggedInUserId = localStorage.getItem('userId');
    return loggedInUserId !== null && parseInt(loggedInUserId) === userId;
  }

  loadUserAnnouncements(): void {
    const loggedInUserId = localStorage.getItem('userId');
    if (loggedInUserId) {
      this.announcementDriverService.findAnnoncesByuserId(parseInt(loggedInUserId)).subscribe(
        (announcements: AnnouncementDriver[]) => {
          this.announcements = announcements;
        },
        error => {
          console.error('Error fetching user announcements:', error);
        }
      );
    }
  }

  openUpdateModal(announcement: AnnouncementDriver): void {
    this.selectedAnnouncement = announcement;
    this.updateForm.patchValue({
      rayon: announcement.rayon,
      dateCovoiturage: new Date(announcement.dateCovoiturage).toISOString().substring(0, 10),
      nbrPlaces: announcement.nbrPlaces,
      prix: announcement.prix,
      aller_Retour: announcement.aller_Retour,
      heureDepart: announcement.heureDepart,
      heureRetour: announcement.heureRetour,
      bagage: announcement.bagage,
      music: announcement.music,
      fumer: announcement.fumer,
      climatiseur: announcement.climatiseur,
      datePublication: announcement.datePublication,
      routeID: announcement.routeID,
      description: announcement.description
    });
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
        this.announcementDriverService.deleteAnnouncementDriver(annonceID).subscribe(
          () => {
            Swal.fire(
              'Supprimé !',
              'L\'annonce a été supprimée.',
              'success'
            ).then(() => {
              this.loadUserAnnouncements();
            });
          },
          error => {
            console.error('Error deleting announcement:', error);
            Swal.fire('Error', 'Failed to delete announcement!', 'error');
          }
        );
      }
    });
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
    return new Date(dateString).toLocaleDateString(undefined, options);
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
  convertBooleanToYesNo(value: Boolean): string {
    return value ? 'Oui' : 'Non';
  }
  viewDetails(annonce: AnnouncementDriver, routeID: number): void {
    this.routeService.routeById(routeID).subscribe(
      (route: RouteP) => {
        this.vehicleService.getVehiclesByCollaboratorId(annonce.userId).subscribe(
          (vehicles: Vehicle[]) => {
            const vehicle = vehicles.length > 0 ? vehicles[0] : null; // Assume the first vehicle for simplicity
  
            const assemblyPointsHtml = route.assemblyPoints && route.assemblyPoints.length > 0
              ? `<p><strong>Points de rassemblement:</strong></p>
                 <ul>
                   ${route.assemblyPoints.map(point => `<li>${point.points}</li>`).join('')}
                 </ul>`
              : '';
  
            const vehicleInfoHtml = vehicle ? `<p><li> Voiture: <strong>${vehicle.brand} ${vehicle.model}</strong></p>` : '';
  
            Swal.fire({
              title: annonce.rayon,
              color: '#000',
              html: `
                <hr>
                <p><li>Date de Covoiturage: <strong>${this.formatDateOnly(annonce.dateCovoiturage)}</strong></p>
                <p><li>Nombre des places: <strong>${annonce.nbrPlaces}</strong></p>
                <p><li>Prix: <strong>${annonce.prix === 0 ? 'Gratuit' : `${annonce.prix} DT`}</strong></p>
                <p><li>Aller Retour: <strong>${this.convertBooleanToYesNo(annonce.aller_Retour)}</strong></p>
                <p><li>Heure de Depart: <strong>${annonce.heureDepart}</strong></p>
                ${annonce.heureRetour ? `<p><li>Heure de Retour: <strong>${annonce.heureRetour}</strong></p>` : ''}
                <p><li>Bagage: <strong>${this.convertBooleanToYesNo(annonce.bagage)}</strong></p>
                <p><li>Fumer: <strong>${this.convertBooleanToYesNo(annonce.fumer)}</strong></p>
                <p><li>Music: <strong>${this.convertBooleanToYesNo(annonce.music)}</strong></p>
                <p><li>Climatiseur: <strong>${this.convertBooleanToYesNo(annonce.climatiseur)}</strong></p>
                ${annonce.description ? `<p><li>Description: <strong>${annonce.description}</strong></p>` : ''}
                <p><li>Date publication: <strong>${annonce.datePublication}</strong></p>
                ${vehicleInfoHtml}
                <hr>
                <p><strong>Départ:</strong><br> ${route.departure}</p>
                <p><strong>Destination:</strong><br> ${route.destination}</p>
                ${assemblyPointsHtml}
              `,
              confirmButtonColor: '#ff7900',
            });
          },
          error => {
            console.error('Error fetching vehicle details:', error);
            Swal.fire('Error', 'Failed to fetch vehicle details!', 'error');
          }
        );
      },
      error => {
        console.error('Error fetching route details:', error);
        Swal.fire('Error', 'Failed to fetch route details!', 'error');
      }
    );
  }
  
showRouteDetails(routeID: number): void {
  this.routeService.routeById(routeID).subscribe(
    (route: RouteP) => {
      const assemblyPointsHtml = route.assemblyPoints && route.assemblyPoints.length > 0
        ? `<p><strong>Points de rassemblement:</strong></p>
           <ul>
             ${route.assemblyPoints.map(point => `<li>${point.points}</li>`).join('')}
           </ul>`
        : '';

      Swal.fire({
        html: `
          <p><strong>Départ:</strong><br> ${route.departure}</p>
          <p><strong>Destination:</strong><br> ${route.destination}</p>
          ${assemblyPointsHtml}
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


  showRouteOnMap(startPoint: string, endPoint: string): void {
    const mapContainer = document.getElementById('map') as HTMLElement;

    if (!mapContainer) {
      console.error('Map container not found');
      return;
    }

    const map = Leaflet.map(mapContainer).setView([36.8065, 10.1815], 13);

    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    Leaflet.Routing.control({
      waypoints: [
        Leaflet.latLng(36.8065, 10.1815),
        Leaflet.latLng(36.8065, 10.1815)
      ]
    }).addTo(map);
  }

  


}
