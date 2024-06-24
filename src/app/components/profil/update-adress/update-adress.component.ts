import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CollaboratorDTO } from 'src/app/Models/CollaboratorDTO';
import { CollaboratorsService } from 'src/app/services/auth/collaborators.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-update-adress',
  templateUrl: './update-adress.component.html',
  styleUrls: ['./update-adress.component.css']
})
export class UpdateAdressComponent implements OnInit, OnChanges, OnDestroy {

  @Input() collaborator?: CollaboratorDTO;
  @Output() collaboratorUpdated: EventEmitter<CollaboratorDTO> = new EventEmitter<CollaboratorDTO>();
  
  attributeValue: string = '';
  modalOpen: boolean = false;
  modalSubscription!: Subscription;

  constructor(
    private modalService: ModalService,
    private collaboratorService: CollaboratorsService
  ) {}

  ngOnInit(): void {
    this.modalSubscription = this.modalService.modalState$.subscribe((state: boolean) => {
      this.modalOpen = state;
    });

    if (this.collaborator) {
      this.attributeValue = this.collaborator.adress;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.collaborator) {
      this.attributeValue = this.collaborator.adress;
    }
  }

  ngOnDestroy(): void {
    this.modalSubscription.unsubscribe();
  }

  updateAttribute(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.collaboratorService.updateCollaboratorAttribute(this.collaborator?.idCollaborator, "address", this.attributeValue)
      .subscribe(
        (data: CollaboratorDTO) => {
          console.log('Update successful', data);
          if (this.collaborator) {
            this.collaborator.adress = data.adress;
            localStorage.setItem('user', JSON.stringify(this.collaborator));
            this.collaboratorUpdated.emit(this.collaborator);
            /* location.reload(); */
          }
        },
        error => {
          console.error('Update failed', error);
        }
      );
  }

  closeModal() {
    this.modalService.closeModal();
  }

}
