import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ModalController, AlertController } from '@ionic/angular/standalone';
import { ION_DEFAULT_IMPORTS } from '../../imports/ionic-groups-standalone';
import { IonDatetimeButton } from '@ionic/angular/standalone';
import { IDepartment } from 'src/app/models/departments.interface';

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
  selector: 'app-escala-editor',
  templateUrl: './escala-editor.component.html',
  styleUrls: ['./escala-editor.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    ION_DEFAULT_IMPORTS, 
    ReactiveFormsModule, IonDatetimeButton]
})
export class EscalaEditorComponent implements OnInit {

  @Input() escala: Escala | null = null;
  @Input() department: IDepartment | null = null;

  form: FormGroup;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private alertController: AlertController
  ) {
    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      dataInicial: ['', [Validators.required]],
      dataFinal: ['', [Validators.required]],
      local: ['', [Validators.required, Validators.minLength(3)]],
      participantes: [[]],
      observacoes: [''],
      status: ['pendente', [Validators.required]]
    });
  }

  ngOnInit() {
    // this.isEditMode = !!this.escala;
    
    // if (this.escala) {
    //   this.form.patchValue({
    //     titulo: this.escala.titulo,
    //     dataInicial: this.escala.dataInicial.toISOString(),
    //     dataFinal: this.escala.dataFinal.toISOString(),
    //     local: this.escala.local,
    //     participantes: this.escala.participantes,
    //     observacoes: this.escala.observacoes,
    //     status: this.escala.status
    //   });
    // }
  }

  async save() {
    if (this.form.valid) {
      const formValue = this.form.value;
      
      const escalaData: Escala = {
        id: this.escala?.id || this.generateRandomId(),
        titulo: formValue.titulo,
        dataInicial: new Date(formValue.dataInicial),
        dataFinal: new Date(formValue.dataFinal),
        local: formValue.local,
        participantes: formValue.participantes || [],
        observacoes: formValue.observacoes || '',
        status: formValue.status
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

  getCurrentDate(): string {
    return new Date().toISOString();
  }
}