import { Component, PLATFORM_ID, Inject } from '@angular/core';
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
    missingUsername = false;
    missingEmail = false;
    missingBDay = false;
    missingPassword = false;
    passwordError = false;

    userForm = {
        username: '',
        email: '',
        birthDate: '',
        password: '',
        confirmPassword: '',
    };

    constructor(private authService: AuthService,
      private router: Router,
      private http: HttpClient,
      @Inject(PLATFORM_ID) private platformId: Object
      ) {}

    isSubmitting = false;
    register() {
        if (this.isSubmitting) return;
        this.isSubmitting = true;
        this.missingUsername = !this.userForm.username;
        this.missingEmail = !this.userForm.email;
        this.missingBDay = !this.userForm.birthDate;
        this.missingPassword = !this.userForm.password;
        this.passwordError = this.userForm.password != this.userForm.confirmPassword;

        if (this.missingUsername || this.missingEmail || this.missingBDay || this.missingPassword || this.passwordError) {
            this.isSubmitting = false;
            return;
        }

        const { confirmPassword, ...dataToSend } = this.userForm;

        this.authService.register(dataToSend).subscribe({
            next: (response) => {
                console.log('Successful Sign in', response);
                this.router.navigate(['/login']); // Redirige al éxito
            },
            error: (err) => {
                console.error('Sign in Error:', err);
                alert('No se pudo completar el registro. Revisa la consola.');
            },
            complete: () => {
                this.isSubmitting = false;
            }
        });
    }
}
