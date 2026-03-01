import { Component, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service'
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
  loginForm = {email: '', password: ''};
  isSubmitting = false;
  constructor(private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object) {}

  login() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    this.authService.login(this.loginForm).subscribe({
      next: () => {
          console.log('Successful Login');
          this.router.navigate(['/ticket']); //TODO change to actual home page
        },
      error: (err) => {
          this.isSubmitting = false;
          console.error('Login Error:', err);
          alert('Credenciales incorrectas');
        }
    });
  }
}
