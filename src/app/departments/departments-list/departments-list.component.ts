import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IDepartment } from 'src/app/models/departments.interface';
import { ION_DEFAULT_IMPORTS } from 'src/app/imports/ionic-groups-standalone';
import { CommonModule, NgFor, NgIf, SlicePipe } from '@angular/common';
import { ModalController } from '@ionic/angular/standalone';
import { DepartmentEditorComponent } from '../department-editor/department-editor.component';

@Component({
  selector: 'app-departments-list',
  templateUrl: './departments-list.component.html',
  styleUrls: ['./departments-list.component.scss'],
  standalone: true,
  imports: [
    ION_DEFAULT_IMPORTS,
    NgFor,
    NgIf,
    CommonModule,
    SlicePipe,
    DepartmentEditorComponent
  ]
})
export class DepartmentsListComponent implements OnInit {

  departments: IDepartment[] = [];

  constructor(private router: Router, private modalController: ModalController) { }

  ngOnInit() {
    this.loadDepartments();
  }

  loadDepartments() {
    // Carregar departamentos do localStorage ou usar mock
    const savedDepartments = localStorage.getItem('departments_mock');
    if (savedDepartments) {
      this.departments = JSON.parse(savedDepartments);
    } else {
      this.departments = this.getMockDepartments();
      // Salvar o mock inicial no localStorage
      localStorage.setItem('departments_mock', JSON.stringify(this.departments));
    }
  }

  getMockDepartments(): IDepartment[] {
    return [
      {
        id: 1,
        id_institution: 83204,
        name: 'Recursos Humanos',
        description: 'Departamento responsável pela gestão de pessoas e talentos',
        thumbnail: 'https://ionicframework.com/docs/img/demos/thumbnail.svg',
        parent_id: null,
        leaders: [1, 2],
        participants: [
          {
            participants_id: 1,
            participants_name: 'Ana Silva',
            role: 'Gerente'
          },
          {
            participants_id: 2,
            participants_name: 'Carlos Santos',
            role: 'Analista'
          },
          {
            participants_id: 3,
            participants_name: 'Maria Oliveira',
            role: 'Assistente'
          }
        ],
        roles: ['Gerente', 'Analista', 'Assistente']
      },
      {
        id: 2,
        id_institution: 83204,
        name: 'Tecnologia da Informação',
        description: 'Departamento de desenvolvimento e infraestrutura tecnológica',
        thumbnail: 'https://ionicframework.com/docs/img/demos/thumbnail.svg',
        parent_id: null,
        leaders: [4, 5],
        participants: [
          {
            participants_id: 4,
            participants_name: 'João Costa',
            role: 'Tech Lead'
          },
          {
            participants_id: 5,
            participants_name: 'Pedro Lima',
            role: 'Desenvolvedor Senior'
          },
          {
            participants_id: 6,
            participants_name: 'Lucas Ferreira',
            role: 'Desenvolvedor Junior'
          },
          {
            participants_id: 7,
            participants_name: 'Rafael Souza',
            role: 'DevOps'
          }
        ],
        roles: ['Tech Lead', 'Desenvolvedor Senior', 'Desenvolvedor Junior', 'DevOps']
      },
      {
        id: 3,
        id_institution: 83204,
        name: 'Marketing',
        description: 'Departamento de marketing e comunicação',
        thumbnail: 'https://ionicframework.com/docs/img/demos/thumbnail.svg',
        parent_id: null,
        leaders: [8],
        participants: [
          {
            participants_id: 8,
            participants_name: 'Fernanda Rocha',
            role: 'Coordenador'
          },
          {
            participants_id: 9,
            participants_name: 'Bruno Alves',
            role: 'Designer'
          },
          {
            participants_id: 10,
            participants_name: 'Camila Dias',
            role: 'Social Media'
          }
        ],
        roles: ['Coordenador', 'Designer', 'Social Media']
      },
      {
        id: 4,
        id_institution: 83204,
        name: 'Financeiro',
        description: 'Departamento financeiro e contábil',
        thumbnail: 'https://ionicframework.com/docs/img/demos/thumbnail.svg',
        parent_id: null,
        leaders: [11],
        participants: [
          {
            participants_id: 11,
            participants_name: 'Roberto Mendes',
            role: 'Controller'
          },
          {
            participants_id: 12,
            participants_name: 'Juliana Castro',
            role: 'Analista Financeiro'
          },
          {
            participants_id: 13,
            participants_name: 'Marcos Pereira',
            role: 'Assistente Contábil'
          }
        ],
        roles: ['Controller', 'Analista Financeiro', 'Assistente Contábil']
      },
      {
        id: 5,
        id_institution: 83204,
        name: 'Vendas',
        description: 'Departamento comercial e vendas',
        thumbnail: 'https://ionicframework.com/docs/img/demos/thumbnail.svg',
        parent_id: null,
        leaders: [14],
        participants: [
          {
            participants_id: 14,
            participants_name: 'Thiago Barbosa',
            role: 'Gerente de Vendas'
          },
          {
            participants_id: 15,
            participants_name: 'Larissa Gomes',
            role: 'Vendedor Senior'
          },
          {
            participants_id: 16,
            participants_name: 'Gabriel Martins',
            role: 'Vendedor Junior'
          },
          {
            participants_id: 17,
            participants_name: 'Amanda Silva',
            role: 'SDR'
          }
        ],
        roles: ['Gerente de Vendas', 'Vendedor Senior', 'Vendedor Junior', 'SDR']
      }
    ];
  }

  getParticipantsCount(department: IDepartment): number {
    return department.participants.length;
  }

  getRolesDisplay(department: IDepartment): string {
    return department.roles.join(', ');
  }

  onDepartmentClick(department: IDepartment) {
    console.log('Departamento selecionado:', department);
    this.router.navigate(['/tabs/departments', department.id]);
  }

  onEditDepartment(department: IDepartment, event: Event) {
    event.stopPropagation();
    console.log('Editar departamento:', department);
    // Aqui você pode implementar navegação para edição do departamento
  }

  onDeleteDepartment(department: IDepartment, event: Event) {
    event.stopPropagation();
    console.log('Deletar departamento:', department);
    // Aqui você pode implementar a lógica de exclusão
    this.departments = this.departments.filter(d => d.id !== department.id);
    // Atualizar localStorage
    localStorage.setItem('departments_mock', JSON.stringify(this.departments));
  }

  async onCreateDepartment() {
    const modal = await this.modalController.create({
      component: DepartmentEditorComponent,
      componentProps: {
        department: undefined // Para criar um novo departamento
      }
    });

    modal.present();

    const { data, role } = await modal.onWillDismiss();
    
    if (role === 'confirm' && data) {
      // Adicionar o novo departamento à lista
      const newDepartment = {
        ...data,
        id: this.getNextId()
      };
      this.departments.push(newDepartment);
      // Atualizar localStorage
      localStorage.setItem('departments_mock', JSON.stringify(this.departments));
      console.log('Novo departamento criado:', newDepartment);
    }
  }

  private getNextId(): number {
    return this.departments.length > 0 ? Math.max(...this.departments.map(d => d.id)) + 1 : 1;
  }

}