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

  /**
   * Fetch a single assignment by its id.
   */
  getAssignment(id: string): Observable<Assignment> {
    return this.http.get<Assignment>(`${this.apiUrl}/${id}`);
  }

  /**
   * Update an existing assignment using its id.
   */
  updateAssignment(id: string, assignment: Assignment): Observable<Assignment> {
    return this.http.put<Assignment>(`${this.apiUrl}/${id}`, assignment);
  }

  getAssignmentsBySubject(subjectId: string): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.apiUrl}/subject/${subjectId}`);
  }

  /** Obtiene todas las tareas (assignments) de la BD para mostrar en la agenda. */
  getAll(): Observable<AssignmentResponse[]> {
    return this.http.get<AssignmentResponse[]>(this.apiUrl);
  }

  /** Elimina una tarea por su id. */
  deleteAssignment(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  /** Marca o desmarca la tarea como completada en la BD (send_time). */
  updateCompletion(assignmentId: string, completed: boolean): Observable<AssignmentResponse> {
    const send_time = completed ? new Date().toISOString() : null;
    return this.http.put<AssignmentResponse>(`${this.apiUrl}/${assignmentId}`, { send_time });
  }
}
