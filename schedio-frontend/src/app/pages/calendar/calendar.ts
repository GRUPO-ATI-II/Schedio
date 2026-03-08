import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../core/services/event.service';
import { AgendaService } from '../../core/services/agenda.service';
import { AuthService } from '../../core/services/auth.service';

export interface CalendarEvent {
    id: string;
    title: string;
    timeLabel: string;
    dayIndex: number; // 0 for Monday, 1 for Tuesday... (relative to current week/month)
    startHour: number; // e.g. 7.5 for 7:30
    durationHours: number; // e.g. 1.5 for 1.5 hours
    colorClass: string;
    hasAvatars?: boolean;
    dateStr: string; // ISO string for Month view grouping
}

// Colors pool for dynamic assignment
const EVENT_COLORS = ['event-orange', 'event-purple', 'event-grey'];

@Component({
    selector: 'app-calendar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './calendar.html',
    styleUrl: './calendar.css',
})
export class Calendar implements OnInit {
    private eventService = inject(EventService);
    private agendaService = inject(AgendaService);
    private authService = inject(AuthService);

    viewMode: 'month' | 'week' | 'day' = 'week';
    currentDate: Date = new Date();

    // Data State
    rawEvents: any[] = [];
    displayEvents: CalendarEvent[] = [];

    // Time grid layout
    hours = Array.from({ length: 14 }, (_, i) => {
        const h = i + 7; // start at 7am
        const suffix = h >= 12 ? 'pm' : 'am';
        const labelH = h > 12 ? h - 12 : h;
        return { label: `${labelH}:00 ${suffix}`, offset: i };
    });

    // Active days shown depending on view
    days: { name: string, date: number, active: boolean, fullDate: Date }[] = [];

    // For Month view
    monthWeeks: { name: string, date: number, active: boolean, fullDate: Date, isOtherMonth: boolean }[][] = [];

