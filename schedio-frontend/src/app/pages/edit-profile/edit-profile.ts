import { Component } from '@angular/core';
import { ButtonBox } from '../../components/ui/button-box/button-box';
import { InputField } from '../../components/ui/input-field/input-field';
import { InputTextarea } from '../../components/ui/input-textarea/input-textarea';

@Component({
  selector: 'app-edit-profile',
  imports: [ButtonBox, InputField, InputTextarea],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css',
})
export class EditProfile {

}
