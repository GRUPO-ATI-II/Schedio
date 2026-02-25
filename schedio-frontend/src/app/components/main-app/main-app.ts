import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CalendarTab } from '../calendar-tab/calendar-tab';
import { PersonalCalendar } from '../personal-calendar/personal-calendar';
import { UserFavorites } from '../user-favorites/user-favorites';
import { Categories } from '../categories/categories';

@Component({
  selector: 'app-main-app-component',
  standalone: true,
  imports: [RouterOutlet, CommonModule, CalendarTab, PersonalCalendar, UserFavorites, Categories],
  templateUrl: './main-app.html',
  styleUrl: './main-app.css',
})
export class MainAppComponent {
  protected readonly title = signal('Schedio');
  protected readonly viewTitle = signal('Módulo de contacto');

  cambiarTitulo(nuevoTitulo: string) {
    this.viewTitle.set(nuevoTitulo);
  }
}
