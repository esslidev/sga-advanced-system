export type Division =
  | "division1"
  | "division2"
  | "division3"
  | "division4"
  | "division5";

export const Division = {
  division1: "division1" as Division,
  division2: "division2" as Division,
  division3: "division3" as Division,
  division4: "division4" as Division,
  division5: "division5" as Division,
};

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
  divisions: Division[];
  visitDate: Date;
  visitReason: string;
  createdAt: Date;
  updatedAt: Date;
};
