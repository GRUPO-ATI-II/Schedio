import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { EventService } from '../../core/services/event.service';
import { AgendaService } from '../../core/services/agenda.service';
import { AuthService } from '../../core/services/auth.service';

export interface CalendarEvent {
    id: string;
    title: string;
    description: string; // New field
    timeLabel: string;
    dayIndex: number; // 0 for Monday, 1 for Tuesday... (relative to current week/month)
    startHour: number; // e.g. 7.5 for 7:30
    durationHours: number; // e.g. 1.5 for 1.5 hours
    colorClass: string;
    hasAvatars?: boolean;
    dateStr: string; // ISO string for Month view grouping
    isAllDay: boolean;
    overlapIndex: number;
    totalOverlaps: number;
    monthTimeLabel: string;
}

// Colors pool for dynamic assignment
const EVENT_COLORS = ['event-orange', 'event-purple', 'event-grey'];

export type CalendarViewMode = 'month' | 'week' | 'day';

@Component({
    selector: 'app-calendar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './calendar.html',
    styleUrl: './calendar.css',
})
export class Calendar implements OnInit {
    private readonly eventService = inject(EventService);
    private readonly agendaService = inject(AgendaService);
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);
    private readonly activatedRoute = inject(ActivatedRoute);

    viewMode: CalendarViewMode = 'week';
    currentDate: Date = new Date();

    // Modal State
    selectedEventForDetails: CalendarEvent | null = null;
    isDeletingEvent = false;

    // Data
    rawEvents: any[] = []; // the raw DB objects
    displayEvents: CalendarEvent[] = []; // mapped to our grid
    allDayEvents: CalendarEvent[] = []; // Separated array for the All-Day banner

    // Time grid layout
    hours = Array.from({ length: 24 }, (_, i) => {
        const h = i; // start at 12am
        const suffix = h >= 12 ? 'PM' : 'AM';
        let labelH = h > 12 ? h - 12 : h;
        if (labelH === 0) labelH = 12;
        return { label: `${labelH}:00 ${suffix}`, offset: i };
    });

    // Active days shown depending on view
    days: { name: string, date: number, active: boolean, fullDate: Date, dateStr?: string }[] = [];

    // For Month view
    monthWeeks: { name: string, date: number, active: boolean, fullDate: Date, isOtherMonth: boolean, dateStr?: string }[][] = [];

    get currentMonthYearLabel(): string {
        const monthFormatter = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' });

        if (this.viewMode === 'month') {
            const capitalized = monthFormatter.format(this.currentDate);
            return capitalized.charAt(0).toUpperCase() + capitalized.slice(1);
        }
        else if (this.viewMode === 'day') {
            const dayFormatter = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
            return dayFormatter.format(this.currentDate);
        }
        else if (this.viewMode === 'week') {
            if (this.days.length === 0) return '';
            const firstDay = this.days[0].fullDate;
            const lastDay = this.days[6].fullDate;

            const optionsPartial: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
            const optionsFull: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };

            if (firstDay.getMonth() === lastDay.getMonth()) {
                return `${firstDay.getDate()} - ${lastDay.toLocaleDateString('es-ES', optionsFull)}`;
            } else {
                return `${firstDay.toLocaleDateString('es-ES', optionsPartial)} - ${lastDay.toLocaleDateString('es-ES', optionsFull)}`;
            }
        }
        return '';
    }

    ngOnInit(): void {
        // Load events
        this.loadEvents();

        // Initial grid setup
        this.updateCalendarGrid();
        this.processEventsForCurrentView();

        // Listen for incoming route parameters (e.g. from Sidebar Mini Calendar)
        this.activatedRoute.queryParams.subscribe((params: any) => {
            let shouldUpdate = false;
            if (params['date']) {
                // date format expected: YYYY-MM-DD
                const parts = params['date'].split('-');
                if (parts.length === 3) {
                    const newDate = new Date(Number.parseInt(parts[0], 10), Number.parseInt(parts[1], 10) - 1, Number.parseInt(parts[2], 10));
                    // Only update if the date is actually different to avoid unnecessary re-renders
                    if (this.currentDate.getTime() !== newDate.getTime()) {
                        this.currentDate = newDate;
                        shouldUpdate = true;
                    }
                }
            }
            if (params['mode'] && ['month', 'week', 'day'].includes(params['mode'])) {
                if (this.viewMode !== params['mode']) {
                    this.viewMode = params['mode'] as CalendarViewMode;
                    shouldUpdate = true;
                }
            }

            if (shouldUpdate) {
                this.updateCalendarGrid();
                this.processEventsForCurrentView();
            }
        });
    }

    // --- Data Loading --- //

    loadEvents() {
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

        const mappedEvents: CalendarEvent[] = filtered.map((ev, i) => this.mapRawEventToCalendarEvent(ev, i));

        this.allDayEvents = mappedEvents.filter(e => e.isAllDay);
        this.displayEvents = mappedEvents.filter(e => !e.isAllDay);

        // Calculate overlaps for regular events
        this.calculateOverlaps();
    }

    private mapRawEventToCalendarEvent(ev: any, i: number): CalendarEvent {
        const d = new Date(ev.date);
        let dayIdx = 0;
        if (this.viewMode === 'week') {
            dayIdx = d.getDay() === 0 ? 6 : d.getDay() - 1;
        }

        const h = d.getHours();
        const m = d.getMinutes();
        const startHour = h + (m / 60);

        let durationHours = 1;
        let timeLabel = '';
        const timeFormat = new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true });

        if (ev.isAllDay) {
            timeLabel = 'Todo el día';
        } else if (ev.endDate) {
            const endD = new Date(ev.endDate);
            const absoluteEnd = endD.getHours() + (endD.getMinutes() / 60);
            durationHours = Math.max(0.5, absoluteEnd - startHour);
            timeLabel = `${timeFormat.format(d)} - ${timeFormat.format(endD)}`;
        } else {
            timeLabel = `${timeFormat.format(d)} (1hr)`;
        }

        const colorClass = EVENT_COLORS[i % EVENT_COLORS.length];
        const monthTimeLabel = this.formatMonthTimeLabel(ev.isAllDay, h, m);

        const localDateStr = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;

        return {
            id: ev._id || i.toString(),
            title: ev.title,
            description: ev.description || '',
            timeLabel,
            dayIndex: dayIdx,
            startHour,
            durationHours,
            colorClass,
            hasAvatars: i % 3 === 0,
            dateStr: localDateStr,
            isAllDay: ev.isAllDay || false,
            overlapIndex: 0,
            totalOverlaps: 1,
            monthTimeLabel
        };
    }

    private formatMonthTimeLabel(isAllDay: boolean, h: number, m: number): string {
        if (isAllDay) return '';
        let displayH = h;
        const ampm = displayH >= 12 ? 'p' : 'a';
        if (displayH > 12) displayH -= 12;
        if (displayH === 0) displayH = 12;
        return m > 0 ? `${displayH}:${m.toString().padStart(2, '0')}${ampm}` : `${displayH}${ampm}`;
    }

    private calculateOverlaps() {
        const eventsByDay = new Map<number, CalendarEvent[]>();
        for (const ev of this.displayEvents) {
            if (!eventsByDay.has(ev.dayIndex)) {
                eventsByDay.set(ev.dayIndex, []);
            }
            eventsByDay.get(ev.dayIndex)!.push(ev);
        }

        for (const dayEvents of eventsByDay.values()) {
            this.processOverlapsForDay(dayEvents);
        }
    }

    private processOverlapsForDay(dayEvents: CalendarEvent[]) {
        dayEvents.sort((a, b) => a.startHour - b.startHour);
        const columns: CalendarEvent[][] = [];

        for (const ev of dayEvents) {
            let placed = false;
            for (const col of columns) {
                const lastEventInCol = col.at(-1)!;
                if (lastEventInCol.startHour + lastEventInCol.durationHours <= ev.startHour) {
                    col.push(ev);
                    placed = true;
                    break;
                }
            }

            if (!placed) {
                columns.push([ev]);
            }
        }

        for (let i = 0; i < columns.length; i++) {
            for (const ev of columns[i]) {
                ev.overlapIndex = i;
                ev.totalOverlaps = columns.length;
            }
        }
    }

    // --- View Helpers --- //
    getEventTop(startHour: number): string {
        const offsetHour = startHour; // no offset needed, starts at 0
        return `calc(${offsetHour * 80}px + 10px)`;
    }

    getEventHeight(durationHours: number): string {
        return `calc(${durationHours * 80}px - 20px)`;
    }

    getEventsForDate(dateStr: string): CalendarEvent[] {
        const allEvents = [...this.allDayEvents, ...this.displayEvents];
        return allEvents.filter(e => e.dateStr === dateStr);
    }

    // --- Navigation & View Toggles --- //
    setViewMode(mode: CalendarViewMode) {
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

    onMonthDayClick(dateStr: string) {
        if (confirm(`¿Deseas agregar un evento para todo el día el ${dateStr}?`)) {
            // Navigate for All-Day event
            this.router.navigate(['/agenda/new-event'], {
                queryParams: {
                    date: dateStr,
                    allDay: 'true'
                }
            });
        }
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
            this.generateDayGridView();
        } else if (this.viewMode === 'week') {
            this.generateWeekGridView(todayStr);
        } else if (this.viewMode === 'month') {
            this.generateMonthGridView(todayStr);
        }
    }

    private generateDayGridView() {
        const dName = this.currentDate.toLocaleDateString('es-ES', { weekday: 'short' });
        this.days.push({ name: dName, date: this.currentDate.getDate(), active: true, fullDate: this.currentDate });
    }

    private generateWeekGridView(todayStr: string) {
        const d = new Date(this.currentDate);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(d.setDate(diff));

        for (let i = 0; i < 7; i++) {
            const curr = new Date(monday);
            curr.setDate(monday.getDate() + i);
            const name = curr.toLocaleDateString('es-ES', { weekday: 'short' });
            const localStr = `${curr.getFullYear()}-${(curr.getMonth() + 1).toString().padStart(2, '0')}-${curr.getDate().toString().padStart(2, '0')}`;
            const isActive = localStr === todayStr;
            this.days.push({ name, date: curr.getDate(), active: isActive, fullDate: curr, dateStr: localStr });
        }
    }

    private generateMonthGridView(todayStr: string) {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);

        let startDayIdx = firstDayOfMonth.getDay() - 1;
        if (startDayIdx === -1) startDayIdx = 6;

        let currentDay = new Date(firstDayOfMonth);
        currentDay.setDate(currentDay.getDate() - startDayIdx);

        for (let i = 0; i < 6; i++) {
            const week = [];
            for (let j = 0; j < 7; j++) {
                const name = currentDay.toLocaleDateString('es-ES', { weekday: 'short' });
                const localStr = `${currentDay.getFullYear()}-${(currentDay.getMonth() + 1).toString().padStart(2, '0')}-${currentDay.getDate().toString().padStart(2, '0')}`;
                const isActive = localStr === todayStr;
                const isOther = currentDay.getMonth() !== month;
                week.push({ name, date: currentDay.getDate(), active: isActive, fullDate: new Date(currentDay), isOtherMonth: isOther, dateStr: localStr });
                currentDay.setDate(currentDay.getDate() + 1);
            }
            this.monthWeeks.push(week);
            if (currentDay > lastDayOfMonth && currentDay.getDay() === 1) {
                break;
            }
        }
    }

    private getStartDateOfCurrentView(): Date {
        if (this.viewMode === 'day') {
            const d = new Date(this.currentDate);
            d.setHours(0, 0, 0, 0);
            return d;
        }
        if (this.viewMode === 'week') {
            const d = new Date(this.days[0].fullDate);
            d.setHours(0, 0, 0, 0);
            return d;
        }
        // month
        const d = new Date(this.monthWeeks[0][0].fullDate);
        d.setHours(0, 0, 0, 0);
        return d;
    }

    private getEndDateOfCurrentView(): Date {
        if (this.viewMode === 'day') {
            const d = new Date(this.currentDate);
            d.setHours(23, 59, 59, 999);
            return d;
        }
        if (this.viewMode === 'week') {
            const d = new Date(this.days[6].fullDate);
            d.setHours(23, 59, 59, 999);
            return d;
        }
        // month: get last day of last week
        const lastWeek = this.monthWeeks.at(-1)!;
        const d = new Date(lastWeek[6].fullDate);
        d.setHours(23, 59, 59, 999);
        return d;
    }

    addEvent() {
        this.router.navigate(['/agenda/new-event']);
    }

    // --- Details Popup Actions --- //
    openEventDetails(event: CalendarEvent) {
        this.selectedEventForDetails = event;
    }

    closeEventDetails() {
        this.selectedEventForDetails = null;
    }

    deleteSelectedEvent() {
        if (!this.selectedEventForDetails) return;

        const confirmDelete = globalThis.confirm(`¿Estás seguro de que deseas eliminar el evento "${this.selectedEventForDetails.title}"?`);
        if (!confirmDelete) return;

        this.isDeletingEvent = true;
        this.eventService.deleteEvent(this.selectedEventForDetails.id).subscribe({
            next: () => {
                this.isDeletingEvent = false;
                this.closeEventDetails();
                globalThis.alert("Evento eliminado con éxito"); // Added success popup
                this.loadEvents(); // Reload all events from backend
            },
            error: (err) => {
                console.error("Error deleting event:", err);
                this.isDeletingEvent = false;
                alert("Hubo un error al eliminar el evento.");
            }
        });
    }
}
