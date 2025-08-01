export interface IInstitutions {
  message?: string | {};
  institutions?: Array<IInstitution>;
}

export interface IInstitution {
  address_1?: string;
  address_2?: string;
  address_number?: string;
  created_at?: string;
  default_color?: string;
  id: number
  id_city?: number
  id_country: string;
  id_people_adm?: number
  id_plan?: number
  id_state: string;
  logo_image?: string;
  name: string;
  suspended?: number;
  website_slug?: string;
  website_status?: number;
}
