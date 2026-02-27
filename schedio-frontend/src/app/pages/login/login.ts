import { Component } from '@angular/core';
import { InputField } from '../../components/ui/input-field/input-field';
import { RectBaseButton } from '../../components/ui/rect-base-button/rect-base-button';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [InputField, RectBaseButton, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  constructor(private router: Router) { }

  login() {
    this.router.navigate(['/ticket']);
  }
}
