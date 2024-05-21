import { Component, OnInit } from '@angular/core';
import { AnnouncementDriver } from 'src/app/Models/AnnouncementDriver';
import { AnnouncementDriverService } from 'src/app/services/announcement/announcement-driver.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-announcement-driver',
  templateUrl: './announcement-driver.component.html',
  styleUrls: ['./announcement-driver.component.css']
})
export class AnnouncementDriverComponent implements OnInit {
  annoncements: AnnouncementDriver[] = [];
  selectedAnnouncement: AnnouncementDriver | null = null; 
  updateForm: FormGroup;
  selectedRayon: string = '';

  constructor(private announcementDriverService: AnnouncementDriverService, private router: Router, private fb: FormBuilder) {
    this.updateForm = this.fb.group({
      dateCovoiturage: ['', Validators.required],
      nbrPlaces: ['', Validators.required],
      prix: ['', Validators.required],
      aller_Retour: [false, Validators.required],
      heureDepart: ['', Validators.required],
      heureRetour: ['', Validators.required],
      bagage: ['', Validators.required],
      fumer: [false, Validators.required],
      music: [false, Validators.required],
      rayon: ['', Validators.required],
      datePublication: ['', Validators.required],
      routeID: ['', Validators.required]
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
        console.error('Error fetching planned events:', error);
      }
    );
  }

  getAnnouncementDriver(): void {
    this.announcementDriverService.getAnnouncementDriver().subscribe(
      annoncements => {
        this.annoncements = annoncements;
      },
      error => {
        console.error('Error fetching events:', error);
      }
    );
  }

  deleteAnnouncementDriver(annonceID: number): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.announcementDriverService.deleteAnnouncementDriver(annonceID).subscribe(
          () => {
            this.announcementDriverDate(); 
            swalWithBootstrapButtons.fire(
              'Deleted!',
              'Your file has been deleted.',
              'success'
            );
          },
          error => {
            console.error('Error deleting event:', error);
            swalWithBootstrapButtons.fire(
              'Error!',
              'An error occurred while deleting the announcement.',
              'error'
            );
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Your announcement is safe :)',
          'error'
        );
      }
    });
  }

  viewDetails(annonce: AnnouncementDriver): void {
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
        <p>Fumer: ${annonce.fumer}</p>
        <p>Music: ${annonce.music}</p>
        <p>Départ: ${annonce.departure}</p>
        <p>Destination: ${annonce.destination}</p>
        <p>Date publication: ${annonce.datePublication}</p>
      `,
      buttonsStyling: true,
      confirmButtonColor: "buttonsStyling",
    });
  }

  openUpdateModal(announcement: AnnouncementDriver): void {
    this.selectedAnnouncement = announcement;
    this.updateForm.patchValue({
      dateCovoiturage: announcement.dateCovoiturage,
      nbrPlaces: announcement.nbrPlaces,
      prix: announcement.prix,
      aller_Retour: announcement.aller_Retour,
      heureDepart: announcement.heureDepart,
      heureRetour: announcement.heureRetour,
      bagage: announcement.bagage,
      music: announcement.music,
      fumer: announcement.fumer,
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


}
