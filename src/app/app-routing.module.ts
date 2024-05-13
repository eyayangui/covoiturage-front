import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventComponent } from './Modal/event/event/event.component';
import { ClaimComponent } from './Modal/Claim/claim/claim.component';
import { EventUpdateComponent } from './Modal/event/event-update/event-update.component';

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
