import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { ModalController } from '@ionic/angular/standalone';
import { ION_DEFAULT_IMPORTS } from '../../imports/ionic-groups-standalone';
import { IDepartment } from '../../models/departments.interface';

interface AgendaItem {
  dataInicial: Date;
  dataFinal: Date;
  participantes: string[];
  local: string;
  observacoes: string;
}

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
  selector: 'app-department-scala',
  templateUrl: './department-scala.component.html',
  styleUrls: ['./department-scala.component.scss'],
  standalone: true,
  imports: [CommonModule, ION_DEFAULT_IMPORTS, TitleCasePipe]
})
export class DepartmentScalaComponent implements OnInit {
  @Input() department: IDepartment | null = null;
  @Input() escala: Escala | null = null;

  // Dados da agenda (exemplo)
  agendaItem: AgendaItem = {
    dataInicial: new Date('2024-01-15'),
    dataFinal: new Date('2024-01-19'),
    participantes: [],
    local: 'Sala de Reuniões A',
    observacoes: 'Reunião de planejamento estratégico do departamento'
  };

  constructor(private modalController: ModalController) {
    // Inicializar participantes baseado no departamento
    this.updateParticipantes();
  }

  ngOnInit() {
    this.updateParticipantes();
    this.updateAgendaFromEscala();
  }

  updateParticipantes() {
    if (this.escala?.participantes) {
      this.agendaItem.participantes = this.escala.participantes;
    } else if (this.department?.participants) {
      this.agendaItem.participantes = this.department.participants.map(p => `Participante ${p.participants_id}`);
    }
  }

  updateAgendaFromEscala() {
    if (this.escala) {
      this.agendaItem = {
        dataInicial: this.escala.dataInicial,
        dataFinal: this.escala.dataFinal,
        participantes: this.escala.participantes,
        local: this.escala.local,
        observacoes: this.escala.observacoes
      };
    }
  }

  getScalaLevel(): string {
    if (!this.department || !this.department.participants) {
      return 'Pequeno';
    }

    const participantCount = this.department.participants.length;
    
    if (participantCount <= 5) {
      return 'Pequeno';
    } else if (participantCount <= 15) {
      return 'Médio';
    } else {
      return 'Grande';
    }
  }

  getScalaColor(): string {
    const level = this.getScalaLevel();
    
    switch (level) {
      case 'Pequeno':
        return 'success';
      case 'Médio':
        return 'warning';
      case 'Grande':
        return 'danger';
      default:
        return 'medium';
    }
  }

  getScalaIcon(): string {
    const level = this.getScalaLevel();
    
    switch (level) {
      case 'Pequeno':
        return 'people-outline';
      case 'Médio':
        return 'people';
      case 'Grande':
        return 'business-outline';
      default:
        return 'people-outline';
    }
  }

  getParticipantCount(): number {
    return this.department?.participants?.length || 0;
  }

  async closeModal() {
    try {
      await this.modalController.dismiss();
      console.log('Modal fechado com sucesso');
    } catch (error) {
      console.error('Erro ao fechar modal:', error);
      // Fallback: tentar fechar o modal de forma alternativa
      const topModal = await this.modalController.getTop();
      if (topModal) {
        await topModal.dismiss();
      }
    }
  }
}