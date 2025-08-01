import { Component, inject, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular/standalone';
import { ION_DEFAULT_IMPORTS } from 'src/app/imports/ionic-groups-standalone';

@Component({
  selector: 'app-departments-select-roles',
  templateUrl: './departments-select-roles.component.html',
  styleUrls: ['./departments-select-roles.component.scss'],
  standalone: true,
  imports: [
    ION_DEFAULT_IMPORTS
  ]
})
export class DepartmentsSelectRolesComponent {
  private formBuilder = inject(FormBuilder);
  readonly modalCtrl = inject(ModalController);

  @Input() roles: any[] = [];

  rolesForm: FormArray = this.formBuilder.array([]);

  ngOnInit() {
    this.initializeRoles();
  }

  initializeRoles() {
    this.rolesForm.clear();
      
    if (this.roles && this.roles.length > 0) {
      this.roles.forEach((role, index) => {
        // Pula o primeiro se for "Líder" para evitar duplicação
        if (index === 0 && role.title?.toLowerCase() === 'líder') {
          return;
        }
        this.addRoleControl(role.title || '');
      });
    }
  }

  addRoleControl(value: string = '', isReadonly: boolean = false) {
    const roleControl = this.formBuilder.control({
      value: value,
      disabled: isReadonly
    }, [Validators.required]);
    this.rolesForm.push(roleControl);
  }

  addRole() {
    this.addRoleControl('');
  }

  isFirstControl(index: number): boolean {
    return index === 0;
  }

  removeRole(index: number) {
    if (this.rolesForm.length > 1) {
      this.rolesForm.removeAt(index);
    }
  }

  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  save() {
    if (this.rolesForm.valid) {
      const rolesData: any[] = [];
      
      this.rolesForm.controls.forEach((control, index) => {
        const title = control.value?.trim();
        if (title) {
          rolesData.push({
            key: title.toLowerCase().replace(/\s+/g, '_'),
            title: title,
            selected: this.roles[index]?.selected || []
          });
        }
      });
      
      this.modalCtrl.dismiss(rolesData, 'confirm');
    }
  }

  isFormValid(): boolean {
    return this.rolesForm.valid && 
           this.rolesForm.value.some((role: string) => role.trim() !== '');
  }
}