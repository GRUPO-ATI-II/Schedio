import { Component, PLATFORM_ID, Inject, ChangeDetectorRef } from '@angular/core';
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
    private static readonly EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    missingUsername = false;
    missingEmail = false;
    invalidEmail = false;
    missingBDay = false;
    missingPassword = false;
    passwordError = false;
    weakPasswordError = false;
    missingFields = false;

    userForm = {
        userName: '',
        email: '',
        birthDate: '',
        password: '',
        confirmPassword: '',
    };

    constructor(
      private authService: AuthService,
      private router: Router,
      private http: HttpClient,
      private cdr: ChangeDetectorRef,
      @Inject(PLATFORM_ID) private platformId: Object,
    ) {}

    isSubmitting = false;
    register() {
        if (this.isSubmitting) return;
        this.isSubmitting = true;
        this.missingUsername = !this.userForm.userName;
        this.missingEmail = !this.userForm.email;
        this.invalidEmail = !!this.userForm.email && !Register.EMAIL_REGEX.test(this.userForm.email.trim());
        this.missingBDay = !this.userForm.birthDate;
        this.missingPassword = !this.userForm.password;
        this.passwordError = this.userForm.password != this.userForm.confirmPassword;
        this.weakPasswordError = !this.isStrongPassword(this.userForm.password);

        this.missingFields = this.missingUsername || this.missingEmail || this.missingBDay || this.missingPassword;
        if (this.missingFields || this.invalidEmail || this.passwordError || this.weakPasswordError) {
            this.isSubmitting = false;
            this.cdr.detectChanges();
            return;
        }

        const { confirmPassword, ...dataToSend } = this.userForm;

        this.authService.register(dataToSend).subscribe({
            next: () => {
                this.router.navigate(['/login'], { state: { registrationSuccess: true } });
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

    // Política: mínimo 8 caracteres, al menos una mayúscula, una minúscula, un número y un carácter especial
    isStrongPassword(password: string): boolean {
        if (!password) return false;
        const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
        return strongRegex.test(password);
    }
}
