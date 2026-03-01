import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../shared/entities/user.entity';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // apunta al backend
  private readonly API_URL = '/api/users';
  currentUser = signal<any>(null);

  constructor(private http: HttpClient) {}

  /**
   * Envía los datos del formulario de registro al backend.
   * @param userData Objeto con la información del nuevo usuario
   */
  register(userData: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/register`, userData);
  }

  login(credentials: any) {
    return this.http.post(`${this.API_URL}/login`, credentials).pipe(
      tap((response: any) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', response.token);
          this.currentUser.set(response.user);
        }
      })
    );
  }
}
