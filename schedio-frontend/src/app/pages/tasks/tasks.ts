import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TaskCard } from '../../shared/components/ui/task-card/task-card';
import { RectBaseButton } from '../../shared/components/ui/rect-base-button/rect-base-button';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [TaskCard, RectBaseButton],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks {
  constructor(private router: Router) {}

  /** Si es true, se muestran también las tareas completadas. */
  showCompleted = false;

  /** Lista de tareas (reemplazar por datos desde API o estado cuando exista). */
  tasks = [
    {
      title: 'Tarea atrasada (overdue)',
      dueAt: (() => {
        const d = new Date();
        d.setDate(d.getDate() - 2);
        d.setHours(10, 0, 0, 0);
        return d;
      })(),
      timeLabel: '10:00 am',
      completed: false,
    },
    {
      title: 'Tarea completada',
      dueAt: (() => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        return d;
      })(),
      timeLabel: '11:00 am a 12:00 pm',
      completed: true,
    },
    {
      title: 'Entrega en pocas horas',
      dueAt: (() => {
        const d = new Date();
        d.setHours(d.getHours() + 4, 30, 0, 0);
        return d;
      })(),
      timeLabel: null as string | null,
      completed: false,
    },
    {
      title: 'Entrega en 3 días',
      dueAt: (() => {
        const d = new Date();
        d.setDate(d.getDate() + 3);
        d.setHours(14, 0, 0, 0);
        return d;
      })(),
      timeLabel: '2:00 pm a 3:00 pm',
      completed: false,
    },
  ];

  /** Tareas que se muestran: sin completar siempre; completadas solo si showCompleted es true. */
  get visibleTasks(): typeof this.tasks {
    return this.showCompleted ? this.tasks : this.tasks.filter((t) => !t.completed);
  }

  get completedCount(): number {
    return this.tasks.filter((t) => t.completed).length;
  }

  get completedMessage(): string {
    const n = this.completedCount;
    return n === 1 ? 'Tienes 1 tarea completada.' : `Tienes ${n} tareas completadas.`;
  }

  toggleShowCompleted(): void {
    this.showCompleted = !this.showCompleted;
  }

  onToggleComplete(task: { completed: boolean }): void {
    task.completed = true;
  }

 /* onAddTask(): void {
    this.router.navigate(['/agenda/new-assignment']);
  }*/
}
