import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

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
import { RouteComponent } from './components/route/route.component';



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
    RouteComponent
  
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
