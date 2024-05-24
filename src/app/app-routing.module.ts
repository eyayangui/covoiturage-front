import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventComponent } from './components/event/event/event.component';
import { EventUpdateComponent } from './components/event/event-update/event-update.component';
import { AddEventComponent } from './components/event/add-event/add-event.component';
import { AnnouncementComponent } from './components/announcement/announcement/announcement.component';
import { AnnouncementPassengerComponent } from './components/announcement/announcement-passenger/announcement-passenger.component';
import { AnnouncementDriverComponent } from './components/announcement/announcement-driver/announcement-driver.component';
import { ClaimComponent } from './components/Claim/claim/claim.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './services/auth/auth.guard';
import { AnnouncementDetailsComponent } from './components/announcement/announcement-details/announcement-details.component';


const routes: Routes = [
  {path: "event" , component: EventComponent,canActivate: [authGuard]},
  {path: "update-event" , component: EventUpdateComponent, canActivate: [authGuard]},
  {path: "add-event" , component: AddEventComponent},
  {path: "annoncement" , component: AnnouncementComponent},
  {path: "annoncement-passenger" , component: AnnouncementPassengerComponent},
  {path: "annoncement-driver" , component: AnnouncementDriverComponent, canActivate: [authGuard]},
  { path: 'announcement-details/:id', component: AnnouncementDetailsComponent },
  {path: "claim" , component: ClaimComponent,canActivate: [authGuard]},
  {path: "login" ,component: LoginComponent},
  {path:"**",pathMatch:"full",redirectTo:"login"}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
