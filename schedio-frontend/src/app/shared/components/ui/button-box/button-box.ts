import { Component, Output, EventEmitter } from '@angular/core';
import { RectBaseButton } from '../rect-base-button/rect-base-button';

@Component({
  selector: 'app-button-box',
  standalone: true,
  imports: [RectBaseButton],
  templateUrl: './button-box.html',
  styleUrl: './button-box.css',
})
export class ButtonBox {
  @Output() saveClicked = new EventEmitter<void>();
  @Output() cancelClicked = new EventEmitter<void>();

  onSave() {
    this.saveClicked.emit();
  }

  onCancel() {
    this.cancelClicked.emit();
  }
}
