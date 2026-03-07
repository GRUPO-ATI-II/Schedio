import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonBox } from '../../shared/components/ui/button-box/button-box';
import { InputField } from '../../shared/components/ui/input-field/input-field';
import { InputTextarea } from '../../shared/components/ui/input-textarea/input-textarea';
import { EventService } from '../../core/services/event.service';
import { Event } from '../../shared/entities/event.entity';
import { DateField } from '../../shared/components/ui/date-field/date-field';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [ButtonBox, InputField, InputTextarea, FormsModule, DateField],
  templateUrl: './create-event.html',
  styleUrl: './create-event.css',
})
export class CreateEvent {
  private readonly eventService = inject(EventService);
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

    this.onSubmit();
  }

  onCancel() {
    if (confirm('¿Estás seguro de que deseas cancelar? Se perderán los cambios.')) {
      this.title = '';
      this.description = '';
      this.router.navigate(['/agenda']);
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

    const newEvent: Event = {
      title: this.title,
      description: this.description,  // Backend uses 'instructions'
      date: formattedDate,
      agendas: ["65f123456789012345678901"] // Mock ID for now, should link with current agenda
    };

    this.eventService.createEvent(newEvent).subscribe({
      next: (res) => {
        console.log('Event created!', res);
        alert('Evento creado con éxito');
        this.router.navigate(['/calendar']); // Redirect to calendar
      },
      error: (err: any) => {
        console.error('Error creating event', err);
        alert('Error: ' + err.error?.message);
      }
    });
  }
}
