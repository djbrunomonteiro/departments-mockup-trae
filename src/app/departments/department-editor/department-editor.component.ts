import { Component, ElementRef, inject, Input, OnInit, ViewChild, signal, computed } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';

import { ION_DEFAULT_IMPORTS } from 'src/app/imports/ionic-groups-standalone';
import { FormBuilder, Validators, FormArray, FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DepartmentsSelectPeopleComponent } from '../departments-select-people/departments-select-people.component';
import { DepartmentsSelectRolesComponent } from '../departments-select-roles/departments-select-roles.component';
import { IDepartment } from 'src/app/models/departments.interface';
import { AlertController, AlertInput, ModalController } from '@ionic/angular/standalone';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-department-editor',
  templateUrl: './department-editor.component.html',
  styleUrls: ['./department-editor.component.scss'],
  standalone: true,
  imports: [
    ION_DEFAULT_IMPORTS,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgIf
  ]
})
export class DepartmentEditorComponent  implements OnInit {
  private formBuilder = inject(FormBuilder);
  readonly modalCtrl = inject(ModalController);
  private utils = inject(UtilsService);
  private alertCtrl = inject(AlertController);

  @Input() department: IDepartment | undefined;
  @ViewChild('fileInput', { static: false }) fileInputRef!: ElementRef<HTMLInputElement>;
  thumbnailSrc: any = 'https://ionicframework.com/docs/img/demos/thumbnail.svg';

  form = this.formBuilder.group({
    id: [0],
    id_institution: [83204],
    name: ['', [Validators.required]],
    description: [''],
    thumbnail: [''],
    parent_id: [null],
    roles: this.formBuilder.array([]),
    participants: this.formBuilder.array([]),
  });

  ctrlParticipants = this.form.get('participants') as FormArray;
  ctrlRoles = this.form.get('roles') as FormArray;

  bckpRoles!:FormArray;
  bckpParticipants!:FormArray;
  
  // Signal para rastrear mudanças nos roles
  private rolesSignal = signal<any[]>([]);
  
  // Computed signal para o valor de exibição dos roles
  rolesDisplayValue = computed(() => {
    const roles = this.rolesSignal();
    if (!roles || roles.length === 0) {
      return 'Nenhuma função definida';
    }
    
    const rolesTitles = roles
      .map((role: any) => role.title)
      .filter((title: string) => title && title.trim() !== '')
      .join(' | ');
    
    return rolesTitles || 'Nenhuma função definida';
  });

  isModalOpen = false;
  

  people = [
    { id: 1, name: 'Bruno Monteiro' },
    { id: 2, name: 'Ana Souza' },
    { id: 3, name: 'Carlos Lima' },
    { id: 4, name: 'Fernanda Ribeiro' },
    { id: 5, name: 'João Pedro' },
    { id: 6, name: 'Mariana Oliveira' },
    { id: 7, name: 'Lucas Ferreira' },
    { id: 8, name: 'Patrícia Rocha' },
    { id: 9, name: 'Rafael Martins' },
    { id: 10, name: 'Camila Andrade' },
    { id: 11, name: 'Diego Castro' },
    { id: 12, name: 'Juliana Almeida' },
    { id: 13, name: 'Eduardo Lima' },
    { id: 14, name: 'Larissa Costa' },
    { id: 15, name: 'Marcelo Dias' },
    { id: 16, name: 'Beatriz Ramos' },
    { id: 17, name: 'Thiago Nunes' },
    { id: 18, name: 'Isabela Moraes' },
    { id: 19, name: 'Vinícius Teixeira' },
    { id: 20, name: 'Amanda Figueiredo' }
  ];


  constructor() {
    this.setDefault();
  }

  setDefault() {
    ['leader'].forEach(value => this.addRole(value));
  }

  addParticipant(value = '') {
    const group = this.formBuilder.group({
      id: [value, [Validators.required]]
    })
    this.ctrlParticipants.push(group)
  }

  addRole(value = '') {
    const key = Date.now();
    const group = this.formBuilder.group({
      title: [value, [Validators.required]],
      selected: [[]],
      key: [key]
    })
    this.ctrlRoles.push(group)
    this.updateRolesSignal();
  }

  ngOnInit() {
    this.updateRolesSignal();
  }

