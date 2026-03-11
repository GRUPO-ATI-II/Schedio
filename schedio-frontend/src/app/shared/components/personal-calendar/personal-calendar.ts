import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-personal-calendar',
  imports: [CommonModule],
  templateUrl: './personal-calendar.html',
  styleUrl: './personal-calendar.css',
})
export class PersonalCalendar {
  isExpanded = false;

  toggle() {
    this.isExpanded = !this.isExpanded;
  }
}
