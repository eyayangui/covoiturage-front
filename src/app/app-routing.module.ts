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


import { RouteComponent } from './components/route/route.component';
import { LeafletMapsComponent } from './components/leaflet-maps/leaflet-maps.component';
import { AdminAuthGuard } from './services/auth/AdminAuthGuard';
import { AddAnnouncementPassengerComponent } from './components/announcement/add-announcement-passenger/add-announcement-passenger.component';
import { MapComponent } from './components/map/map.component';
import { UpdateAnnouncementPassengerComponent } from './components/announcement/update-announcement-passenger/update-announcement-passenger.component';
import { AddAnnouncementEventComponent } from './components/announcement/add-announcement-event/add-announcement-event.component';
import { HistoryAnnouncementDriverComponent } from './components/announcement/history-announcement-driver/history-announcement-driver.component';
import { HistoryAnnouncementPassenerComponent } from './components/announcement/history-announcement-passener/history-announcement-passener.component';
import { KPIComponent } from './components/kpi/kpi.component';



const routes: Routes = [
  {path: "event" , component: EventComponent,canActivate: [authGuard]},
  {path: "update-event" , component: EventUpdateComponent, canActivate: [authGuard]},
  {path: "add-event" , component: AddEventComponent,canActivate: [authGuard]},
  {path: 'announcement/:eventID' , component: AnnouncementComponent,canActivate: [authGuard]},
  {path: "annoncement-passenger" , component: AnnouncementPassengerComponent,canActivate: [authGuard]},
  {path: "add-annoncement-passenger" , component: AddAnnouncementPassengerComponent,canActivate: [authGuard]},
  {path: "annoncement-driver" , component: AnnouncementDriverComponent},
  {path: 'announcement-details/:id', component: AnnouncementDetailsComponent,canActivate: [authGuard] },
  {path: "claim" , component: ClaimComponent,canActivate: [authGuard]},
  {path: "route" , component: RouteComponent,canActivate: [authGuard]},
  {path: "add-annoncement-driver" , component: LeafletMapsComponent,canActivate: [authGuard]},
  {path: "map/:routeID" , component: MapComponent,canActivate: [authGuard]},
  {path: 'add-announcement-event/:eventID' , component: AddAnnouncementEventComponent,canActivate: [authGuard]},
  {path: "update-route/:routeID" , component: UpdateAnnouncementPassengerComponent,canActivate: [authGuard]},
  {path: "login" ,component: LoginComponent},
  /* {path:"**",pathMatch:"full",redirectTo:"login"}, */
  { path: 'choose-vehicle-type', component: ChooseVehicleTypeComponent, canActivate: [authGuard]},
  { path: 'choose-brand', component: ChooseBrandComponent, canActivate: [authGuard] },
  { path: 'choose-model', component: ChooseModelComponent, canActivate: [authGuard] },
  { path: 'upload', component: FileUploadComponent, canActivate: [authGuard] },
  { path: 'profil', component: ProfileComponent, canActivate: [authGuard]},
  { path: 'history-driver', component: HistoryAnnouncementDriverComponent, canActivate: [authGuard]},
  { path: 'history-passenger', component: HistoryAnnouncementPassenerComponent, canActivate: [authGuard]},
  { path: 'KPI', component: KPIComponent, canActivate: [authGuard]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
