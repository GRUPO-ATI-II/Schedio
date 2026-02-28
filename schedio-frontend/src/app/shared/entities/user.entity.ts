export interface User {
  _id?: string;             // Generado por MongoDB
  firstName: string;
  lastName: string;
  email: string;
  password?: string;        // Opcional, ya que no lo recibiremos del backend por seguridad
  birthDate: Date | string;
  role?: 'user' | 'admin';  // Valor por defecto 'user'
  createdAt?: Date;
}
