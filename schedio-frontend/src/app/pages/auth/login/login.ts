import { Component, PLATFORM_ID, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { InputField } from '../../../shared/components/ui/input-field/input-field';
import { RectBaseButton } from '../../../shared/components/ui/rect-base-button/rect-base-button';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [InputField, RectBaseButton, RouterModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm = { email: '', password: '' };
  isSubmitting = false;
  missingEmail = false;
  missingPassword = false;
  missingFields = false;
  wrongCredentials = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  login() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    this.missingEmail = !this.loginForm.email;
    this.missingPassword = !this.loginForm.password;
    this.missingFields = this.missingEmail || this.missingPassword;
    this.wrongCredentials = false;

    if (this.missingFields) {
      this.isSubmitting = false;
      return;
    }

    this.authService.login(this.loginForm).subscribe({
      next: () => {
        console.log('Successful Login');
        this.router.navigate(['/ticket']); //TODO change to actual home page
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Login Error:', err);
      },
    });
    this.wrongCredentials = true;
  }
}
