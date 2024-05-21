import { Component, OnInit } from '@angular/core';
import { AnnouncementPassengerService } from 'src/app/services/announcement/announcement-passenger.service';
import { Router } from '@angular/router';
import { AnnoncePassenger } from 'src/app/Models/AnnoncePassenger';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';


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



  constructor(private announcementPassengerService: AnnouncementPassengerService, private router: Router,private fb: FormBuilder) {  this.updateForm = this.fb.group({
    rayon: [''],
    dateCovoiturage: [''],
    nbrPlaces: [''],
    aller_Retour: [false],
    heureDepart: [''],
    heureRetour: [''],
    bagage: [false],
    telephone: [''],
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
        this.annoncements = annoncements;
      },
      error => {
        console.error('Error fetching planned events:', error);
      }
    );
  }

  getAnnouncementPassenger(): void {
    this.announcementPassengerService.getAnnouncementPassenger().subscribe(
      annoncements => {
        this.annoncements = annoncements;
      },
      error => {
        console.error('Error fetching events:', error);
      }
    );
  }

  deleteAnnouncementDriver(annonceID: number): void {
    this.announcementPassengerService.deleteAnnouncementDriver(annonceID).subscribe(
      () => {
        this.announcementPassengerDate();
      },
      error => {
        console.error('Error deleting event:', error);
      }
    );
  }

  viewDetails(annonce: AnnoncePassenger): void {
    this.selectedAnnouncement = annonce; // Set the selected announcement
    Swal.fire({
      title: annonce.rayon,
      html: `
        <p>Date de Covoiturage: ${annonce.dateCovoiturage}</p>
        <p>Nombre des places: ${annonce.nbrPlaces}</p>
        <p>Aller Retour: ${annonce.aller_Retour}</p>
        <p>Heure de Depart: ${annonce.heureDepart}</p>
        <p>Heure de Retour: ${annonce.heureRetour}</p>
        <p>Bagage: ${annonce.bagage}</p>
        <p>Téléphone: ${annonce.telephone}</p>
        <p>Date publication : ${annonce.datePublication}</p>
      `,
    });
  }
  openUpdateModal(announcement: any): void {
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
}
