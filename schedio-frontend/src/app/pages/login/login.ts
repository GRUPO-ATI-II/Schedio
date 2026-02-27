import { Component } from '@angular/core';
import { InputField } from '../../components/ui/input-field/input-field';
import { RectBaseButton } from '../../components/ui/rect-base-button/rect-base-button';

@Component({
  selector: 'app-login',
  imports: [InputField, RectBaseButton],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

}
