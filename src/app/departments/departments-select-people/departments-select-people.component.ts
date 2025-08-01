import { Component, inject, Input, signal } from '@angular/core';
import { FormArray, FormsModule } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular/standalone';
import { ION_DEFAULT_IMPORTS } from 'src/app/imports/ionic-groups-standalone';

@Component({
  selector: 'app-departments-select-people',
  templateUrl: './departments-select-people.component.html',
  styleUrls: ['./departments-select-people.component.scss'],
  standalone: true,
  imports: [
    ION_DEFAULT_IMPORTS,
    FormsModule,

  ]
})
export class DepartmentsSelectPeopleComponent {

  @Input()selected: number[] = [];
  @Input()people: any[] = [];
  @Input()ctrlRoles!: FormArray;
  @Input()openSelectRoles!: (person: any) => void
  @Input()addPersonInRoles!: (person: any, values: any[]) => void
  @Input()removePersonFromRoles!: (id_person: any) => void


  readonly alertCtrl = inject(AlertController);
  readonly modalCtrl = inject(ModalController);

  search = signal({
    enable: false,
    query: '',
    results: [] as any[]
  })

  select(id: number){
    const index = this.selected.findIndex(elem => elem ===id);
    if(index === -1){
      this.selected.push(id)
      return
    }

    this.selected.splice(index, 1);
  }

  handleInput(event: Event){
    const target = event.target as HTMLIonSearchbarElement;
    const query = target.value?.toLowerCase() || '';

    const results = query? this.people.filter(person =>  String(person.name).toLowerCase().includes(query)) : []

    this.search.update(() => ({
      enable: query ? true : false,
      query,
      results
    }))

  }

  save(){
    const data = {
      participants: this.selected,
    }
    this.modalCtrl.dismiss(data, 'confirm')
  }

}
