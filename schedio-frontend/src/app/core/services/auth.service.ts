import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../shared/entities/user.entity';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // apunta al backend
  private readonly API_URL = '/api/users';

  constructor(private http: HttpClient) {}

  /**
   * Envía los datos del formulario de registro al backend.
   * @param userData Objeto con la información del nuevo usuario
   */
  register(userData: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/register`, userData);
  }

  // Aquí podrás añadir login(), logout(), etc., más adelante.
}
