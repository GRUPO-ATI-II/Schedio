import { Component, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
export class CreateEvent implements OnInit {
  private readonly eventService = inject(EventService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  title = '';
  description = '';
  date = '';
  hour = '';
  minute = '';
  ampm = 'AM';
  isAllDay = false;
  endHour = '';
  endMinute = '';
  endAmPm = 'AM';
  selectedSubject = '';

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['date']) {
        this.date = params['date'];
      }
      if (params['allDay'] === 'true') {
        this.isAllDay = true;
      } else if (params['hour'] && params['minute'] && params['ampm']) {
        this.hour = params['hour'];
        this.minute = params['minute'];
        this.ampm = params['ampm'];

        // Automatically set End Time 1 hour later for convenience
        let numEndHour = Number.parseInt(this.hour) + 1;
        let endAmPmVar = this.ampm;

        if (numEndHour === 12) {
          endAmPmVar = this.ampm === 'AM' ? 'PM' : 'AM';
        } else if (numEndHour > 12) {
          numEndHour = 1; // 12 -> 1
        }

        this.endHour = numEndHour.toString();
        this.endMinute = this.minute;
        this.endAmPm = endAmPmVar;
      }
    });
  }

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
    if (!this.date) {
      alert('Por favor, selecciona una fecha.');
      return;
    }

    if (!this.isAllDay && (!this.hour || !this.minute || !this.endHour || !this.endMinute)) {
      alert('Por favor, completa la hora de inicio y fin, o selecciona "Todo el día".');
      return;
    }

    let finalDate: Date;
    let finalEndDate: Date | undefined;

    if (this.isAllDay) {
      // Just use the start of the selected day
      finalDate = new Date(`${this.date}T00:00:00`);
    } else {
      // Parse start time
      let startH = Number.parseInt(this.hour);
      if (this.ampm === 'PM' && startH < 12) startH += 12;
      if (this.ampm === 'AM' && startH === 12) startH = 0;

      const startTimeStr = `${startH.toString().padStart(2, '0')}:${this.minute.padStart(2, '0')}:00`;
      finalDate = new Date(`${this.date}T${startTimeStr}`);

      // Parse end time
      let endH = Number.parseInt(this.endHour);
      if (this.endAmPm === 'PM' && endH < 12) endH += 12;
      if (this.endAmPm === 'AM' && endH === 12) endH = 0;

      const endTimeStr = `${endH.toString().padStart(2, '0')}:${this.endMinute.padStart(2, '0')}:00`;
      finalEndDate = new Date(`${this.date}T${endTimeStr}`);

      if (finalEndDate <= finalDate) {
        alert('La hora de finalización debe ser después de la hora de inicio.');
        return;
      }
    }

    const newEvent: Event = {
      title: this.title,
      description: this.description,  // Backend uses 'description'/ 'instructions'
      date: finalDate,
      endDate: finalEndDate,
      isAllDay: this.isAllDay,
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
