import { ChartConfiguration } from "chart.js";

export interface IChartProgressData {
  labels: string[];
  datasets: any[];
  options?: ChartConfiguration["options"];
  fieldName?: string;
  total?: number;
  badges: { label: string; color: string }[];
}
