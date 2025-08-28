import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { ION_DEFAULT_IMPORTS } from '../../../imports/ionic-groups-standalone';

@Component({
  selector: 'app-participant-role-modal',
  templateUrl: './participant-role-modal.component.html',
  styleUrls: ['./participant-role-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ION_DEFAULT_IMPORTS
  ]
})
export class ParticipantRoleModalComponent implements OnInit {
  @Input() participant: any;

  roleForm: FormGroup;

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder
  ) {
    this.roleForm = this.fb.group({
      customRole: [''],
      selectedRole: ['']
    });
  }

  ngOnInit() {
    if (this.participant) {
      // Define a função padrão como selecionada inicialmente
      this.roleForm.patchValue({
        selectedRole: this.participant.role
      });
    }
  }

  isFormValid(): boolean {
    const customRole = this.roleForm.get('customRole')?.value?.trim();
    const selectedRole = this.roleForm.get('selectedRole')?.value;
    
    // Válido se há uma função personalizada OU uma opção selecionada
    return !!(customRole || selectedRole);
  }

  async confirm() {
    if (!this.isFormValid()) {
      return;
    }

    const customRole = this.roleForm.get('customRole')?.value?.trim();
    const selectedRole = this.roleForm.get('selectedRole')?.value;
    
    // Prioriza a função personalizada se foi preenchida
    const finalRole = customRole || selectedRole || this.participant?.role;
    
    await this.modalCtrl.dismiss(finalRole, 'confirm');
  }

  async cancel() {
    await this.modalCtrl.dismiss(null, 'cancel');
  }
}