import { Component, OnInit } from '@angular/core';
import { Annonce } from 'src/app/Models/AnnonceDto';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { AnnouncementService } from 'src/app/services/announcement/announcement.service';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.css']
})
export class AnnouncementComponent implements OnInit {
  annoncements : Annonce[] = [];
  

  constructor(private announcementService: AnnouncementService, private router: Router) { }

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


}
