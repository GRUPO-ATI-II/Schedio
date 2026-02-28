import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputField } from '../../../shared/components/ui/input-field/input-field';
import { RectBaseButton } from '../../../shared/components/ui/rect-base-button/rect-base-button';
import { DateField } from '../../../shared/components/ui/date-field/date-field';
import { AuthService } from '../../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-register',
    imports: [InputField, RectBaseButton, RouterModule, DateField, FormsModule],
    templateUrl: './register.html',
    styleUrl: './register.css',
})
export class Register {
    userForm = {
        firstName: '',
        lastName: '',
        email: '',
        birthDate: '',
        password: ''
    };

    constructor(private authService: AuthService, private router: Router, private http: HttpClient) {
      this.testConnection();
      }

    testConnection() {
      this.http.get('http://backend:3000/api/test-db').subscribe({
        next: (res) => console.log('✅ Successful Connection:', res),
        error: (err) => console.error('❌ Connection Error:', err)
      });
    }
    isSubmitting = false;
    register() {
        if (this.isSubmitting) return;
        this.isSubmitting = true;

        if (!this.userForm.email || !this.userForm.password) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        this.authService.register(this.userForm).subscribe({
            next: (response) => {
                console.log('Registro exitoso', response);
                this.router.navigate(['/login']); // Redirige al éxito
            },
            error: (err) => {
                console.error('Error en el registro:', err);
                alert('No se pudo completar el registro. Revisa la consola.');
            }
        });
    }
}
