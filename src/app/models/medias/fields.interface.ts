export interface IOption {
  identifier: string;
  optionName: string;
}

export interface IExtrafield {
  name: string;
  typeField:
    | "input"
    | "text-area"
    | "select"
    | "radio"
    | "checkbox"
    | "date"
    | "number";
  required: boolean;
  identifier: string;
  hide: boolean;
  options?: IOption[];
}
