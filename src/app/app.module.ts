import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './components/nav/nav.component';
import { EventComponent } from './components/event/event/event.component';
import { ClaimComponent } from './components/Claim/claim/claim.component';
import { HttpClientModule } from '@angular/common/http';
import { EventUpdateComponent } from './components/event/event-update/event-update.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AddEventComponent } from './components/event/add-event/add-event.component';
import { AnnouncementComponent } from './components/announcement/announcement/announcement.component';
import { AnnouncementDriverComponent } from './components/announcement/announcement-driver/announcement-driver.component';
import { AnnouncementPassengerComponent } from './components/announcement/announcement-passenger/announcement-passenger.component';
import { LoginComponent } from './components/login/login.component';
import { AnnouncementDetailsComponent } from './components/announcement/announcement-details/announcement-details.component';
import { ChooseVehicleTypeComponent } from './components/profil/choose-vehicle-type/choose-vehicle-type.component';
import { ChooseBrandComponent } from './components/profil/choose-brand/choose-brand.component';
import { ChooseModelComponent } from './components/profil/choose-model/choose-model.component';
import { FileUploadComponent } from './components/profil/file-upload/file-upload.component';
import { CollaboratorImageComponent } from './components/profil/collaborator-image/collaborator-image.component';
import { MinibioUpdateComponent } from './components/profil/minibio-update/minibio-update.component';
import { ProfileComponent } from './components/profil/profile/profile.component';
import { DeleteVehicleComponent } from './components/profil/delete-vehicle/delete-vehicle.component';
import { UpdatePhoneNumberComponent } from './components/profil/update-phone-number/update-phone-number.component';
import { UpdateBirthDateComponent } from './components/profil/update-birth-date/update-birth-date.component';
import { UpdateAdressComponent } from './components/profil/update-adress/update-adress.component';
import { RouteComponent } from './components/route/route.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletMapsComponent } from './components/leaflet-maps/leaflet-maps.component';
import { AddAnnouncementPassengerComponent } from './components/announcement/add-announcement-passenger/add-announcement-passenger.component';
import { MapComponent } from './components/map/map.component';
import { UpdateAnnouncementPassengerComponent } from './components/announcement/update-announcement-passenger/update-announcement-passenger.component';
import { AddAnnouncementEventComponent } from './components/announcement/add-announcement-event/add-announcement-event.component';



@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    EventComponent,
    ClaimComponent,
    EventUpdateComponent,
    LoginComponent,
    AddEventComponent,
    AnnouncementComponent,
    AnnouncementDriverComponent,
    AnnouncementPassengerComponent,
    AnnouncementDetailsComponent,
    RouteComponent,
    LeafletMapsComponent,
    AddAnnouncementPassengerComponent,
    MapComponent,
    UpdateAnnouncementPassengerComponent,
    AddAnnouncementEventComponent,
    ChooseVehicleTypeComponent,
    ChooseBrandComponent,
    ChooseModelComponent,
    FileUploadComponent,
    CollaboratorImageComponent,
    ProfileComponent,
    MinibioUpdateComponent,
    DeleteVehicleComponent,
    UpdatePhoneNumberComponent,
    UpdateBirthDateComponent,
    UpdateAdressComponent
    RouteComponent
  
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    LeafletModule,
    NgxPaginationModule 
    HttpClientModule,
    FormsModule
  ],
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
