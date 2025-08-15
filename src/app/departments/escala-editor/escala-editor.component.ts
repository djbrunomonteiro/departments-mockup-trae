import { CommonModule } from '@angular/common';
import { ION_DEFAULT_IMPORTS } from './../../imports/ionic-groups-standalone';
import { Component, OnInit, Input, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ModalController, AlertController, IonDatetimeButton, IonDatetime } from '@ionic/angular/standalone';
import { IDepartment } from 'src/app/models/departments.interface';

interface ParticipanteEscala {
  id: number;
  name: string;
  role: string;
  customRole?: string; // Função personalizada para esta escala específica
}

interface Escala {
  id: number;
  titulo: string;
  dataInicial: Date;
  dataFinal: Date;
  local: string;
  participantes: string[] | ParticipanteEscala[];
  observacoes: string;
  status: 'ativa' | 'concluida' | 'pendente';
}

@Component({
  selector: 'app-escala-editor',
  templateUrl: './escala-editor.component.html',
  styleUrls: ['./escala-editor.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,ION_DEFAULT_IMPORTS, IonDatetimeButton, IonDatetime
  ]
})
export class EscalaEditorComponent implements OnInit {

  @Input() escala: Escala | null = null;
  @Input() department: IDepartment | null = null;

  form = this.fb.group({
    titulo: ['', [Validators.required, Validators.minLength(3)]],
    dataInicial: [new Date().toISOString(), [Validators.required]],
    dataFinal: [new Date().toISOString(), [Validators.required]],
    local: ['', [Validators.required, Validators.minLength(3)]],
    participantes: this.fb.control([] as any[]),
    observacoes: [''],
    status: ['pendente', [Validators.required]]
  });

  isEditMode: boolean = false;
  selectedParticipants: any[] = [];
  availableParticipants: any[] = [];

