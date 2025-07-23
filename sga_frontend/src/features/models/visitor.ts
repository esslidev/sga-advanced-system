import type { Visit } from "./visit";

export type Visitor = {
  id: string;
  CIN: string;
  firstName: string;
  lastName: string;
  visits: Visit[];
  createdAt: Date;
  updatedAt: Date;
};
