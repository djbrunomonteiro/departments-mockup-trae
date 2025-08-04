import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-department-timeline',
  templateUrl: './department-timeline.component.html',
  styleUrls: ['./department-timeline.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class DepartmentTimelineComponent implements OnInit {
  @Input() department: any;
  
  currentWeekOffset: number = 0; // 0 = semana atual, -1 = semana anterior, 1 = próxima semana
  
  constructor() { }

  ngOnInit() {
  }

  getCurrentWeekRange(): string {
    const currentDate = new Date();
    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - currentDate.getDay() + (this.currentWeekOffset * 7));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    return `${weekStart.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} - ${weekEnd.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}`;
  }

  getWeeklyEvents(): any[] {
    const events: any[] = [];
    const currentDate = new Date();
    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - currentDate.getDay() + (this.currentWeekOffset * 7));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    // Simular eventos da semana baseados nas escalas do departamento
    if (this.department && this.department.escalas) {
      this.department.escalas.forEach((escala: any) => {
        const escalaDate = new Date(escala.dataInicial);
        
        // Verificar se a escala está dentro da semana selecionada
        if (escalaDate >= weekStart && escalaDate <= weekEnd) {
          // Evento de criação da escala (simular 2 dias antes)
          const creationDate = new Date(escalaDate);
          creationDate.setDate(escalaDate.getDate() - 2);
          if (creationDate >= weekStart) {
            events.push({
              type: 'created',
              time: this.formatEventTime(creationDate, 'created'),
              description: `Escala "${escala.titulo}" foi criada`
            });
          }

          // Eventos de participação (simular participantes aceitando)
          escala.participantes.forEach((participant: string, index: number) => {
            const participationDate = new Date(escalaDate);
            participationDate.setDate(escalaDate.getDate() - 1 + (index * 0.1)); // Espalhar ao longo do tempo
            if (participationDate >= weekStart && participationDate <= new Date()) {
              events.push({
                type: 'participation',
                time: this.formatEventTime(participationDate, 'participation'),
                description: `${participant} aceitou participar da escala "${escala.titulo}"`
              });
            }
          });

          // Evento da escala acontecendo
          if (escalaDate <= new Date()) {
            events.push({
              type: 'event',
              time: this.formatEventTime(escalaDate, 'event'),
              description: `Escala "${escala.titulo}" aconteceu`
            });
          } else {
            events.push({
              type: 'upcoming',
              time: this.formatEventTime(escalaDate, 'upcoming'),
              description: `Escala "${escala.titulo}" vai acontecer`
            });
          }
        }
      });
    }

    // Adicionar eventos mock de participantes aceitando escalas
    if (this.currentWeekOffset === 0) { // Apenas para semana atual
      // Mock: Bruno aceitou Escala A (ontem)
      const brunoAcceptDate = new Date(weekStart);
      brunoAcceptDate.setDate(weekStart.getDate() + 1);
      brunoAcceptDate.setHours(14, 30, 0, 0);
      events.push({
         type: 'participation',
         time: this.formatEventTime(brunoAcceptDate, 'participation'),
         description: 'BRUNO aceitou ESCALA A'
       });

      // Mock: Maria aceitou Workshop de Capacitação (hoje)
      const mariaAcceptDate = new Date(weekStart);
      mariaAcceptDate.setDate(weekStart.getDate() + 2);
      mariaAcceptDate.setHours(9, 15, 0, 0);
      events.push({
         type: 'participation',
         time: this.formatEventTime(mariaAcceptDate, 'participation'),
         description: 'MARIA aceitou WORKSHOP DE CAPACITAÇÃO'
       });

      // Mock: João aceitou Reunião de Planejamento (anteontem)
      const joaoAcceptDate = new Date(weekStart);
      joaoAcceptDate.setDate(weekStart.getDate() + 3);
      joaoAcceptDate.setHours(16, 45, 0, 0);
      events.push({
         type: 'participation',
         time: this.formatEventTime(joaoAcceptDate, 'participation'),
         description: 'JOÃO aceitou REUNIÃO DE PLANEJAMENTO'
       });

      // Simular alguns avisos criados durante a semana
      const noticeDate = new Date(weekStart);
      noticeDate.setDate(weekStart.getDate() + 4);
      events.push({
         type: 'notice',
         time: this.formatEventTime(noticeDate, 'notice'),
         description: 'Aviso sobre mudanças no cronograma foi criado'
       });
    }

    // Ordenar eventos por data (mais recentes primeiro)
    return events.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  }

  private formatEventTime(date: Date, eventType?: string): string {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    // Para eventos de participação, usar apenas DD/MM
    if (eventType === 'participation') {
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    }
    
    if (this.currentWeekOffset === 0) {
      if (date.toDateString() === today.toDateString()) {
        return `Hoje, ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
      } else if (date.toDateString() === yesterday.toDateString()) {
        return `Ontem, ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
      }
    }
    
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'short', 
      day: '2-digit', 
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  previousWeek(): void {
    this.currentWeekOffset--;
  }

  nextWeek(): void {
    this.currentWeekOffset++;
  }

  getCurrentWeekLabel(): string {
    if (this.currentWeekOffset === 0) {
      return 'Esta Semana';
    } else if (this.currentWeekOffset === -1) {
      return 'Semana Anterior';
    } else if (this.currentWeekOffset === 1) {
      return 'Próxima Semana';
    } else if (this.currentWeekOffset < -1) {
      return `${Math.abs(this.currentWeekOffset)} semanas atrás`;
    } else {
      return `Em ${this.currentWeekOffset} semanas`;
    }
  }

  canGoNext(): boolean {
    return this.currentWeekOffset < 4; // Limitar a 4 semanas no futuro
  }

  canGoPrevious(): boolean {
    return this.currentWeekOffset > -8; // Limitar a 8 semanas no passado
  }

  getPreviousWeekDate(): string {
    const currentDate = new Date();
    const prevWeekStart = new Date(currentDate);
    prevWeekStart.setDate(currentDate.getDate() - currentDate.getDay() + ((this.currentWeekOffset - 1) * 7));
    return prevWeekStart.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  }

  getNextWeekDate(): string {
    const currentDate = new Date();
    const nextWeekStart = new Date(currentDate);
    nextWeekStart.setDate(currentDate.getDate() - currentDate.getDay() + ((this.currentWeekOffset + 1) * 7));
    return nextWeekStart.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  }
}