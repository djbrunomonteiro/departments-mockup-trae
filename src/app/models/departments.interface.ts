export interface IDepartment {
  id: number;
  id_institution: number;
  name: string;
  description?: string;
  thumbnail?: string;
  parent_id: number | null;
  leaders: number[];
  participants: {
    participants_id: number;
    participants_name?: string;
    role: string;
  }[];
  roles: string[];
  children?: IDepartment[]
}
