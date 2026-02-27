import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rect-base-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rect-base-button.html',
  styleUrl: './rect-base-button.css'
})
export class RectBaseButton {
  @Input() isAction: boolean = false;
}
