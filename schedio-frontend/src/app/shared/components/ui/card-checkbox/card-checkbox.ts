import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-checkbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-checkbox.html',
  styleUrl: './card-checkbox.css',
})
export class CardCheckbox {
  @Input() checked = false;
  /** Cuando es true, muestra estilo naranja con "!" (tarea atrasada); al hacer clic sigue emitiendo toggle para completar. */
  @Input() overdue = false;
  @Output() toggle = new EventEmitter<void>();

  onClick(): void {
    this.toggle.emit();
  }
}
