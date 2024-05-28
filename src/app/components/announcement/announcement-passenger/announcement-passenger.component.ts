import { Component, OnInit } from '@angular/core';
import { AnnouncementPassengerService } from 'src/app/services/announcement/announcement-passenger.service';
import { Router } from '@angular/router';
import { AnnoncePassenger } from 'src/app/Models/AnnoncePassenger';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouteService } from 'src/app/services/Route/route.service';
import { RouteP } from 'src/app/Models/RouteP';

@Component({
  selector: 'app-announcement-passenger',
  templateUrl: './announcement-passenger.component.html',
  styleUrls: ['./announcement-passenger.component.css']
})
export class AnnouncementPassengerComponent implements OnInit {
  annoncements: AnnoncePassenger[] = [];
  selectedAnnouncement: AnnoncePassenger | null = null;
  updateForm: FormGroup;
  selectedRayon: string = '';
  addForm: FormGroup;
  searchDate: string | undefined;
  


  constructor(
    private announcementPassengerService: AnnouncementPassengerService,
    private router: Router,
    private fb: FormBuilder,
    private routeService: RouteService

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

    this.updateForm = this.fb.group({
      rayon: ['', Validators.required],
      dateCovoiturage: ['', Validators.required],
      nbrPlaces: ['', Validators.required],
      aller_Retour: [false , Validators.required],
      heureDepart: ['', Validators.required],
      heureRetour: [''],
      bagage: [false],
      telephone: ['', Validators.required],
      datePublication: [''],
      routeID: ['']
    });
  }

  ngOnInit(): void {
    this.announcementPassengerDate();
  }

  announcementPassengerDate(): void {
    this.announcementPassengerService.announcementPassengerDate().subscribe(
      annoncements => {
        console.log('Annoncements:', annoncements); 
        this.annoncements = annoncements;
      },
      error => {
        console.error('Error fetching planned annoncements:', error);
      }
    );
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
    this.announcementPassengerService.deleteAnnouncementDriver(annonceID).subscribe(
      () => {
        this.announcementPassengerDate
      },
      error => {
        console.error('Error deleting annoncements:', error);
      }
    );
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
            <hr>
            <p><strong>Départ:</strong> ${route.departure}</p>
            <p><strong>Destination:</strong> ${route.destination}</p>
            <p><strong>Point de rassemblement:</strong></p>

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
  getRemainingDays(dateCovoiturage: Date): number {
    const currentDate = new Date();
    const covoiturageDate = new Date(dateCovoiturage);
    const differenceInTime = covoiturageDate.getTime() - currentDate.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    return differenceInDays;
  }

  openUpdateModal(announcement: AnnoncePassenger): void {
    this.selectedAnnouncement = announcement;
    this.updateForm.patchValue({
      rayon: announcement.rayon,
      dateCovoiturage: announcement.dateCovoiturage,
      nbrPlaces: announcement.nbrPlaces,
      aller_Retour: announcement.aller_Retour,
      heureDepart: announcement.heureDepart,
      heureRetour: announcement.heureRetour,
      bagage: announcement.bagage,
      telephone: announcement.telephone, 
      datePublication: announcement.datePublication,
      routeID: announcement.routeID
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
          this.annoncements = annonces.filter(annonce => 
            new Date(annonce.dateCovoiturage) > new Date()
          );
        } else {
          console.error('Unexpected response format:', annonces);
        }
      },
      error => {
        console.error('Error fetching announcements:', error);
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
