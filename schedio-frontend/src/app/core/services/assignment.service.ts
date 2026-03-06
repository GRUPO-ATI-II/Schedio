import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Assignment } from '../../shared/entities/assignment.entity';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {
  private apiUrl = 'http://localhost:3000/api/assignment';

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
}
