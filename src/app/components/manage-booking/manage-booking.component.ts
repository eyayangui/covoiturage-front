import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AnnouncementDriver } from 'src/app/Models/AnnouncementDriver';
import { BookingDTO } from 'src/app/Models/BookingDTO';
import { AnnouncementDriverService } from 'src/app/services/announcement/announcement-driver.service';
import { CollaboratorsService } from 'src/app/services/auth/collaborators.service';
import { BookingService } from 'src/app/services/booking.service';

@Component({
  selector: 'app-manage-booking',
  templateUrl: './manage-booking.component.html',
  styleUrls: ['./manage-booking.component.css']
})
export class ManageBookingComponent implements OnInit {

  announcementId?: number;
  bookings: BookingDTO[] = [];
  announcement: AnnouncementDriver | undefined;
  imageUrl!: SafeUrl;
  userImages: Map<number, any> = new Map();
  username!: string;
  usernames: Map<number, string> = new Map();

  constructor(private route: ActivatedRoute,
    private bookingService: BookingService,
    private announcementDriverService: AnnouncementDriverService,
    private sanitizer: DomSanitizer, private collaboratorService: CollaboratorsService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.announcementId = id ? +id : undefined;
      console.log('Announcement ID:', this.announcementId);
      if (this.announcementId !== undefined) {
        this.getBookings(this.announcementId);
      }
      /* if (id) {
        this.getAnnouncementDriverById(+id);
      } */
    });
  }

  getBookings(announcementId: number): void {
    this.bookingService.getBookingsByAnnouncementId(announcementId)
      .subscribe((data: BookingDTO[]) => {
        this.bookings = data;
        console.log(this.bookings);
        if (this.bookings.length > 0) {
          this.bookings.forEach(booking => {
              if (booking.userId) {
                  
                  this.collaboratorService.getUsernameById(booking.userId).subscribe(
                    (data: string) => {
                      this.usernames.set(booking.userId, data);
        
                      console.log("username", this.username)
                    },
                    (error: any) => {
                      console.error('Error fetching username:', error);
                    }
                  );

                  this.collaboratorService.getCollaboratorImage(booking.userId).subscribe(
                    response => {
                        let objectURL = URL.createObjectURL(response);
                        let sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
                        this.userImages.set(booking.userId, sanitizedUrl);
                    },
                    error => {
                        console.error('Error fetching image for userId:', booking.userId, error);
                    }
                );
              }
          });
      }
      });
  }

  updateStatus(idReservation: number, newStatus: string): void {
    this.bookingService.updateBookingStatus(idReservation, newStatus).subscribe(
      () => {
        console.log('Update successful');
        this.bookings = this.bookings.filter(booking => booking.idReservation !== idReservation);
      },
      error => console.error('Error updating status', error)
    );
  }
  

  

  /* getUsername(): void {
    if (this.bookings.length > 0) {
      this.bookings.forEach(booking => {
          if (booking.userId) {
    this.collaboratorService.getUsernameById(booking.userId).subscribe(
      (data: string) => {
        this.username = data;
        console.log("username", this.username)
      },
      (error: any) => {
        console.error('Error fetching username:', error);
      }
    );
  }
});
}
  }
 */
  /* getAnnouncementDriverById(id: number): void {
    this.announcementDriverService.getAnnouncementDriverById(id).subscribe(
      (announcementDetails: AnnouncementDriver) => {
        this.announcement = announcementDetails;
      },
      error => {
        console.error('Error fetching announcement details:', error);
      }
    );
  } */

}
