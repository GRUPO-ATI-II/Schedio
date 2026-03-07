import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface CalendarEvent {
    id: string;
    title: string;
    timeLabel: string;
    dayIndex: number; // 0 for Monday, 1 for Tuesday...
    startHour: number; // e.g. 7.5 for 7:30
    durationHours: number; // e.g. 1.5 for 1.5 hours
    colorClass: string;
    hasAvatars?: boolean;
}

@Component({
    selector: 'app-calendar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './calendar.html',
    styleUrl: './calendar.css',
})
export class Calendar {

    hours = [
        { label: '7:00 am', offset: 0 },
        { label: '8:00 am', offset: 1 },
        { label: '9:00 am', offset: 2 },
        { label: '10:00 am', offset: 3 },
        { label: '11:00 am', offset: 4 },
        { label: '12:00 pm', offset: 5 },
        { label: '1:00 pm', offset: 6 }
    ];

    days = [
        { name: 'lun', date: 2, active: false },
        { name: 'mar', date: 3, active: false },
        { name: 'mié', date: 4, active: true },
        { name: 'jue', date: 5, active: false },
        { name: 'vie', date: 6, active: false },
        { name: 'sáb', date: 7, active: false },
        { name: 'dom', date: 8, active: false }
    ];

    events: CalendarEvent[] = [
        {
            id: '1',
            title: 'Clase ATI II',
            timeLabel: '7:00 am - 8:30 am',
            dayIndex: 0, // lun
            startHour: 7,
            durationHours: 1.5,
            colorClass: 'event-orange'
        },
        {
            id: '2',
            title: 'Práctica Lab.',
            timeLabel: '9:00 am - 11:00 am',
            dayIndex: 0, // lun
            startHour: 9,
            durationHours: 2,
            colorClass: 'event-grey',
            hasAvatars: true
        },
        {
            id: '3',
            title: 'Evento Café',
            timeLabel: '8:00 am - 12:00 pm',
            dayIndex: 1, // mar
            startHour: 8,
            durationHours: 4,
            colorClass: 'event-purple'
        },
        {
            id: '4',
            title: 'Clase ATI II',
            timeLabel: '7:00 am - 8:30 am',
            dayIndex: 2, // mié
            startHour: 7,
            durationHours: 1.5,
            colorClass: 'event-orange'
        },
        {
            id: '5',
            title: 'Almuerzo Rodizza',
            timeLabel: '11:30 am - 1:00 pm',
            dayIndex: 2, // mié
            startHour: 11.5,
            durationHours: 1.5,
            colorClass: 'event-orange'
        },
        {
            id: '6',
            title: 'Práctica Lab.',
            timeLabel: '8:30 am - 10:00 am',
            dayIndex: 3, // jue
            startHour: 8.5,
            durationHours: 1.5,
            colorClass: 'event-grey',
            hasAvatars: true
        },
        {
            id: '7',
            title: 'Práctica ATI II',
            timeLabel: '7:00 am - 8:30 am',
            dayIndex: 4, // vie
            startHour: 7,
            durationHours: 1.5,
            colorClass: 'event-orange'
        },
        {
            id: '8',
            title: 'Presentación María',
            timeLabel: '9:45 am - 12:30 pm',
            dayIndex: 4, // vie
            startHour: 9.75, // 9:45
            durationHours: 2.75, // until 12:30
            colorClass: 'event-purple'
        },
        {
            id: '9',
            title: 'Reunión de pre-domingo',
            timeLabel: '10:00 am - 12:00 pm',
            dayIndex: 5, // sáb
            startHour: 10,
            durationHours: 2,
            colorClass: 'event-grey',
            hasAvatars: true
        }
    ];

    getEventTop(startHour: number): string {
        // Assuming each hour is exactly 80px high and starts at 7 (offset 0)
        // plus a top padding of the hour row offset
        const offsetHour = startHour - 7;
        return `calc(${offsetHour * 80}px + 10px)`;
    }

    getEventHeight(durationHours: number): string {
        return `calc(${durationHours * 80}px - 20px)`;
    }
}
