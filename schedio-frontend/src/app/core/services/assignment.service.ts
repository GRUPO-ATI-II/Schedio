import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Assignment } from '../../shared/entities/assignment.entity';

/** Respuesta de la API para una asignación (usa _id). */
export interface AssignmentResponse {
  _id: string;
  title: string;
  instructions?: string;
  deadline: string;
  ponderation: number;
  send_time?: string | null;
  subject?: { name?: string } | string;
}

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {
  private apiUrl = '/api/assignment';

  constructor(private http: HttpClient) { }

  createAssignment(assignment: Assignment): Observable<Assignment> {
    return this.http.post<Assignment>(this.apiUrl, assignment);
  }

  getAssignmentsBySubject(subjectId: string): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.apiUrl}/subject/${subjectId}`);
  }

  /** Obtiene todas las tareas (assignments) de la BD para mostrar en la agenda. */
  getAll(): Observable<AssignmentResponse[]> {
    return this.http.get<AssignmentResponse[]>(this.apiUrl);
  }

  /** Marca o desmarca la tarea como completada en la BD (send_time). */
  updateCompletion(assignmentId: string, completed: boolean): Observable<AssignmentResponse> {
    const send_time = completed ? new Date().toISOString() : null;
    return this.http.put<AssignmentResponse>(`${this.apiUrl}/${assignmentId}`, { send_time });
  }
}
