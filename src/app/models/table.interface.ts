export interface ITable {
  columns: IColumn[];
  data: any[];
}

export interface IColumn {
  id: string;
  label: string;
  sticky: boolean;
  cssClass?: string;
}
