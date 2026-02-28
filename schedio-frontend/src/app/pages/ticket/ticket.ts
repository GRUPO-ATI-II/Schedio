import { Component } from '@angular/core';
import { InputField } from '../../shared/components/ui/input-field/input-field';
import { RectBaseButton } from '../../shared/components/ui/rect-base-button/rect-base-button';


@Component({
  selector: 'app-ticket',
  imports: [InputField, RectBaseButton],
  templateUrl: './ticket.html',
  styleUrl: './ticket.css',
})
export class Ticket {

}
