import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { TaskCard } from '../../shared/components/ui/task-card/task-card';
import { RectBaseButton } from '../../shared/components/ui/rect-base-button/rect-base-button';
import { AssignmentService, AssignmentResponse } from '../../core/services/assignment.service';

export interface AgendaTask {
  id: string;
  title: string;
  dueAt: Date;
  timeLabel: string | null;
  completed: boolean;
}

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [TaskCard, RectBaseButton],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks implements OnInit {
  constructor(
    private router: Router,
    private assignmentService: AssignmentService,
    private cdr: ChangeDetectorRef,
  ) {}

  /** Si es true, se muestran también las tareas completadas. */
  showCompleted = false;

  /** Lista de tareas cargadas desde la BD. */
  tasks: AgendaTask[] = [];

  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading = true;
    this.error = null;
    this.assignmentService.getAll().subscribe({
      next: (list) => {
        this.tasks = list.map((a) => this.assignmentToTask(a));
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || err?.message || 'Error al cargar las tareas.';
        this.cdr.detectChanges();
      },
    });
  }

  private assignmentToTask(a: AssignmentResponse): AgendaTask {
    return {
      id: a._id,
      title: a.title,
      dueAt: new Date(a.deadline),
      timeLabel: null,
      completed: !!(a.send_time),
    };
  }

  /** Tareas que se muestran: sin completar siempre; completadas solo si showCompleted es true. */
  get visibleTasks(): AgendaTask[] {
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

  onToggleComplete(task: AgendaTask): void {
    const newCompleted = !task.completed;
    this.assignmentService.updateCompletion(task.id, newCompleted).subscribe({
      next: () => {
        task.completed = newCompleted;
        this.cdr.detectChanges();
      },
      error: () => {
        // Opcional: mostrar mensaje de error
      },
    });
  }

  onAddTask(): void {
    this.router.navigate(['/agenda/new-assignment']);
  }
}
