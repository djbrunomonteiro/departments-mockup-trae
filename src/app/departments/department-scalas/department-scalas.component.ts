import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { IDepartment } from 'src/app/models/departments.interface';
import { DepartmentScalaComponent } from '../department-scala/department-scala.component';

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
  imports: [CommonModule, IonicModule, DepartmentScalaComponent]
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
      initialBreakpoint: 0.8
    });

    await modal.present();
  }

  onAddEscala() {
    // Adicionar nova escala
    console.log('Adicionar nova escala');
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('pt-BR');
  }

  toggleExpandAll() {
    this.isExpanded = !this.isExpanded;
    console.log('Toggle expand all:', this.isExpanded);
  }

}