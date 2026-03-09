import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { EventService } from '../../core/services/event.service';
import { AgendaService } from '../../core/services/agenda.service';
import { AuthService } from '../../core/services/auth.service';

export interface CalendarEvent {
    id: string;
    title: string;
    description?: string;
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
    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);

    viewMode: 'month' | 'week' | 'day' = 'week';
    currentDate: Date = new Date();

    // Modal State
    selectedEventForDetails: CalendarEvent | null = null;
    isDeletingEvent = false;

    // Data
    rawEvents: any[] = []; // the raw DB objects
    displayEvents: CalendarEvent[] = []; // mapped to our grid
    allDayEvents: CalendarEvent[] = []; // Separated array for the All-Day banner

    // Time grid layout (24 hours)
    hours = Array.from({ length: 24 }, (_, i) => {
        const h = i; // start at 0 (12am)
        let suffix = 'am';
        let labelH = h;

        if (h === 0) {
            labelH = 12;
        } else if (h === 12) {
            suffix = 'pm';
        } else if (h > 12) {
            suffix = 'pm';
            labelH = h - 12;
        }

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
                    const newDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
                    // Only update if the date is actually different to avoid unnecessary re-renders
                    if (this.currentDate.getTime() !== newDate.getTime()) {
                        this.currentDate = newDate;
                        shouldUpdate = true;
                    }
                }
            }
            if (params['mode'] && ['month', 'week', 'day'].includes(params['mode'])) {
                if (this.viewMode !== params['mode']) {
                    this.viewMode = params['mode'] as 'month' | 'week' | 'day';
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

        const mappedEvents: CalendarEvent[] = filtered.map((ev, i) => {
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

            // Compute actual duration if endDate is present
            let durationHours = 1;
            let timeLabel = '';

            const timeFormat = new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true });

            if (ev.isAllDay) {
                timeLabel = 'Todo el día';
            } else if (ev.endDate) {
                const endD = new Date(ev.endDate);
                const endH = endD.getHours();
                const endM = endD.getMinutes();
                const absoluteEnd = endH + (endM / 60);
                durationHours = Math.max(0.5, absoluteEnd - startHour); // minimum 30 min visual block

                timeLabel = `${timeFormat.format(d)} - ${timeFormat.format(endD)}`;
            } else {
                // Fallback if no endDate
                timeLabel = `${timeFormat.format(d)} (1hr)`;
            }

            const colorClass = EVENT_COLORS[i % EVENT_COLORS.length];

            // Formatter for month pill (short string)
            let monthTimeLabel = '';
            if (ev.isAllDay) {
                monthTimeLabel = '';
            } else {
                let displayH = h;
                const ampm = displayH >= 12 ? 'p' : 'a';
                if (displayH > 12) {
                    displayH -= 12;
                }
                if (displayH === 0) {
                    displayH = 12; // 12 AM
                }
                // If there are minutes, show them, otherwise just the hour
                monthTimeLabel = m > 0 ? `${displayH}:${m.toString().padStart(2, '0')}${ampm}` : `${displayH}${ampm}`;
            }

            // Generate Local Date String instead of ISO String for stable matching
            const localDateStr = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;

            return {
                id: ev._id || i.toString(),
                title: ev.title,
                description: ev.description,
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
        });

        this.allDayEvents = mappedEvents.filter(e => e.isAllDay);
        this.displayEvents = mappedEvents.filter(e => !e.isAllDay);

        // Calculate overlaps for regular events
        this.calculateOverlaps();
    }

    private calculateOverlaps() {
        // Group by day first
        const eventsByDay = new Map<number, CalendarEvent[]>();
        for (const ev of this.displayEvents) {
            if (!eventsByDay.has(ev.dayIndex)) {
                eventsByDay.set(ev.dayIndex, []);
            }
            eventsByDay.get(ev.dayIndex)!.push(ev);
        }

        for (const [, dayEvents] of eventsByDay.entries()) {
            // Sort by startHour
            dayEvents.sort((a, b) => a.startHour - b.startHour);

            let columns: CalendarEvent[][] = [];

            for (const ev of dayEvents) {
                let placed = false;
                // Try to place in an existing column where the previous event has ended
                for (let col = 0; col < columns.length; col++) {
                    const lastEventInCol = columns[col][columns[col].length - 1];
                    if (lastEventInCol.startHour + lastEventInCol.durationHours <= ev.startHour) {
                        columns[col].push(ev);
                        placed = true;
                        break;
                    }
                }

                // If couldn't place in existing column, create a new one
                if (!placed) {
                    columns.push([ev]);
                }
            }

            // Assign overlap properties to events based on how many columns exist in this cluster
            for (let i = 0; i < columns.length; i++) {
                for (const ev of columns[i]) {
                    ev.overlapIndex = i;
                    ev.totalOverlaps = columns.length;
                }
            }
        }
    }

    // --- View Helpers --- //
    getEventTop(startHour: number): string {
        return `calc(${startHour * 80}px + 10px)`;
    }

    getEventHeight(durationHours: number): string {
        return `calc(${durationHours * 80}px - 20px)`;
    }

    getEventsForDate(dateStr: string): CalendarEvent[] {
        const allEvents = [...this.allDayEvents, ...this.displayEvents];
        return allEvents.filter(e => e.dateStr === dateStr);
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

    onDayColumnClick(event: MouseEvent, dateStr?: string) {
        if (!dateStr) return;

        // Allow the event creation only if clicked directly on the column (not an event block)
        if ((event.target as HTMLElement).classList.contains('event-block') ||
            (event.target as HTMLElement).closest('.event-block')) {
            return;
        }

        const target = event.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();
        const offsetY = event.clientY - rect.top;

        // 80px per hour
        const clickedHourRaw = Math.floor(offsetY / 80);

        let ampm = 'am';
        let formattedHour = clickedHourRaw;
        let displayHour = clickedHourRaw;

        if (clickedHourRaw >= 12) {
            ampm = 'pm';
            if (clickedHourRaw > 12) displayHour = clickedHourRaw - 12;
        } else if (clickedHourRaw === 0) {
            displayHour = 12; // 12am representation
        }

        if (confirm(`¿Deseas agregar un evento a las ${displayHour}:00 ${ampm} el ${dateStr}?`)) {
            this.router.navigate(['/agenda/new-event'], {
                queryParams: {
                    date: dateStr,
                    hour: displayHour,
                    ampm: ampm
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
                const localStr = `${curr.getFullYear()}-${(curr.getMonth() + 1).toString().padStart(2, '0')}-${curr.getDate().toString().padStart(2, '0')}`;
                const isActive = localStr === todayStr;
                this.days.push({ name, date: curr.getDate(), active: isActive, fullDate: curr, dateStr: localStr });
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
                    const localStr = `${currentDay.getFullYear()}-${(currentDay.getMonth() + 1).toString().padStart(2, '0')}-${currentDay.getDate().toString().padStart(2, '0')}`;
                    const isActive = localStr === todayStr;
                    const isOther = currentDay.getMonth() !== month;
                    week.push({ name, date: currentDay.getDate(), active: isActive, fullDate: new Date(currentDay), isOtherMonth: isOther, dateStr: localStr });
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
        const lastWeek = this.monthWeeks[this.monthWeeks.length - 1];
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
        this.isEventDeletedSuccess = false;
    }

    closeEventDetails() {
        this.selectedEventForDetails = null;
        this.isEventDeletedSuccess = false;
    }

    isEventDeletedSuccess = false;

    deleteSelectedEvent() {
        if (!this.selectedEventForDetails) return;

        const confirmDelete = window.confirm(`¿Estás seguro de que deseas eliminar el evento "${this.selectedEventForDetails.title}"?`);
        if (!confirmDelete) return;

        this.isDeletingEvent = true;
        this.eventService.deleteEvent(this.selectedEventForDetails.id).subscribe({
            next: () => {
                this.isDeletingEvent = false;
                this.isEventDeletedSuccess = true;
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
