export interface Event {
  id?: string;
  title: string;
  description?: string;
  date: Date | string;
  endDate?: Date | string;
  isAllDay?: boolean;
  agendas: string[];
  subject?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
