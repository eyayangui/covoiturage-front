import { Component, OnInit } from '@angular/core';
import { Annonce } from 'src/app/Models/AnnonceDto';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { AnnouncementService } from 'src/app/services/announcement/announcement.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  

  constructor(private announcementService: AnnouncementService,  private router: Router, private fb: FormBuilder) {
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
      routeID: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    this.availableannouncement();
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
  viewDetails(annonce: Annonce): void {
    Swal.fire({
      title: annonce.rayon,
      html: `
        <p>Date de Covoiturage: ${annonce.dateCovoiturage}</p>
        <p>Nombre des places: ${annonce.nbrPlaces}</p>
        <p>Prix: ${annonce.prix}</p>
        <p>Aller Retour: ${annonce.aller_Retour}</p>
        <p>Heure de Depart: ${annonce.heureDepart}</p>
        <p>Heure de Retour: ${annonce.heureRetour}</p>
        <p>Bagage: ${annonce.bagage}</p>
        <p>Départ: ${annonce.departure}</p>
        <p>Destinaton: ${annonce.destination}</p>
        <p>Date publication : ${annonce.datePublication}</p>


      `,
    
    });
  }
  openUpdateModal(announcement: Annonce): void {
    this.selectedAnnouncement = announcement;
    this.updateForm.patchValue({
      dateCovoiturage: announcement.dateCovoiturage,
      nbrPlaces: announcement.nbrPlaces,
      prix: announcement.prix,
      aller_Retour: announcement.aller_Retour,
      heureDepart: announcement.heureDepart,
      heureRetour: announcement.heureRetour,
      bagage: announcement.bagage,
      rayon: announcement.rayon,
      datePublication: announcement.datePublication,
      routeID: announcement.routeID,
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
          this.availableannouncement();
        },
        error => {
          console.error('Error updating announcement:', error);
          Swal.fire('Error', 'Failed to update announcement!', 'error');
        }
      );
    }
  }


}
