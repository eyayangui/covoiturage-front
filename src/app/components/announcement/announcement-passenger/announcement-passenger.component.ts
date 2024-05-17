import { Component, OnInit } from '@angular/core';
import { AnnouncementPassengerService } from 'src/app/services/announcement/announcement-passenger.service';
import { Router } from '@angular/router';
import { AnnoncePassenger } from 'src/app/Models/AnnoncePassenger';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-announcement-passenger',
  templateUrl: './announcement-passenger.component.html',
  styleUrls: ['./announcement-passenger.component.css']
})
export class AnnouncementPassengerComponent implements OnInit {
  annoncements : AnnoncePassenger[] = [];
  

  constructor(private announcementPassengerService: AnnouncementPassengerService, private router: Router) { }

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
  
}