  currentDate = signal(new Date().toISOString())

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private alertController: AlertController
  ) {

  }

  ngOnInit() {
    this.isEditMode = !!this.escala;
    
    // Carregar participantes disponíveis do departamento
    if (this.department?.participants) {
      this.availableParticipants = this.department.participants.map(p => ({
        id: p.participants_id,
        name: p.participants_name || `Participante ${p.participants_id}`,
        role: p.role
      }));
    }
    
    if (this.escala) {
      // Para escalas existentes, usar a nova estrutura de participantes
      if (Array.isArray(this.escala.participantes)) {
        this.selectedParticipants = this.escala.participantes.map(participante => {
          if (typeof participante === 'string') {
            // Compatibilidade com formato antigo
            const participant = this.availableParticipants.find(p => p.name === participante);
            return participant || { id: Date.now(), name: participante, role: 'Membro' };
          } else {
            // Novo formato com função personalizada
            return participante;
          }
        });
      } else {
        this.selectedParticipants = [];
      }
      
      this.form.patchValue({
        titulo: this.escala.titulo,
        dataInicial: this.escala.dataInicial.toISOString(),
        dataFinal: this.escala.dataFinal.toISOString(),
        local: this.escala.local,
        participantes: this.selectedParticipants,
        observacoes: this.escala.observacoes,
        status: this.escala.status
      });
    }
  }

  // Métodos para gerenciar participantes
  async addParticipant(participant: any) {
    const existingParticipant = this.selectedParticipants.find(p => p.id === participant.id);
    
    if (!existingParticipant) {
      // Participante não selecionado - adicionar novo
      const customRole = await this.selectParticipantRole(participant);
      if (customRole !== null) {
        const participantWithRole = {
          ...participant,
          customRole: customRole || participant.role
        };
        this.selectedParticipants.push(participantWithRole);
        this.updateFormParticipants();
      }
    } else {
      // Participante já selecionado - editar função
      const customRole = await this.selectParticipantRole(existingParticipant);
      if (customRole !== null) {
        existingParticipant.customRole = customRole || participant.role;
        this.updateFormParticipants();
      }
    }
  }

  removeParticipant(participantId: number) {
    this.selectedParticipants = this.selectedParticipants.filter(p => p.id !== participantId);
    this.updateFormParticipants();
  }

  private updateFormParticipants() {
    // Agora salvamos a estrutura completa dos participantes
    this.form.patchValue({ participantes: this.selectedParticipants });
  }

  getAvailableParticipants() {
    return this.availableParticipants.filter(p => 
      !this.selectedParticipants.find(sp => sp.id === p.id)
    );
  }

  async selectParticipantRole(participant: any): Promise<string | null> {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header: `Função para ${participant.name}`,
        message: 'Selecione ou digite a função deste participante nesta escala:',
        inputs: [
          {
            name: 'customRole',
            type: 'text',
            placeholder: 'Digite uma função personalizada...',
            value: ''
          },
          {
            name: 'roleOption',
            type: 'radio',
            label: `Usar função padrão: ${participant.role}`,
            value: participant.role,
            checked: true
          },
          {
            name: 'roleOption',
            type: 'radio',
            label: 'Coordenador',
            value: 'Coordenador'
          },
          {
            name: 'roleOption',
            type: 'radio',
            label: 'Supervisor',
            value: 'Supervisor'
          },
          {
            name: 'roleOption',
            type: 'radio',
            label: 'Assistente',
            value: 'Assistente'
          },
          {
            name: 'roleOption',
            type: 'radio',
            label: 'Especialista',
            value: 'Especialista'
          }
        ],
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              resolve(null);
            }
          },
          {
            text: 'Confirmar',
            handler: (data) => {
              // Se há texto personalizado, usar ele
              if (data.customRole && data.customRole.trim()) {
                resolve(data.customRole.trim());
              } else {
                // Senão, usar a opção selecionada
                resolve(data.roleOption || participant.role);
              }
            }
          }
        ]
      });

      await alert.present();
    });
  }

  async save() {
    if (this.form.valid) {
      const formValue = this.form.value;
      
      const escalaData: Escala = {
        id: this.escala?.id || this.generateRandomId(),
        titulo: formValue.titulo as any,
        dataInicial: new Date(formValue.dataInicial as any),
        dataFinal: new Date(formValue.dataFinal as any),
        local: formValue.local as any,
        participantes: this.selectedParticipants.map(p => p.name),
        observacoes: formValue.observacoes || '',
        status: formValue.status as any,
      };

      // Validar se data final é posterior à data inicial
      if (escalaData.dataFinal <= escalaData.dataInicial) {
        const alert = await this.alertController.create({
          header: 'Erro de Validação',
          message: 'A data final deve ser posterior à data inicial.',
          buttons: ['OK']
        });
        await alert.present();
        return;
      }

      // Salvar no localStorage
      try {
        const escalasExistentes = JSON.parse(localStorage.getItem('escalas_mock') || '[]');
        
        if (this.isEditMode) {
          const index = escalasExistentes.findIndex((e: Escala) => e.id === escalaData.id);
          if (index !== -1) {
            escalasExistentes[index] = escalaData;
          }
        } else {
          escalasExistentes.push(escalaData);
        }
        
        localStorage.setItem('escalas_mock', JSON.stringify(escalasExistentes));
        
        console.log('Escala salva:', escalaData);
        
        // Fechar modal e retornar dados
        await this.modalCtrl.dismiss(escalaData, 'confirm');
        
      } catch (error) {
        console.error('Erro ao salvar escala:', error);
        const alert = await this.alertController.create({
          header: 'Erro',
          message: 'Erro ao salvar a escala. Tente novamente.',
          buttons: ['OK']
        });
        await alert.present();
      }
    } else {
      // Marcar todos os campos como touched para mostrar erros
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });
      
      const alert = await this.alertController.create({
        header: 'Formulário Inválido',
        message: 'Por favor, preencha todos os campos obrigatórios corretamente.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  async cancel() {
    await this.modalCtrl.dismiss(null, 'cancel');
  }

  // Métodos auxiliares para o template
  getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (field?.errors && field?.touched) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} é obrigatório`;
      }
      if (field.errors['minlength']) {
        return `${this.getFieldLabel(fieldName)} deve ter pelo menos ${field.errors['minlength'].requiredLength} caracteres`;
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      titulo: 'Título',
      dataInicial: 'Data inicial',
      dataFinal: 'Data final',
      local: 'Local',
      observacoes: 'Observações',
      status: 'Status'
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  getStatusOptions() {
    return [
      { value: 'pendente', label: 'Pendente' },
      { value: 'ativa', label: 'Ativa' },
      { value: 'concluida', label: 'Concluída' }
    ];
  }

  private generateRandomId(): number {
    return Math.floor(Math.random() * 1000000) + 1;
  }

}