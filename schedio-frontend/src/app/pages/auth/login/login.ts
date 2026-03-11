import { Component, PLATFORM_ID, Inject, ChangeDetectorRef, OnInit } from '@angular/core';
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
export class Login implements OnInit {
  loginForm = {email: '', password: ''};
  isSubmitting = false;
  missingEmail = false;
  missingPassword = false;
  missingFields = false;
  wrongCredentials = false;
  showRegistrationSuccess = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit() {
    const state = this.router.getCurrentNavigation()?.extras?.state ?? history.state;
    this.showRegistrationSuccess = (state as { registrationSuccess?: boolean })?.registrationSuccess === true;
  }

  login() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    this.missingEmail = !this.loginForm.email;
    this.missingPassword = !this.loginForm.password;
    this.missingFields = this.missingEmail || this.missingPassword;
    this.wrongCredentials = false;

    if (this.missingFields) {
      this.isSubmitting = false;
      this.cdr.detectChanges();
      return;
    }

    this.authService.login(this.loginForm).subscribe({
      next: () => {
        this.wrongCredentials = false;
        this.router.navigate(['/agenda']);
      },
      error: () => {
        this.wrongCredentials = true;
        this.isSubmitting = false;
        setTimeout(() => this.cdr.detectChanges(), 0);
      },
    });
  }
}
