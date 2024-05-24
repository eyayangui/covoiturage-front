import { Component, OnInit } from '@angular/core';
import { AnnouncementPassengerService } from 'src/app/services/announcement/announcement-passenger.service';
import { Router } from '@angular/router';
import { AnnoncePassenger } from 'src/app/Models/AnnoncePassenger';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  constructor(
    private announcementPassengerService: AnnouncementPassengerService,
    private router: Router,
    private fb: FormBuilder
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
        this.router.navigate(['/annoncement-passenger']);
      },
      error => {
        console.error('Error deleting annoncements:', error);
      }
    );
  }

  viewDetails(annonce: AnnoncePassenger): void {
    this.selectedAnnouncement = annonce; // Set the selected announcement
    Swal.fire({
      title: annonce.rayon ,color:'#000',
      html: `
      <p>Date de Covoiturage:<strong> ${this.formatDateOnly(annonce.dateCovoiturage)} </strong></p> 
      <p>Nombre des places:<strong> ${annonce.nbrPlaces}</strong></p>
      <p>Aller Retour:<strong> ${this.convertBooleanToYesNo(annonce.aller_Retour)}</strong></p>
      <p>Heure de Depart:<strong> ${annonce.heureDepart}</strong></p>
      <p>Heure de Retour:<strong> ${annonce.heureRetour? annonce.heureRetour : 'Non spécifiée' }</strong></p>
      <p>Bagage:<strong> ${this.convertBooleanToYesNo(annonce.bagage)}</strong></p>
      <p>Téléphone: <strong>${annonce.telephone}</strong></p>
      <p>Date publication:<strong> ${annonce.datePublication}</strong></p>
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
  

}
