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


@Component({
  selector: 'app-announcement-driver',
  templateUrl: './announcement-driver.component.html',
  styleUrls: ['./announcement-driver.component.css']
})
export class AnnouncementDriverComponent implements OnInit {
  annoncements: AnnouncementDriver[] = [];
  searchDate: string | undefined;
  paginatedAnnouncements: AnnouncementDriver[] = [];
  selectedAnnouncement: AnnouncementDriver | null = null; 
  updateForm: FormGroup;
    selectedRayon: string = '';
  addForm: FormGroup;
  claimForm: FormGroup;
  selectedAnnonceID: number | null = null;
  userFirstName: string | undefined;
  loggedInUserId: string | undefined;
  isLoggedIn: boolean = false;
  p: number = 1;
  totalPages: number;
  isAdmin: boolean = false;
  today: string = new Date().toISOString().split('T')[0]; 
  searchPrice: number | undefined;
  originalAnnouncements: AnnouncementDriver[] = [];
  collaborator?: CollaboratorDTO ;
  collaboratorMap: Map<number, CollaboratorDTO> = new Map<number, CollaboratorDTO>();

 

  


  constructor(private announcementDriverService: AnnouncementDriverService, 
    private router: Router, private fb: FormBuilder,
    private routeService: RouteService, 
    private collaboratorsService: CollaboratorsService,
    private claimService: ClaimService , 
    private authService: AuthenticationService,

   

  ) {
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
      climatiseur: [false],
      datePublication: [],
      routeID: ['', Validators.required]
    });
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
      description:[],
      routeID: []
    });
    this.claimForm = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
      type: ['', Validators.required]
    });
    this.totalPages = Math.ceil(this.annoncements.length / 6);

  }
  

  ngOnInit(): void {
    this.announcementDriverDate();
    this.isAdmin = localStorage.getItem('role') === 'ADMINISTRATOR';

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.collaborator = JSON.parse(storedUser); 
    }
  }
 

  currentUserMatchesAnnouncementUserId(userId: number): boolean {
    const loggedInUserId = localStorage.getItem('userId');
    return loggedInUserId !== null && parseInt(loggedInUserId) === userId;
  }
  announcementDriverDate(): void {
    this.announcementDriverService.announcementDriverDate().subscribe(
      annoncements => {
        this.originalAnnouncements = annoncements;
        this.loadAnnouncements(annoncements);
      },
      error => {
        console.error('Error fetching planned annonce:', error);
      }
    );
  }

  loadAnnouncements(annoncements: AnnouncementDriver[]): void {
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
  

  getAnnouncementDriver(): void {
    this.announcementDriverService.getAnnouncementDriver().subscribe(
      annoncements => {
        this.annoncements = annoncements;
      },
      error => {
        console.error('Error fetching annoncement:', error);
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
            this.announcementDriverService.deleteAnnouncementDriver(annonceID).subscribe(
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
        }location.reload();
    });
}
viewDetails(annonce: AnnouncementDriver, routeID: number): void {
  this.routeService.routeById(routeID).subscribe(
    (route: RouteP) => {
      const assemblyPointsHtml = route.assemblyPoints && route.assemblyPoints.length > 0
        ? `<p><strong>Points de rassemblement:</strong></p>
           <ul>
             ${route.assemblyPoints.map(point => `<li>${point.points}</li>`).join('')}
           </ul>`
        : '';

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
          <hr>
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
      const updatedAnnouncement: AnnouncementDriver = {
        ...this.selectedAnnouncement,
        ...this.updateForm.value
      };

      this.announcementDriverService.updateAnnouncementDriver(updatedAnnouncement).subscribe(
        () => {
          Swal.fire('Success', 'Announcement updated successfully!', 'success');
          this.announcementDriverDate();
        },
        error => {
          console.error('Error updating announcement:', error);
          Swal.fire('Error', 'Failed to update announcement!', 'error');
        }
      );
    }
  }
  onAddSubmit(): void {
    
    const newAnnouncement: AnnouncementDriver = this.addForm.value;
    this.announcementDriverService.addAnnouncementDriver(newAnnouncement).subscribe(
      (response: AnnouncementDriver) => {
        Swal.fire('Success', 'Announcement added successfully!', 'success');
        

        this.announcementDriverDate();
        this.addForm.reset();
      },
    
      (error: any) => {
        console.error('Error adding announcement:', error);
        Swal.fire('Error', 'Failed to add announcement!', 'error');
        
      },
     
    );
    
  
}
openClaimModal(annonceID: number): void {
  this.selectedAnnonceID = annonceID;
  this.claimForm.reset();
}



onClaimSubmit(): void {
  if (this.claimForm.valid && this.selectedAnnonceID !== null) {
    const claimData = {
      ...this.claimForm.value,
      annonceID: this.selectedAnnonceID
    };
    this.claimService.AddClaim(claimData).subscribe(
      response => {
        Swal.fire('Success', 'Claim added successfully!', 'success');
        this.claimForm.reset();
        const offcanvasElement = document.getElementById('offcanvasBottom');

        
      },
      error => {
        console.error('Error adding claim:', error);
        Swal.fire('Error', 'Failed to add claim!', 'error');
      }
    );
  }
}

filterAnnouncements(rayon: string): void {
  this.selectedRayon = rayon;
  this.announcementDriverService.getAnnouncementDriverByRayon(rayon).subscribe(
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
} 
searchByPrice(): void {
  if (this.searchPrice) {
    const selectedPrice = new Number(this.searchPrice);
    this.annoncements = this.annoncements.filter(annonce =>
      new Number(annonce.prix).valueOf() === selectedPrice.valueOf()
    );
  }
}  */
searchByDateAndPrice(): void {
  this.searchByDate();
  this.searchByPrice();

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

openMap() {
  this.router.navigate(['/map']);
}

openMapWithRoute(routeID: number): void {
  this.router.navigate(['/map', routeID]);
}
 
searchByDate(): void {
  this.filterByDate();
}

searchByPrice(): void {
  this.filterByPrice();
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

  if (this.searchPrice !== undefined) {
    const selectedPrice = Number(this.searchPrice);
    filteredAnnouncements = filteredAnnouncements.filter(annonce =>
      Number(annonce.prix) === selectedPrice
    );
  }

  this.annoncements = filteredAnnouncements;
}

filterByPrice(): void {
  let filteredAnnouncements = [...this.originalAnnouncements];

  if (this.searchPrice !== undefined) {
    const selectedPrice = Number(this.searchPrice);
    filteredAnnouncements = filteredAnnouncements.filter(annonce =>
      Number(annonce.prix) === selectedPrice
    );
  }

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
  searchFreeAnnouncements(): void {
    this.annoncements = this.originalAnnouncements.filter(annonce => annonce.prix === 0);
  }
}