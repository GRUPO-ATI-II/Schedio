export interface Assignment {
  id?: string;
  title: string;
  instructions?: string;
  deadline: Date | string;
  ponderation: number;
  subject: string;
  send_time?: Date;
}
