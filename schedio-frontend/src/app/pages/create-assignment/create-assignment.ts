import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonBox } from '../../shared/components/ui/button-box/button-box';
import { InputField } from '../../shared/components/ui/input-field/input-field';
import { InputTextarea } from '../../shared/components/ui/input-textarea/input-textarea';
import { AssignmentService } from '../../core/services/assignment.service';
import { Assignment } from '../../shared/entities/assignment.entity';
import { DateField } from '../../shared/components/ui/date-field/date-field';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-assignment',
  standalone: true,
  imports: [ButtonBox, InputField, InputTextarea, FormsModule, DateField],
  templateUrl: './create-assignment.html',
  styleUrl: './create-assignment.css',
})
export class CreateAssignment {
  private readonly assignmentService = inject(AssignmentService);
  private readonly router = inject(Router);
  title = '';
  description = '';
  date = '';
  hour = '';
  minute = '';
  ampm = 'AM';
  selectedSubject = '';

  onSave() {
    console.log('Attempting to save...');
    // Validation check
    if (!this.title) {
      alert('El título es obligatorio');
      return;
    }

    this.onSubmit(); // This calls your backend service logic
  }

  onCancel() {
    if (confirm('¿Estás seguro de que deseas cancelar? Se perderán los cambios.')) {
      this.title = '';
      this.description = '';
      // Logic to navigate back can go here (using Router)
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

    const newAssignment: Assignment = {
      title: this.title,
      instructions: this.description,  // Backend uses 'instructions'
      deadline: formattedDate,
      ponderation: 10, // Mock value: you should add an input for this!
      subject: "65f123456789012345678901" // Mock ID: should come from the <select>
    };

    this.assignmentService.createAssignment(newAssignment).subscribe({
      next: (res) => {
        console.log('Assignment created!', res);
        alert('Tarea creada con éxito');
      const newId = res.id || res.id; 
        if (newId) {
          this.router.navigate(['/edit-assignment', newId]);
        } else {
          // Fallback if no ID is returned
          this.router.navigate(['/agenda']);
        }
      },
      error: (err) => {
        console.error('Error creating assignment', err);
        alert('Error: ' + err.error.message);
      }
    });
  }
}