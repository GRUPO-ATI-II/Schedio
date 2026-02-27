import { Component } from '@angular/core';
import { InputField } from '../../components/ui/input-field/input-field';
import { RectBaseButton } from '../../components/ui/rect-base-button/rect-base-button';

@Component({
  selector: 'app-error',
  imports: [InputField, RectBaseButton],
  templateUrl: './error.html',
  styleUrl: './error.css',
})
export class Error {

}
