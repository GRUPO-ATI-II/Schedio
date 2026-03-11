import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardCheckbox } from '../card-checkbox/card-checkbox';
import { Router } from '@angular/router';

export type TaskCardState = 'completed' | 'overdue' | 'imminent' | 'soon' | 'upcoming';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, CardCheckbox],
  templateUrl: './task-card.html',
  styleUrl: './task-card.css',
})
export class TaskCard {
  private readonly router = inject(Router);
  @Input() id = '';
  @Input() title = '';
  /** Fecha/hora de vencimiento; define el estado y la fecha mostrada. */
  @Input() dueAt!: Date | string;
  /** Texto opcional para el horario (ej. "7:00 am a 8:30 am"). Si no se pasa, se usa la hora de dueAt. */
  @Input() timeLabel: string | null = null;
  @Input() completed = false;
  @Output() toggleComplete = new EventEmitter<void>();

  navigateToEdit(event: Event): void {
    event.stopPropagation();
    if (this.id) {
      this.router.navigate(['/agenda/edit-assignment'], { 
        state: { id: this.id } 
      });
    }
  }

  private get dueAtDate(): Date | null {
    const raw = this.dueAt;
    return raw ? new Date(raw) : null;
  }

  get state(): TaskCardState {
    if (this.completed) return 'completed';
    const due = this.dueAtDate;
    if (!due) return 'upcoming';
    const now = new Date();
    if (due < now) return 'overdue';
    const ms = due.getTime() - now.getTime();
    const hours = ms / (1000 * 60 * 60);
    if (hours <= 24) return 'imminent';
    if (hours <= 48) return 'soon';
    return 'upcoming';
  }

  get stateLabel(): string {
    const due = this.dueAtDate;
    const s = this.state;
    if (s === 'completed') return 'Completada';
    if (s === 'overdue' && due) {
      const now = new Date();
      const days = Math.floor((now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
      const hours = Math.floor((now.getTime() - due.getTime()) / (1000 * 60 * 60));
      if (days >= 1) return days === 1 ? 'Atrasado por 1 día' : `Atrasado por ${days} días`;
      return hours <= 1 ? 'Atrasado por 1 hora' : `Atrasado por ${hours} horas`;
    }
    if (s === 'imminent' && due) {
      const hours = Math.max(1, Math.ceil((due.getTime() - Date.now()) / (1000 * 60 * 60)));
      return hours === 1 ? 'Dentro de 1 hora' : `Dentro de ${hours} horas`;
    }
    if ((s === 'soon' || s === 'upcoming') && due) {
      const days = Math.ceil((due.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return days === 1 ? 'Dentro de 1 día' : `Dentro de ${days} días`;
    }
    return '';
  }

  get formattedDate(): string {
    const d = this.dueAtDate;
    if (!d) return '';
    return d.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });
  }

  get displayedTime(): string {
    if (this.timeLabel) return this.timeLabel;
    const d = this.dueAtDate;
    if (!d) return '';
    return d.toLocaleTimeString('es-ES', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }
}
