import { Component } from '@angular/core';
import { InputField } from '../../shared/components/ui/input-field/input-field';
import { RectBaseButton } from '../../shared/components/ui/rect-base-button/rect-base-button';

@Component({
  selector: 'app-edit-assignment',
  imports: [InputField, RectBaseButton],
  templateUrl: './edit-assignment.html',
  styleUrl: './edit-assignment.css',
})
export class EditAssignment {

}
