import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EventService } from '../../../core/services/event.service';

interface MiniDay {
  date: number;
  fullDate: Date;
  dateStr: string;
  isOtherMonth: boolean;
  isActive: boolean;
  hasEvent: boolean;
}

@Component({
  selector: 'app-calendar-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar-tab.html',
  styleUrl: './calendar-tab.css',
})
export class CalendarTab implements OnInit {
  private router = inject(Router);
  private eventService = inject(EventService);

  currentDate = new Date();
  monthWeeks: MiniDay[][] = [];
  datesWithEvents = new Set<string>();

  ngOnInit() {
    this.loadEvents();
    this.updateGrid();
  }

  get headerTitle(): string {
    const formatter = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' });
    const capitalized = formatter.format(this.currentDate);
    return capitalized.charAt(0).toUpperCase() + capitalized.slice(1);
  }

  loadEvents() {
    
    const mockAgendaId = "65f123456789012345678901"; 
    this.eventService.getEventsByAgenda(mockAgendaId).subscribe((events: any[]) => {
      for (const ev of events) {
        const evDate = new Date(ev.date);
       
        const localStr = `${evDate.getFullYear()}-${(evDate.getMonth() + 1).toString().padStart(2, '0')}-${evDate.getDate().toString().padStart(2, '0')}`;
        this.datesWithEvents.add(localStr);
      }
      this.updateGrid();
    });
  }

  updateGrid() {
    this.monthWeeks = [];
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    let startDayIdx = firstDay.getDay() - 1;
    if (startDayIdx === -1) {
      startDayIdx = 6;
    }

    let currentDay = new Date(firstDay);
    currentDay.setDate(currentDay.getDate() - startDayIdx);

    for (let i = 0; i < 6; i++) {
      let week: MiniDay[] = [];
      for (let j = 0; j < 7; j++) {
        const isOther = currentDay.getMonth() !== month;
        const localStr = `${currentDay.getFullYear()}-${(currentDay.getMonth() + 1).toString().padStart(2, '0')}-${currentDay.getDate().toString().padStart(2, '0')}`;

        week.push({
          date: currentDay.getDate(),
          fullDate: new Date(currentDay),
          dateStr: localStr,
          isOtherMonth: isOther,
          isActive: localStr === todayStr,
          hasEvent: this.datesWithEvents.has(localStr)
        });
        currentDay.setDate(currentDay.getDate() + 1);
      }
      this.monthWeeks.push(week);
      if (currentDay > lastDay && currentDay.getDay() === 0) {
        break;
      }
    }
  }

  prev() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.updateGrid();
  }

  next() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.updateGrid();
  }

  onDayClick(dayStr: string) {
    this.router.navigate(['/calendar'], { queryParams: { date: dayStr, mode: 'day' } });
  }
}
