import { Component, Input } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [NgClass, NgIf],
  templateUrl: './task.html',
  styleUrl: './task.css',
})
export class Task {
  @Input() date: string = '';
  @Input() title: string = '';
  @Input() time: string = '';
  @Input() status: string = '';
  @Input() urgency: 'overdue' | 'warning' | 'completed' | 'neutral' = 'neutral';
}
