import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './components/nav/nav.component';
import { EventComponent } from './components/event/event/event.component';
import { ClaimComponent } from './components/Claim/claim/claim.component';
import { HttpClientModule } from '@angular/common/http';
import { EventUpdateComponent } from './components/event/event-update/event-update.component';


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    EventComponent,
    ClaimComponent,
    EventUpdateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
