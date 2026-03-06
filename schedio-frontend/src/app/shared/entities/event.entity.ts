export interface Event {
  id?: string;
  title: string;
  description?: string;
  date: Date | string;
  agendas: string[];
  subject?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
