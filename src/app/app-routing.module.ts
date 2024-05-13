import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventComponent } from './Modal/event/event/event.component';
import { ClaimComponent } from './Modal/Claim/claim/claim.component';

const routes: Routes = [
  {path: "event" , component: EventComponent},
  {path: "claim" , component: ClaimComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
