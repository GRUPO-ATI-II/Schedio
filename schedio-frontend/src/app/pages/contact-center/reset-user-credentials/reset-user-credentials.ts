import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { InputField } from '../../../shared/components/ui/input-field/input-field';

@Component({
  selector: 'app-reset-user-credentials',
  imports: [InputField],
  templateUrl: './reset-user-credentials.html',
  styleUrl: './reset-user-credentials.css',
})
export class ResetUserCredentials {
  constructor(private router: Router) {}

  openModal() {
    this.router.navigate(['/contact-center/edit-user']);
  }
}
