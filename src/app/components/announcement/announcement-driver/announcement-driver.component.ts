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



@Component({
  selector: 'app-announcement-driver',
  templateUrl: './announcement-driver.component.html',
  styleUrls: ['./announcement-driver.component.css']
})
export class AnnouncementDriverComponent implements OnInit {
  annoncements: AnnouncementDriver[] = [];
  searchDate: string | undefined;

  selectedAnnouncement: AnnouncementDriver | null = null; 
  updateForm: FormGroup;
  selectedRayon: string = '';
  addForm: FormGroup;
  claimForm: FormGroup;
  selectedAnnonceID: number | null = null;
  userFirstName: string | undefined;


  


  constructor(private announcementDriverService: AnnouncementDriverService, 
    private router: Router, private fb: FormBuilder,
    private routeService: RouteService, 

    private claimService: ClaimService , 
   

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
      datePublication: [],
      routeID: []
    });
    this.claimForm = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
      type: ['', Validators.required]
    });
  }
  

  ngOnInit(): void {
    this.announcementDriverDate();
  }
  

  announcementDriverDate(): void {
    this.announcementDriverService.announcementDriverDate().subscribe(
      annoncements => {
        this.annoncements = annoncements;
      },
      error => {
        console.error('Error fetching planned annoncement:', error);
      }
    );
  }


  formatDateOnly(dateString: Date): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
     return new Date(dateString).toLocaleDateString(undefined, options);}

     convertBooleanToYesNo(value: Boolean): string {
      return value ? 'Oui' : 'Non';
    }

    getRemainingDays(dateCovoiturage: Date): number {
      const currentDate = new Date();
      const covoiturageDate = new Date(dateCovoiturage);
      const differenceInTime = covoiturageDate.getTime() - currentDate.getTime();
      const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
      return differenceInDays;
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
    this.announcementDriverService.deleteAnnouncementDriver(annonceID).subscribe(
      () => {
        this.router.navigate(['/annoncement-driver']);
      },
      error => {
        console.error('Error deleting annoncement:', error);
      }
    );
  }
  viewDetails(annonce: AnnouncementDriver, routeID: number): void {
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
            <p>Prix: <strong>${annonce.prix} DT</strong></p>
            <p>Aller Retour:<strong> ${this.convertBooleanToYesNo(annonce.aller_Retour)}</strong></p>
            <p>Heure de Depart:<strong> ${annonce.heureDepart}</strong></p>
            ${annonce.heureRetour ? `<p>Heure de Retour:<strong> ${annonce.heureRetour}</strong></p>` : ''}
            <p>Bagage:<strong> ${this.convertBooleanToYesNo(annonce.bagage)}</strong></p>
            <p>Fumer:<strong> ${this.convertBooleanToYesNo(annonce.fumer)}</strong></p>
            <p>Music:<strong> ${this.convertBooleanToYesNo(annonce.music)}</strong></p>
            <p>Date publication:<strong> ${annonce.datePublication}</strong></p>
            <hr>
            <p><strong>Départ:</strong> ${route.departure}</p>
            <p><strong>Destination:</strong> ${route.destination}</p>
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
      dateCovoiturage: announcement.dateCovoiturage,
      nbrPlaces: announcement.nbrPlaces,
      prix: announcement.prix,
      aller_Retour: announcement.aller_Retour,
      heureDepart: announcement.heureDepart,
      heureRetour: announcement.heureRetour,
      bagage: announcement.bagage,
      music: announcement.music,
      fumer: announcement.fumer,
      datePublication: announcement.datePublication,
      routeID: announcement.routeID,
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
        // Reset form and close modal
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
        this.annoncements = annonces.filter(annonce => 
          new Date(annonce.dateCovoiturage) > new Date()
        ); 
      } else {
        this.annoncements = [annonces].filter(annonce => 
          new Date(annonce.dateCovoiturage) > new Date()
        );
      }
    },
    error => {
      console.error('Error fetching announcements by rayon:', error);
    }
  );
}

searchByDate(): void {
  if (this.searchDate) {
    const selectedDate = new Date(this.searchDate);
    this.annoncements = this.annoncements.filter(annonce =>
      new Date(annonce.dateCovoiturage).toDateString() === selectedDate.toDateString()
    );
  }
} 
showRouteDetails(routeID: number): void {
  this.routeService.routeById(routeID).subscribe(
    (route: RouteP) => {
      Swal.fire({
        html: `
          <p><strong>Departure:</strong> ${route.departure}</p>
          <p><strong>Destination:</strong> ${route.destination}</p>
          <p><strong>Assembly Points:</strong></p>
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

}


