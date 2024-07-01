import { Component, OnInit } from '@angular/core';
import { Annonce } from 'src/app/Models/AnnonceDto';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

import { AnnouncementService } from 'src/app/services/announcement/announcement.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouteP } from 'src/app/Models/RouteP';
import { RouteService } from 'src/app/services/Route/route.service';
import { forkJoin } from 'rxjs';
import { CollaboratorsService } from 'src/app/services/auth/collaborators.service';
import { CollaboratorDTO } from 'src/app/Models/CollaboratorDTO';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.css']
})
export class AnnouncementComponent implements OnInit {
  annoncements : Annonce[] = [];
  selectedAnnouncement: Annonce | null = null; 
  updateForm: FormGroup;
  selectedRayon: string = '';
  today: string = new Date().toISOString().split('T')[0]; 
  isAdmin: boolean = false;
  searchPrice: number | undefined;
  originalAnnouncements: Annonce[] = [];
  collaboratorMap: Map<number, CollaboratorDTO> = new Map<number, CollaboratorDTO>();
  collaborator?: CollaboratorDTO ;


  constructor(private announcementService: AnnouncementService,
    private route: ActivatedRoute,
    private routeService: RouteService, 
    private collaboratorsService: CollaboratorsService,
    private router: Router,

    private fb: FormBuilder) {
    this.updateForm = this.fb.group({
      dateCovoiturage: ['', Validators.required],
      nbrPlaces: ['', Validators.required],
      prix: ['', Validators.required],
      aller_Retour: [false, Validators.required],
      heureDepart: ['', Validators.required],
      heureRetour: ['', Validators.required],
      bagage: ['', Validators.required],
      rayon: ['', Validators.required],
      datePublication: ['', Validators.required],
      description:[],
      routeID: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const eventID = +params['eventID'];
      if (eventID) {
        this.getAnnoncesByEventID(eventID);
      }
    });
    this.isAdmin = localStorage.getItem('role') === 'ADMINISTRATOR';

  }

  getAnnoncesByEventID(eventID: number): void {
    this.announcementService.findAnnoncesByEventID(eventID).subscribe(
      (response: Annonce[]) => {
        this.annoncements = response;
        this.originalAnnouncements = [...response];
        this.loadAnnouncements(this.annoncements);

      },
      (error: any) => {
        console.error('An error occurred while fetching announcements by event ID:', error);
      }
    );
  }
  loadAnnouncements(annoncements: Annonce[]): void {
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

  getAnnouncement(): void {
    this.announcementService.getAnnouncement().subscribe(
      annoncements => {
        this.annoncements = annoncements;
      },
      
      error => {
        console.error('Error fetching events:', error);
      }
    );
  }
  deleteAnnouncement(annonceID: number): void {
    this.announcementService.deleteAnnouncement(annonceID).subscribe(
      () => {
        this.availableannouncement(); 
      },
      error => {
        console.error('Error deleting event:', error);
      }
    );
  }

  
  availableannouncement(): void {
    this.announcementService.availableannouncement().subscribe(
      events => {
        if (events.length === 0) {
          this.annoncements = [];
        } else {
          this.annoncements = events;
        }
      },
      error => {
        console.error('Error fetching planned events:', error);
      }
    );
  }
  formatDateOnly(dateString: Date): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
     return new Date(dateString).toLocaleDateString(undefined, options);}

     convertBooleanToYesNo(value: Boolean): string {
      return value ? 'Oui' : 'Non';
    }

  viewDetails(annonce: Annonce, routeID: number): void {
    this.routeService.routeById(routeID).subscribe(
      (route: RouteP) => {
        const assemblyPointsHtml = route.assemblyPoints.length > 0
          ? `<p><strong>Point de rassemblement:</strong></p>
             <ul>
               ${route.assemblyPoints.map(point => `<li>${point.points}</li>`).join('')}
             </ul>`
          : '';
  
        Swal.fire({
          title: annonce.rayon,
          color: '#000',
          html: `
            <hr>
            <p>Date de Covoiturage:<strong> ${this.formatDateOnly(annonce.dateCovoiturage)} </strong></p> 
            <p>Nombre des places:<strong> ${annonce.nbrPlaces}</strong></p>
            <p>Prix: <strong>${annonce.prix === 0 ? 'Gratuit' : `${annonce.prix} DT`}</strong></p>
            <p>Aller Retour:<strong> ${this.convertBooleanToYesNo(annonce.aller_Retour)}</strong></p>
            <p>Heure de Depart:<strong> ${annonce.heureDepart}</strong></p>
            ${annonce.heureRetour ? `<p>Heure de Retour:<strong> ${annonce.heureRetour}</strong></p>` : ''}
            <p>Bagage:<strong> ${this.convertBooleanToYesNo(annonce.bagage)}</strong></p>
            <p>Date publication:<strong> ${annonce.datePublication}</strong></p>
            ${annonce.description ? `<p> Description:<strong> ${annonce.description}</strong></p>` : ''}

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

  openUpdateModal(announcement: Annonce): void {
    this.selectedAnnouncement = { ...announcement }; 
    this.updateForm.patchValue({
      dateCovoiturage: new Date(announcement.dateCovoiturage).toISOString().substring(0, 10), 
      nbrPlaces: announcement.nbrPlaces,
      prix: announcement.prix,
      aller_Retour: announcement.aller_Retour,
      heureDepart: announcement.heureDepart,
      heureRetour: announcement.heureRetour,
      bagage: announcement.bagage,
      rayon: announcement.rayon,
      datePublication: new Date(announcement.datePublication).toISOString().substring(0, 10), 
      routeID: announcement.routeID,
      description : announcement.description

    });
    this.selectedRayon = announcement.rayon;  
  }

  selectRayon(rayon: string): void {
    this.selectedRayon = rayon;
    this.updateForm.get('rayon')?.setValue(rayon);
  }

  onSubmit(): void {
    if (this.updateForm.valid && this.selectedAnnouncement) {
      const updatedAnnouncement: Annonce = {
        ...this.selectedAnnouncement,
        ...this.updateForm.value
      };

      this.announcementService.updateAnnouncement(updatedAnnouncement).subscribe(
        () => {
          Swal.fire('Success', 'Announcement updated successfully!', 'success');
        },
        error => {
          console.error('Error updating announcement:', error);
          Swal.fire('Error', 'Failed to update announcement!', 'error');
        }
        
      );
      location.reload();
    }
  }

  currentUserMatchesAnnouncementUserId(userId: number): boolean {
    const loggedInUserId = localStorage.getItem('userId');
    return loggedInUserId !== null && parseInt(loggedInUserId) === userId;
  }


  filterByPrice(): void {
    let filteredAnnouncements = [...this.originalAnnouncements];
  
    if (this.searchPrice !== undefined) {
      const selectedPrice = Number(this.searchPrice);
      filteredAnnouncements = filteredAnnouncements.filter(annonce =>
        Number(annonce.prix) === selectedPrice
      );
    }
    
  
    
  
    this.annoncements = filteredAnnouncements;
  }
  searchByPrice(): void {
    this.filterByPrice();
  }
    searchFreeAnnouncements(): void {
      this.annoncements = this.originalAnnouncements.filter(annonce => annonce.prix === 0);
    }
}
