import { Component, OnInit } from '@angular/core';
import { RouteService } from '../../services/Route/route.service';
import {  AssemblyPoint ,RouteP } from 'src/app/Models/RouteP';
import { Router } from '@angular/router';

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.css']
})
export class RouteComponent implements OnInit {

  routes: RouteP[] = [];
  points : AssemblyPoint [] =[];

  constructor(private routeService: RouteService, private router: Router) { }

  ngOnInit(): void {
    this.getRoutes();
  }

  getRoutes(): void {
    this.routeService.getRoutes().subscribe(
      routes => {
        this.routes = routes;
      },
      error => {
        console.error('Error fetching routes:', error);
      }
    );
  }
}
