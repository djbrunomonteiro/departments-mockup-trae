import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalController } from '@ionic/angular/standalone';
import { ION_DEFAULT_IMPORTS } from '../../imports/ionic-groups-standalone';
import { Router } from '@angular/router';
import { IDepartment } from 'src/app/models/departments.interface';
import { DepartmentScalaComponent } from '../department-scala/department-scala.component';
import { EscalaEditorComponent } from '../escala-editor/escala-editor.component';

interface Escala {
  id: number;
  titulo: string;
  dataInicial: Date;
  dataFinal: Date;
  local: string;
  participantes: string[];
  observacoes: string;
  status: 'ativa' | 'concluida' | 'pendente';
}

@Component({
  selector: 'app-department-scalas',
  templateUrl: './department-scalas.component.html',
  styleUrls: ['./department-scalas.component.scss'],
  standalone: true,
  imports: [CommonModule, ION_DEFAULT_IMPORTS]
})
export class DepartmentScalasComponent implements OnInit {

  @Input() department: IDepartment | undefined;
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

  constructor(private router: Router, private modalController: ModalController) { }

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
    const modal = await this.modalController.create({
      component: DepartmentScalaComponent,
      componentProps: {
        department: this.department,
        escala: escala
      },
      breakpoints: [0, 0.5, 0.8, 1],
      initialBreakpoint: 0.8,
      backdropDismiss: true,
      showBackdrop: true,
      canDismiss: true
    });

    modal.present();
    
    // Aguardar o modal ser fechado
    const { data } = await modal.onWillDismiss();
    console.log('Modal fechado:', data);
  }

  async onAddEscala() {
    const modal = await this.modalController.create({
      component: EscalaEditorComponent,
      componentProps: {
        escala: null, // Para criar uma nova escala
        department: this.department
      },
      breakpoints: [0, 0.5, 0.8, 1],
      initialBreakpoint: 0.8,
      backdropDismiss: true,
      showBackdrop: true,
      canDismiss: true
    });

    modal.present();
    
    // Aguardar o modal ser fechado
    const { data, role } = await modal.onWillDismiss();
    
    if (role === 'confirm' && data) {
      // Adicionar a nova escala à lista
      this.escalas.push(data);
      
      // Atualizar localStorage
      this.saveEscalasToStorage();
      
      console.log('Nova escala criada:', data);
    }
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