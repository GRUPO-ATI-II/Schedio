import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/** Respuesta API simplificada para Agenda */
export interface AgendaResponse {
    _id: string;
    users: string[];
    creation_time: string;
}

@Injectable({
    providedIn: 'root'
})
export class AgendaService {
    private apiUrl = '/api/agenda';

    constructor(private http: HttpClient) { }

    /** Obtiene todas las agendas en las que participa el usuario */
    getAgendasByUser(userId: string): Observable<AgendaResponse[]> {
        return this.http.get<AgendaResponse[]>(`${this.apiUrl}/user/${userId}`);
    }
}
