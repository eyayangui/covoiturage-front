import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventComponent } from './components/event/event/event.component';
import { ClaimComponent } from './components/Claim/claim/claim.component';
import { EventUpdateComponent } from './components/event/event-update/event-update.component';

const routes: Routes = [
  {path: "event" , component: EventComponent},
  {path: "update-event" , component: EventUpdateComponent},
  {path: "claim" , component: ClaimComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
