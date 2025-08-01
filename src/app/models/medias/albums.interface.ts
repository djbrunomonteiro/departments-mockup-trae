
export interface Albums {
  count: number;
  created_at: string;
  description?: string;
  file_name?: string;
  id: number;
  id_institution: number;
  name: string;
  source?: string;
  source_id?: string;
  type: "photo" | "video";
  updated_at: string;
};

export interface Album{
  created_at: string;
  description?: string;
  file_name?: string;
  id: number;
  id_category: number;
  id_institution: number;
  name: string;
  source: string;
  source_id: string;
  type: "photo" | "video";
  updated_at: string;
};
