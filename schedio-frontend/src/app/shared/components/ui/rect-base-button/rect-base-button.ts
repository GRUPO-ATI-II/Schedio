import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-rect-base-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rect-base-button.html',
  styleUrl: './rect-base-button.css',
})
export class RectBaseButton {
  @Input() isAction: boolean = false;

  @Output() clicked = new EventEmitter<void>();

  handleClick() {
    this.clicked.emit();
  }
}
