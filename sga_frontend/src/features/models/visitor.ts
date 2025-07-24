import type { Visit } from "./visit";

export type Visitor = {
  id: string;
  CIN: string;
  firstName: string;
  lastName: string;
  visitsCount: number;
  visits: Visit[];
  createdAt: Date;
  updatedAt: Date;
};