    get currentMonthYearLabel(): string {
        return this.currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).replace(/^\w/, c => c.toUpperCase());
    }

    ngOnInit(): void {
        // Load events
        this.loadUserEvents();
        this.updateCalendarGrid();
    }

    // --- Data Loading --- //

    loadUserEvents() {
        // Usamos el ID de agenda por defecto que se utiliza en la creación de eventos.
        const mockAgendaId = "65f123456789012345678901";
        this.fetchEventsForAgenda(mockAgendaId);
    }

    fetchEventsForAgenda(agendaId: string) {
        this.eventService.getEventsByAgenda(agendaId).subscribe({
            next: (events) => {
                this.rawEvents = events;
                this.processEventsForCurrentView();
            },
            error: (err) => console.error("Error loading events", err)
        });
    }

    // --- Filtering & Mapping --- //
    processEventsForCurrentView() {
        const startOfRange = this.getStartDateOfCurrentView();
        const endOfRange = this.getEndDateOfCurrentView();

        const filtered = this.rawEvents.filter(ev => {
            const d = new Date(ev.date);
            return d >= startOfRange && d <= endOfRange;
        });

        this.displayEvents = filtered.map((ev, i) => {
            const d = new Date(ev.date);
            // Determine day index based on view
            let dayIdx = 0;
            if (this.viewMode === 'week') {
                dayIdx = d.getDay() === 0 ? 6 : d.getDay() - 1; // 0 = Mon, 6 = Sun
            } else if (this.viewMode === 'day') {
                dayIdx = 0; // always column 0 in day view
            }

            const h = d.getHours();
            const m = d.getMinutes();
            const startHour = h + (m / 60);

            // Randomly assign a color from the pool as mock metadata
            const colorClass = EVENT_COLORS[i % EVENT_COLORS.length];

            // Format time label
            const timeLabel = d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true });

            return {
                id: ev._id || i.toString(),
                title: ev.title,
                timeLabel: `${timeLabel} (1hr)`, // Assuming 1hr default since DB has no duration
                dayIndex: dayIdx,
                startHour: startHour < 7 ? 7 : Math.min(startHour, 20), // bound visual
                durationHours: 1, // Default duration since DB lacks end_time
                colorClass,
                hasAvatars: i % 3 === 0, // mock some avatars
                dateStr: d.toISOString().split('T')[0] // yyyy-mm-dd
            };
        });
    }

    // --- View Helpers --- //
    getEventTop(startHour: number): string {
        const offsetHour = startHour - 7;
        return `calc(${offsetHour * 80}px + 10px)`;
    }

    getEventHeight(durationHours: number): string {
        return `calc(${durationHours * 80}px - 20px)`;
    }

    getEventsForDate(dateStr: string): CalendarEvent[] {
        return this.displayEvents.filter(e => e.dateStr === dateStr);
    }

    // --- Navigation & View Toggles --- //
    setViewMode(mode: 'month' | 'week' | 'day') {
        this.viewMode = mode;
        this.updateCalendarGrid();
        this.processEventsForCurrentView();
    }

    goToDayView(date: Date) {
        this.currentDate = new Date(date);
        this.viewMode = 'day';
        this.updateCalendarGrid();
        this.processEventsForCurrentView();
    }

    prev() {
        if (this.viewMode === 'month') {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        } else if (this.viewMode === 'week') {
            this.currentDate.setDate(this.currentDate.getDate() - 7);
        } else {
            this.currentDate.setDate(this.currentDate.getDate() - 1);
        }
        this.currentDate = new Date(this.currentDate); // trigger change detection safely
        this.updateCalendarGrid();
        this.processEventsForCurrentView();
    }

    next() {
        if (this.viewMode === 'month') {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        } else if (this.viewMode === 'week') {
            this.currentDate.setDate(this.currentDate.getDate() + 7);
        } else {
            this.currentDate.setDate(this.currentDate.getDate() + 1);
        }
        this.currentDate = new Date(this.currentDate);
        this.updateCalendarGrid();
        this.processEventsForCurrentView();
    }

    // --- Date Math --- //
    private updateCalendarGrid() {
        this.days = [];
        this.monthWeeks = [];
        const todayStr = new Date().toISOString().split('T')[0];

        if (this.viewMode === 'day') {
            const dName = this.currentDate.toLocaleDateString('es-ES', { weekday: 'short' });
            this.days.push({ name: dName, date: this.currentDate.getDate(), active: true, fullDate: this.currentDate });
        }
        else if (this.viewMode === 'week') {
            const d = new Date(this.currentDate);
            const day = d.getDay();
            const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
            const monday = new Date(d.setDate(diff));

            for (let i = 0; i < 7; i++) {
                const curr = new Date(monday);
                curr.setDate(monday.getDate() + i);
                const name = curr.toLocaleDateString('es-ES', { weekday: 'short' });
                const isActive = curr.toISOString().split('T')[0] === todayStr;
                this.days.push({ name, date: curr.getDate(), active: isActive, fullDate: curr });
            }
        }
        else if (this.viewMode === 'month') {
            const year = this.currentDate.getFullYear();
            const month = this.currentDate.getMonth();
            const firstDayOfMonth = new Date(year, month, 1);
            const lastDayOfMonth = new Date(year, month + 1, 0);

            let startDayIdx = firstDayOfMonth.getDay() - 1;
            if (startDayIdx === -1) startDayIdx = 6; // Sunday

            let currentDay = new Date(firstDayOfMonth);
            currentDay.setDate(currentDay.getDate() - startDayIdx); // go back to monday

            for (let i = 0; i < 6; i++) { // 6 weeks maximum in a month matrix
                const week = [];
                for (let j = 0; j < 7; j++) {
                    const name = currentDay.toLocaleDateString('es-ES', { weekday: 'short' });
                    const isActive = currentDay.toISOString().split('T')[0] === todayStr;
                    const isOther = currentDay.getMonth() !== month;
                    week.push({ name, date: currentDay.getDate(), active: isActive, fullDate: new Date(currentDay), isOtherMonth: isOther });
                    currentDay.setDate(currentDay.getDate() + 1);
                }
                this.monthWeeks.push(week);
                if (currentDay > lastDayOfMonth && currentDay.getDay() === 1) {
                    break; // done if we finished the month and ended on a Sunday
                }
            }
        }
    }

    private getStartDateOfCurrentView(): Date {
        if (this.viewMode === 'day') {
            return new Date(this.currentDate.setHours(0, 0, 0, 0));
        }
        if (this.viewMode === 'week') {
            return new Date(this.days[0].fullDate.setHours(0, 0, 0, 0));
        }
        // month
        return new Date(this.monthWeeks[0][0].fullDate.setHours(0, 0, 0, 0));
    }

    private getEndDateOfCurrentView(): Date {
        if (this.viewMode === 'day') {
            return new Date(this.currentDate.setHours(23, 59, 59, 999));
        }
        if (this.viewMode === 'week') {
            return new Date(this.days[6].fullDate.setHours(23, 59, 59, 999));
        }
        // month: get last day of last week
        const lastWeek = this.monthWeeks[this.monthWeeks.length - 1];
        return new Date(lastWeek[6].fullDate.setHours(23, 59, 59, 999));
    }
}
