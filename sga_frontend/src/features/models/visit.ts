export enum Division {
  division1 = "division1",
  division2 = "division2",
  division3 = "division3",
  division4 = "division4",
  division5 = "division5",
}

export interface DivisionOption {
  value: Division;
  label: string;
}

export const divisionOptions: DivisionOption[] = [
  { value: Division.division1, label: "القسم الأول" },
  { value: Division.division2, label: "القسم الثاني" },
  { value: Division.division3, label: "القسم الثالث" },
  { value: Division.division4, label: "القسم الرابع" },
  { value: Division.division5, label: "القسم الخامس" },
];

export type Visit = {
  id: string;
  visitorCIN: string;
  divisions: Division[];
  visitDate: Date;
  visitReason: String;
  createdAt: Date;
  updatedAt: Date;
};
