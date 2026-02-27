import { Component } from '@angular/core';
import { InputField } from '../../../components/ui/input-field/input-field';
import { RectBaseButton } from '../../../components/ui/rect-base-button/rect-base-button';
import { Ticket } from '../../../components/ui/ticket/ticket';

@Component({
  selector: 'app-edit-specific-user-credentials',
  imports: [InputField, RectBaseButton, Ticket],
  templateUrl: './edit-specific-user-credentials.html',
  styleUrl: './edit-specific-user-credentials.css',
})
export class EditSpecificUserCredentials {
  viewMoreInfo() {}
}
