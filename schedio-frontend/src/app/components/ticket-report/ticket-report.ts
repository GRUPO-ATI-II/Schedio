import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputField } from '../ui/input-field/input-field';
import { RectBaseButton } from '../ui/rect-base-button/rect-base-button';

@Component({
  selector: 'app-ticket-report',
  standalone: true,
  imports: [CommonModule, InputField, RectBaseButton],
  templateUrl: './ticket-report.html',
  styleUrl: './ticket-report.css',
})
export class TicketReport {}
