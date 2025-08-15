import { Component, OnInit, Input, inject, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { IDepartment } from 'src/app/models/departments.interface';
import { EscalaEditorComponent } from '../escala-editor/escala-editor.component';
import { TitleCasePipe } from '@angular/common';
import { OverlayEventDetail } from '@ionic/core/components';
import {
  IonModal,
} from '@ionic/angular/standalone';
import { ION_DEFAULT_IMPORTS } from '../../imports/ionic-groups-standalone';
import { UtilsService } from 'src/app/services/utils/utils.service';

interface ParticipanteEscala {
  id: number;
  name: string;
  role: string;
  customRole?: string;
}

interface Escala {
  id: number;
  titulo: string;
  dataInicial: Date;
  dataFinal: Date;
  local: string;
  participantes: string[] | ParticipanteEscala[]; // Suporte para ambos os formatos
  observacoes: string;
  status: 'ativa' | 'concluida' | 'pendente';
}

@Component({
  selector: 'app-department-scalas',
  templateUrl: './department-scalas.component.html',
  styleUrls: ['./department-scalas.component.scss'],
  standalone: true,
  imports: [ION_DEFAULT_IMPORTS, TitleCasePipe, IonModal, EscalaEditorComponent]
})
export class DepartmentScalasComponent implements OnInit {

  @Input() department: IDepartment | null = null;

  readonly modalCtrl = inject(ModalController);
  readonly utils = inject(UtilsService)
  
  isExpanded: boolean = false;

  escalas: Escala[] = [
    {
      id: 1,
      titulo: 'Reunião de Planejamento',
      dataInicial: new Date('2024-01-15'),
      dataFinal: new Date('2024-01-19'),
      local: 'Sala de Reuniões A',
      participantes: ['João Silva', 'Maria Santos', 'Pedro Costa'],
      observacoes: 'Reunião de planejamento estratégico do departamento',
      status: 'ativa'
    },
    {
      id: 2,
      titulo: 'Workshop de Capacitação',
      dataInicial: new Date('2024-01-22'),
      dataFinal: new Date('2024-01-24'),
      local: 'Auditório Principal',
      participantes: ['Ana Lima', 'Carlos Oliveira', 'Fernanda Rocha'],
      observacoes: 'Workshop sobre novas tecnologias',
      status: 'pendente'
    },
    {
      id: 3,
      titulo: 'Revisão Trimestral',
      dataInicial: new Date('2024-01-08'),
      dataFinal: new Date('2024-01-10'),
      local: 'Sala de Conferências',
      participantes: ['Roberto Silva', 'Lucia Mendes'],
      observacoes: 'Revisão dos resultados do trimestre',
      status: 'concluida'
    }
  ];
  
  @ViewChild(IonModal) modal!: IonModal;

  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name!: string;

  selectedEscala: Escala | null = null;

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(this.name, 'confirm');
  }

  async openEditor(escala: Escala | null = null){
    this.selectedEscala = escala;
    if (this.modal) {
      await this.modal.present();
    }
    
  }

  onWillDismiss(event: CustomEvent<OverlayEventDetail>) {
    if (event.detail.role === 'confirm') {
      this.message = `Hello, ${event.detail.data}!`;
    }
  }


  ngOnInit() {
    this.loadEscalasFromStorage();
  }


  getStatusColor(status: string): string {
    switch (status) {
      case 'ativa':
        return 'success';
      case 'pendente':
        return 'warning';
      case 'concluida':
        return 'medium';
      default:
        return 'medium';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'ativa':
        return 'play-circle';
      case 'pendente':
        return 'time';
      case 'concluida':
        return 'checkmark-circle';
      default:
        return 'help-circle';
    }
  }

  async onEscalaClick(escala: Escala) {
    const modal = await this.modalCtrl.create({
      component: EscalaEditorComponent,
      componentProps: {
        department: this.department,
        escala: escala
      }
    });

    modal.present();
    
    // Aguardar o modal ser fechado
    const { data } = await modal.onWillDismiss();
    console.log('Modal fechado:', data);
  }

  async onAddEscala() {
    const modalRef = await this.modalCtrl.create({
      component: EscalaEditorComponent,
      componentProps: {
        escala: null,
        department: this.department
      }
    });

    modalRef.present();

    // const { role, data } = await modalRef.onWillDismiss();


    
    // // Aguardar o modal ser fechado
    // const { data, role } = await modal.onWillDismiss();
    
    // if (role === 'confirm' && data) {
    //   // Adicionar a nova escala à lista
    //   this.escalas.push(data);
      
    //   // Atualizar localStorage
    //   this.saveEscalasToStorage();
      
    //   console.log('Nova escala criada:', data);
    // }
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('pt-BR');
  }

  toggleExpandAll() {
    this.isExpanded = !this.isExpanded;
    console.log('Toggle expand all:', this.isExpanded);
  }

  private loadEscalasFromStorage() {
    try {
      const escalasFromStorage = localStorage.getItem('escalas_mock');
      if (escalasFromStorage) {
        const escalasData = JSON.parse(escalasFromStorage);
        // Converter strings de data de volta para objetos Date
        this.escalas = escalasData.map((escala: any) => ({
          ...escala,
          dataInicial: new Date(escala.dataInicial),
          dataFinal: new Date(escala.dataFinal)
        }));
      } else {
        // Se não há escalas no localStorage, salvar as escalas mock iniciais
        this.saveEscalasToStorage();
      }
    } catch (error) {
      console.error('Erro ao carregar escalas do localStorage:', error);
      // Em caso de erro, manter as escalas mock
    }
  }

  private saveEscalasToStorage() {
    try {
      localStorage.setItem('escalas_mock', JSON.stringify(this.escalas));
    } catch (error) {
      console.error('Erro ao salvar escalas no localStorage:', error);
    }
  }

}