export enum Division {
  example1 = "example1",
  example2 = "example2",
}

export type Visit = {
  id: string;
  visitorCIN: string;
  division: Division;
  visitDate: Date;
  visitReason: String;
  createdAt: Date;
  updatedAt: Date;
};
