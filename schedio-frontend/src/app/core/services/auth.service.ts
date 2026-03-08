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
  currentUser = signal<any>(this.getStoredUser());

  private getStoredUser() {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }


  constructor(private http: HttpClient) {}

  

  getCurrentUser(): any {
    return this.currentUser(); // Now always reflects the most recent state
  }

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
          localStorage.setItem('user', JSON.stringify(response.user));
          this.currentUser.set(response.user);
        }
      })
    );
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this.currentUser.set(null);
  }

  /**
   * Returns the current user, checking memory first, then localStorage.
   */
  
  /**
   * Actualiza campos de usuario por _id
   */
  updateUserById(id: string, fields: any): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/id/${id}`, fields);
  }
}
