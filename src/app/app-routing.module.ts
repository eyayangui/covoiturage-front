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
import { ChooseVehicleTypeComponent } from './components/profil/choose-vehicle-type/choose-vehicle-type.component';
import { ChooseBrandComponent } from './components/profil/choose-brand/choose-brand.component';
import { ChooseModelComponent } from './components/profil/choose-model/choose-model.component';
import { FileUploadComponent } from './components/profil/file-upload/file-upload.component';
import { ProfileComponent } from './components/profil/profile/profile.component';



const routes: Routes = [
  {path: "event" , component: EventComponent,canActivate: [authGuard]},
  {path: "update-event" , component: EventUpdateComponent, canActivate: [authGuard]},
  {path: "add-event" , component: AddEventComponent},
  {path: "annoncement" , component: AnnouncementComponent},
  {path: "annoncement-passenger" , component: AnnouncementPassengerComponent},
  {path: "annoncement-driver" , component: AnnouncementDriverComponent},
  { path: 'announcement-details/:id', component: AnnouncementDetailsComponent },
  {path: "claim" , component: ClaimComponent,canActivate: [authGuard]},
  {path: "login" ,component: LoginComponent},
  /* {path:"**",pathMatch:"full",redirectTo:"login"}, */
  { path: 'choose-vehicle-type', component: ChooseVehicleTypeComponent, canActivate: [authGuard]},
  { path: 'choose-brand', component: ChooseBrandComponent, canActivate: [authGuard] },
  { path: 'choose-model', component: ChooseModelComponent, canActivate: [authGuard] },
  { path: 'upload', component: FileUploadComponent, canActivate: [authGuard] },
  { path: 'profil', component: ProfileComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
