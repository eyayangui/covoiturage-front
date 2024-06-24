import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CollaboratorDTO } from 'src/app/Models/CollaboratorDTO';
import { CollaboratorsService } from 'src/app/services/auth/collaborators.service';

@Component({
  selector: 'app-minibio-update',
  templateUrl: './minibio-update.component.html',
  styleUrls: ['./minibio-update.component.css']
})
export class MinibioUpdateComponent implements OnInit{

  @Input() collaborator?: CollaboratorDTO;
  newMinibio?: string = '';
  @Output() collaboratorUpdated: EventEmitter<CollaboratorDTO> = new EventEmitter<CollaboratorDTO>();
  
  constructor(private collaboratorService: CollaboratorsService){

  }

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.collaborator = JSON.parse(storedUser); 
    }
    if (this.collaborator) {
      this.newMinibio = this.collaborator.minibio;
    }
  }


  updateMinibio(id?: number): void {
    this.collaboratorService.updateCollaboratorAttribute(id, "minibio", this.newMinibio)
      .subscribe(
        response => {
          console.log('Minibio updated successfully:', response);
          if (this.collaborator) {
            this.collaborator.minibio = response.minibio;
            localStorage.setItem('user', JSON.stringify(this.collaborator)); 
            this.collaboratorUpdated.emit(this.collaborator); 
          }
        },
        error => {
          console.error('Error updating minibio:', error);
       
        }
      );
  }
  
}
