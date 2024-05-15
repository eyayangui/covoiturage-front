import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventComponent } from './components/event/event/event.component';
import { EventUpdateComponent } from './components/event/event-update/event-update.component';
import { ClaimComponent } from './components/Claim/claim/claim.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './services/auth/auth.guard';


const routes: Routes = [
  {
    path: "event" , 
    component: EventComponent,
    canActivate: [authGuard]
  },
  {
    path: "update-event" , 
    component: EventUpdateComponent,
    canActivate: [authGuard]
  },
  {
    path: "claim" , 
    component: ClaimComponent,
    canActivate: [authGuard]
  },
  {
    path: "login" , 
    component: LoginComponent
  },
  {
    path:"**",
    pathMatch:"full",
    redirectTo:"login"
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
