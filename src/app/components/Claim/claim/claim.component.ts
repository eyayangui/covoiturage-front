import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Claim } from 'src/app/Models/Claim';
import { ClaimService } from 'src/app/services/Claim/claim.service';

@Component({
  selector: 'app-claim',
  templateUrl: './claim.component.html',
  styleUrls: ['./claim.component.css']
})
export class ClaimComponent implements OnInit {
  claims: Claim[] = []; 

  constructor(private claimService: ClaimService, private router: Router,private fb: FormBuilder){

  }
  ngOnInit(): void {
    
  this.getClaim();
  }

  getClaim(): void {
    this.claimService.getClaim().subscribe(
      claims => {
        this.claims = claims;
      },
      error => {
        console.error('Error fetching claims:', error);
      }
    );
  }
  

}
