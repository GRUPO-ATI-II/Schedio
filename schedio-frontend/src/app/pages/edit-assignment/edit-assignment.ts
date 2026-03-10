import { Component, inject, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputField } from '../../shared/components/ui/input-field/input-field';
import { InputTextarea } from '../../shared/components/ui/input-textarea/input-textarea';
import { ButtonBox } from '../../shared/components/ui/button-box/button-box';
import { DateField } from '../../shared/components/ui/date-field/date-field';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentService } from '../../core/services/assignment.service';
import { Assignment } from '../../shared/entities/assignment.entity';

@Component({
  selector: 'app-edit-assignment',
  standalone: true,
  imports: [InputField, InputTextarea, ButtonBox, FormsModule, DateField],
  templateUrl: './edit-assignment.html',
  styleUrl: './edit-assignment.css',
})
export class EditAssignment implements OnInit {
  private readonly assignmentService = inject(AssignmentService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  assignmentId = '';
  title = '';
  description = '';
  date = '';
  hour = '';
  minute = '';
  ampm = 'AM';
  selectedSubject = '';

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    $event.returnValue = true;
  }

  constructor() {
    // Attempt to get the state immediately during component creation
    const navigation = this.router.currentNavigation();
    const id = navigation?.extras.state?.['id'];
    if (id) {
      this.assignmentId = id; //
    }
  }

  ngOnInit() {
    // If we have an ID from the constructor state, load it.
    // If not, redirect back to the agenda.
    if (this.assignmentId) {
      this.loadAssignment(this.assignmentId); //
    } else {
      this.router.navigate(['/agenda']); //
    }
  }

  loadAssignment(id: string) {
    this.assignmentService.getAssignment(id).subscribe({
      next: (a) => this.populate(a),
      error: (err) => {
        console.error('Failed to load assignment', err);
        alert('No se pudo cargar la tarea.');
      },
    });
  }

  populate(a: Assignment) {
    this.title = a.title;
    this.description = a.instructions || '';
    if (a.deadline) {
      const d = new Date(a.deadline);
      this.date = d.toISOString().split('T')[0];
      let h = d.getHours();
      this.ampm = h >= 12 ? 'PM' : 'AM';
      if (h === 0) h = 12;
      else if (h > 12) h -= 12;
      this.hour = h.toString();
      this.minute = d.getMinutes().toString();
    }
    this.selectedSubject = a.subject || '';

    this.cdr.detectChanges();
  }

  onSave() {
    if (!this.title) {
      alert('El título es obligatorio');
      return;
    }
    this.onSubmit();
  }

  onCancel() {
    if (confirm('¿Estás seguro de que deseas cancelar? Se perderán los cambios.')) {
      // navigate back or reset
      this.router.navigate(['/agenda']);
    }
  }

  onDelete() {
    if (confirm('¿Estás seguro de que deseas eliminar esta tarea? Esta acción no se puede deshacer.')) {
      this.assignmentService.deleteAssignment(this.assignmentId).subscribe({
        next: () => {
          alert('Tarea eliminada con éxito');
          this.router.navigate(['/agenda']);
        },
        error: (err) => {
          console.error('Error deleting assignment', err);
          alert('Error al eliminar la tarea: ' + err.error?.message);
        },
      });
    }
  }

  onSubmit() {
    if (!this.date || !this.hour || !this.minute) {
      alert('Por favor, completa la fecha y la hora.');
      return;
    }

    let finalHour = Number.parseInt(this.hour);
    if (this.ampm === 'PM' && finalHour < 12) finalHour += 12;
    if (this.ampm === 'AM' && finalHour === 12) finalHour = 0;

    const timeString = `${finalHour.toString().padStart(2, '0')}:${this.minute.padStart(2, '0')}:00`;
    const formattedDate = new Date(`${this.date}T${timeString}`);

    const updated: Assignment = {
      title: this.title,
      instructions: this.description,
      deadline: formattedDate,
      ponderation: 10,
      subject: this.selectedSubject || '65f123456789012345678901',
    };

    this.assignmentService.updateAssignment(this.assignmentId, updated).subscribe({
      next: (res) => {
        console.log('Assignment updated', res);
        alert('Tarea actualizada con éxito');
        this.router.navigate(['/agenda']);
      },
      error: (err) => {
        console.error('Error updating assignment', err);
        alert('Error: ' + err.error?.message);
      },
    });
  }
}
