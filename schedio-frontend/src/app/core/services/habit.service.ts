import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Habit } from '../../shared/entities/habit.entity';

@Injectable({
    providedIn: 'root',
})
export class HabitService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = '/api/habits';

    createHabit(habit: Partial<Habit>): Observable<Habit> {
        return this.http.post<Habit>(this.apiUrl, habit);
    }

    getHabitsByUser(userId: string): Observable<Habit[]> {
        return this.http.get<Habit[]>(`${this.apiUrl}/user/${userId}`);
    }

    getHabitById(id: string): Observable<Habit> {
        return this.http.get<Habit>(`${this.apiUrl}/${id}`);
    }

    updateHabit(id: string, habit: Partial<Habit>): Observable<Habit> {
        return this.http.put<Habit>(`${this.apiUrl}/${id}`, habit);
    }

    deleteHabit(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    completeHabit(id: string): Observable<Habit> {
        return this.http.post<Habit>(`${this.apiUrl}/${id}/complete`, {});
    }
}
