import { Component, OnInit, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { NgFor, NgIf } from '@angular/common';

import { AuthService } from '../../core/services/auth.service';

import { Task } from '../../shared/components/task/task';

@Component({
  selector: 'app-check-tasks',
  standalone: true,
  imports: [NgFor, NgIf, Task],
  templateUrl: './check-tasks.html',
  styleUrl: './check-tasks.css',
})
export class CheckTasks implements OnInit {
  agendasConTareas: any[] = [];
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  ngOnInit(): void {
    const user = this.authService.currentUser();
    const userId = user?.id || user?._id;
    if (userId) {
      this.http.get<any[]>(`/api/agenda/dashboard/${userId}`).subscribe({
        next: (data) => {
          this.agendasConTareas = data;
        },
        error: (err) => console.error('Error:', err),
      });
    }
  }

  getUrgency(task: any): 'overdue' | 'warning' | 'completed' | 'neutral' {
    if (task.is_completed) return 'completed';
    const [day, month, year] = task.date.split('/').map(Number);
    const taskDate = new Date(year, month - 1, day);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    taskDate.setHours(0, 0, 0, 0);
    const diffTime = taskDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'overdue';
    if (diffDays <= 1) return 'warning';
    return 'neutral';
  }
}