  triggerFileInput(){
    this.fileInputRef.nativeElement.click();
  }
  onFileSelected(event: Event){
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0]
    console.log(input, file)

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.thumbnailSrc = e.target?.result as string
      }
      reader.readAsDataURL(file);

    }
  }

  async openSelectPeople() {

    this.bckpParticipants = this.cloneFormArray(this.ctrlParticipants);
    this.bckpRoles = this.cloneFormArray(this.ctrlRoles);

    const selected = this.ctrlParticipants.value?.map((elem: any) => elem.id);
    const modal = await this.modalCtrl.create({
      component: DepartmentsSelectPeopleComponent,
      componentProps: {
        selected, 
        ctrlRoles: this.ctrlRoles, 
        people: this.people,
        openSelectRoles: this.openSelectRoles,
        removePersonFromRoles: this.removePersonFromRoles,
        addPersonInRoles: this.addPersonInRoles,
        rowBackCtrls: this.rowBackCtrls
      }
    });

    modal.present();

    const { role, data } = await modal.onWillDismiss();

    if (role !== 'confirm') { 
      this.rowBackCtrls();
      return 
    }


    this.updateParticipants(data.participants)

  }

  cloneFormArray(original: FormArray): FormArray {
    return new FormArray(
      original.controls.map(control => {
        if (control instanceof FormGroup) {
          const clonedGroup: { [key: string]: FormControl } = {};

          for (const key in control.controls) {
            if (control.controls.hasOwnProperty(key)) {
              const c = control.controls[key];
              clonedGroup[key] = new FormControl(c.value);
            }
          }

          return new FormGroup(clonedGroup);
        } else if (control instanceof FormControl) {
          return new FormControl(control.value);
        } else if (control instanceof FormArray) {
          return this.cloneFormArray(control);
        } else {
          throw new Error('Tipo de controle desconhecido');
        }
      })
    );
  }

  rowBackCtrls(){
    this.ctrlRoles = this.cloneFormArray(this.bckpRoles);
    this.ctrlParticipants = this.cloneFormArray(this.bckpParticipants);
    this.updateRolesSignal();
  }

  updateParticipants(newParticipants: any[]) {
    this.ctrlParticipants.clear()
    if (!newParticipants.length) {
      return
    }

    let participants = newParticipants.map(id => {
      const participant = this.people.find(p => p.id === +id);
      return participant
    }) as any[];

    participants = this.utils.orderBy(participants, 'name', 'cresc')
    participants.forEach(({ id }) => this.addParticipant(id));
  }

  updateRoles(roles: any[]) {
    roles.forEach(({ key, selected }) => {
      const groupCtrls = this.ctrlRoles.controls.find((g:any) => {
        const keyCtrl = g.get('key') as FormControl;
        return keyCtrl.value === key;
      })

      if(!groupCtrls){return}
      const ctrlSelected =   groupCtrls.get('selected') as FormControl;
      if (!ctrlSelected) { return }
      ctrlSelected.setValue(selected)
    })
  }

  async openSelectRoles(person: any) {
    const inputs: AlertInput[] = this.ctrlRoles.value
      .map((role: any) => {
        const selected = role.selected as any[] || [];
        const checked = selected.some(id => +id === +person.id)
        const option: AlertInput = {
          id: role.key,
          label: role.title,
          type: 'checkbox',
          value: role.key,
          checked,
        }
        return option;
      });


    const alert = await this.alertCtrl.create({
      header: 'Funções | Cargos de:',
      message: person?.name,
      inputs,
      buttons: [
        {
          role: 'cancel',
          text: 'Cancelar'
        },
        {
          role: 'confirm',
          text: 'Confirmar'
        }
      ],
    });

    await alert.present();

    const { role, data } = await alert.onDidDismiss();
    if (!data || role === 'cancel') {
      return 
    }
    const { values } = data;

    if (!values.length) {
      this.removePersonFromRoles(person.id)
      return
    }

    this.addPersonInRoles(person, values)
  }

  addPersonInRoles(person: any, values: any[]) {
    const rolesRef = this.ctrlRoles.controls.filter(ctrl => {
      const keyCtrl = ctrl.get('key') as FormControl;
      return values.includes(keyCtrl.value)
    });

    if (!rolesRef.length) { return }
    rolesRef.forEach((group: any) => {
      const selectedCtrl = group.get('selected') as FormControl;
      const selected = selectedCtrl.value as any[];
      const exist = selected.includes(person.id);
      if (exist) { return }
      selected.push(person.id);
      selectedCtrl.setValue(selected)
    })

  }

  removePersonFromRoles(id_person: number) {
    this.ctrlRoles.controls.forEach((ctrl) => {
      const selectedCtrl = ctrl.get('selected') as FormControl;
      let selected = selectedCtrl.value as any[];
      selected = selected.filter(id => +id !== +id_person);
      selectedCtrl.setValue(selected);
    })
  }

  getParticipantById(participantId: number) {
    return this.people.find(p => p.id === +participantId);
  }

  private updateRolesSignal(): void {
    if (this.ctrlRoles) {
      this.rolesSignal.set(this.ctrlRoles.value);
    }
  }

  getRolesForParticipant(participantId: number): string {
    const roles: string[] = [];
    
    this.ctrlRoles.controls.forEach((roleCtrl) => {
      const keyCtrl = roleCtrl.get('key') as FormControl;
      const titleCtrl = roleCtrl.get('title') as FormControl;
      const selectedCtrl = roleCtrl.get('selected') as FormControl;
      
      const selected = selectedCtrl.value as any[] || [];
      if (selected.includes(participantId)) {
        roles.push(titleCtrl.value);
      }
    });
    
    return roles.length > 0 ? roles.join(', ') : 'Sem função definida';
  }

  removeParticipant(participantId: number) {
    // Remove from participants
    const index = this.ctrlParticipants.controls.findIndex(ctrl => {
      const idCtrl = ctrl.get('id') as FormControl;
      return +idCtrl.value === +participantId;
    });
    
    if (index !== -1) {
      this.ctrlParticipants.removeAt(index);
    }
    
    // Remove from all roles
    this.removePersonFromRoles(participantId);
  }

  async openManageRoles() {
    const currentRoles = this.ctrlRoles.value;
    
    const modal = await this.modalCtrl.create({
      component: DepartmentsSelectRolesComponent,
      componentProps: {
        roles: currentRoles
      }
    });

    modal.present();

    const { role, data } = await modal.onWillDismiss();

    if (role === 'confirm' && data) {
      // Limpa as roles atuais
      this.ctrlRoles.clear();
      
      // Adiciona as novas roles
      data.forEach((roleData: any) => {
        const group = this.formBuilder.group({
          title: [roleData.title, [Validators.required]],
          selected: [roleData.selected || []],
          key: [roleData.key]
        });
        this.ctrlRoles.push(group);
      });
      
      // Atualiza o signal
      this.updateRolesSignal();
    }
  }

  isButtonDisabled(): boolean {
    const nameControl = this.form.get('name');
    const nameValue = nameControl?.value as string | undefined;
    
    return nameControl?.invalid || !nameValue || nameValue.length < 3;
  }

  async save(){
    const nameValue = this.form.get('name')?.value as string;
    if (this.form.valid && nameValue && nameValue.length >= 3) {
      // Gerar ID aleatório
      const randomId = Math.floor(Math.random() * 1000000) + 1;
      
      // Atualizar o ID no formulário
      this.form.patchValue({
        id: randomId
      });
      
      const departmentData = this.form.value;
      console.log('Salvando departamento:', departmentData);
      
      // Obter departamentos existentes do localStorage ou inicializar array vazio
      const existingDepartments = JSON.parse(localStorage.getItem('departments_mock') || '[]');
      
      // Adicionar novo departamento
      existingDepartments.push(departmentData);
      
      // Salvar no localStorage
      localStorage.setItem('departments_mock', JSON.stringify(existingDepartments));
      
      // Mostrar mensagem de sucesso
      console.log('Departamento salvo com sucesso!');
      
      // Fechar modal e retornar os dados
      await this.modalCtrl.dismiss(departmentData, 'confirm');
    } else {
      console.log('Formulário inválido:', this.form.value);
      // Marcar todos os campos como touched para mostrar os erros de validação
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        control?.markAsTouched();
      });
    }
  }

}

