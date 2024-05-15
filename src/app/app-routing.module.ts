import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventComponent } from './components/event/event/event.component';
import { ClaimComponent } from './components/Claim/claim/claim.component';
import { EventUpdateComponent } from './components/event/event-update/event-update.component';
import { AddEventComponent } from './components/event/add-event/add-event.component';
import { AnnouncementComponent } from './components/announcement/announcement/announcement.component';
import { AnnouncementPassengerComponent } from './components/announcement/announcement-passenger/announcement-passenger.component';
import { AnnouncementDriverComponent } from './components/announcement/announcement-driver/announcement-driver.component';

const routes: Routes = [
  {path: "event" , component: EventComponent},
  {path: "update-event" , component: EventUpdateComponent},
  {path: "Add-event" , component: AddEventComponent},
  {path: "Annoncement" , component: AnnouncementComponent},
  {path: "Annoncement-Passenger" , component: AnnouncementPassengerComponent},
  {path: "Annoncement-Driver" , component: AnnouncementDriverComponent},


  {path: "claim" , component: ClaimComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
