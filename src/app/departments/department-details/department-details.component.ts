import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IDepartment } from 'src/app/models/departments.interface';
import { ION_DEFAULT_IMPORTS } from 'src/app/imports/ionic-groups-standalone';
import { DepartmentScalasComponent } from '../department-scalas/department-scalas.component';
import { DepartmentTimelineComponent } from '../department-timeline/department-timeline.component';

@Component({
  selector: 'app-department-details',
  templateUrl: './department-details.component.html',
  styleUrls: ['./department-details.component.scss'],
  standalone: true,
  imports: [
    ION_DEFAULT_IMPORTS,
    DepartmentScalasComponent,
    DepartmentTimelineComponent
  ]
})
export class DepartmentDetailsComponent implements OnInit {

  @Input() department: IDepartment | undefined;

  // Mock de pessoas para exibir nomes dos participantes
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

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    // Obter o ID da rota
    const departmentId = this.route.snapshot.paramMap.get('id');
    if (departmentId) {
      this.loadDepartmentById(+departmentId);
    } else if (!this.department) {
      this.loadMockDepartment();
    }
  }

  loadDepartmentById(id: number) {
    // Tentar carregar do localStorage primeiro
    const savedDepartments = localStorage.getItem('departments');
    let departments: IDepartment[] = [];
    
    if (savedDepartments) {
      departments = JSON.parse(savedDepartments);
    } else {
      departments = this.getMockDepartments();
    }
    
    // Encontrar o departamento pelo ID
    this.department = departments.find(dept => dept.id === id);
    
    // Se não encontrar, carregar mock padrão
    if (!this.department) {
      this.loadMockDepartment();
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
            participants_name: 1,
            role: 'Gerente'
          },
          {
            participants_id: 2,
            participants_name: 2,
            role: 'Analista'
          },
          {
            participants_id: 3,
            participants_name: 3,
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
            participants_name: 4,
            role: 'Tech Lead'
          },
          {
            participants_id: 5,
            participants_name: 5,
            role: 'Desenvolvedor Senior'
          },
          {
            participants_id: 6,
            participants_name: 6,
            role: 'Desenvolvedor Junior'
          },
          {
            participants_id: 7,
            participants_name: 7,
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
            participants_name: 8,
            role: 'Coordenador'
          },
          {
            participants_id: 9,
            participants_name: 9,
            role: 'Designer'
          },
          {
            participants_id: 10,
            participants_name: 10,
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
            participants_name: 11,
            role: 'Controller'
          },
          {
            participants_id: 12,
            participants_name: 12,
            role: 'Analista Financeiro'
          },
          {
            participants_id: 13,
            participants_name: 13,
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
            participants_name: 14,
            role: 'Gerente de Vendas'
          },
          {
            participants_id: 15,
            participants_name: 15,
            role: 'Vendedor Senior'
          },
          {
            participants_id: 16,
            participants_name: 16,
            role: 'Vendedor Junior'
          },
          {
            participants_id: 17,
            participants_name: 17,
            role: 'SDR'
          }
        ],
        roles: ['Gerente de Vendas', 'Vendedor Senior', 'Vendedor Junior', 'SDR']
      }
    ];
  }

  loadMockDepartment() {
    this.department = {
      id: 1,
      id_institution: 83204,
      name: 'Tecnologia da Informação',
      description: 'Departamento responsável pelo desenvolvimento e manutenção de sistemas, infraestrutura tecnológica e suporte técnico para toda a organização.',
      thumbnail: 'https://ionicframework.com/docs/img/demos/thumbnail.svg',
      parent_id: null,
      leaders: [1, 4],
      participants: [
        {
          participants_id: 1,
          participants_name: 1,
          role: 'Tech Lead'
        },
        {
          participants_id: 4,
          participants_name: 4,
          role: 'Desenvolvedor Senior'
        },
        {
          participants_id: 7,
          participants_name: 7,
          role: 'Desenvolvedor Junior'
        },
        {
          participants_id: 10,
          participants_name: 10,
          role: 'DevOps'
        },
        {
          participants_id: 15,
          participants_name: 15,
          role: 'QA Analyst'
        }
      ],
      roles: ['Tech Lead', 'Desenvolvedor Senior', 'Desenvolvedor Junior', 'DevOps', 'QA Analyst']
    };
  }

  getPersonName(participantId: number): string {
    const person = this.people.find(p => p.id === participantId);
    return person ? person.name : `Participante ${participantId}`;
  }

  getRolesDisplay(): string {
    if (!this.department?.roles || this.department.roles.length === 0) {
      return 'Nenhuma função definida';
    }
    return this.department.roles.join(' | ');
  }

  getParticipantsCount(): number {
    return this.department?.participants?.length || 0;
  }

  isLeader(participantId: number): boolean {
    return this.department?.leaders?.includes(participantId) || false;
  }

  onEditDepartment() {
    console.log('Editar departamento:', this.department);
    // Aqui você pode implementar navegação para o editor
  }

  onBackClick() {
    console.log('Voltar para lista');
    this.router.navigate(['/tabs/departments']);
  }
}