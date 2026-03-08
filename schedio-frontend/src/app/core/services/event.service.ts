import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../../shared/entities/event.entity';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:3000/api/events';

  constructor(private http: HttpClient) { }

  createEvent(event: Event): Observable<Event> {
    return this.http.post<Event>(this.apiUrl, event);
  }

  getEventsByAgenda(agendaId: string): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/agenda/${agendaId}`);
  }
}
