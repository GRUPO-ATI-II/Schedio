import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarMenu } from '../../components/sidebar-menu/sidebar-menu';
import { CalendarTab } from '../../components/calendar-tab/calendar-tab';
import { PersonalCalendar } from '../../components/personal-calendar/personal-calendar';
import { UserFavorites } from '../../components/user-favorites/user-favorites';
import { Categories } from '../../components/categories/categories';
import { InputField } from '../../components/ui/input-field/input-field'; //importen asi los componentes basicos
import { RectBaseButton } from '../../components/ui/rect-base-button/rect-base-button';

@Component({
  standalone: true,
  selector: 'app-main-layout',
  imports: [RouterOutlet, SidebarMenu ,CommonModule, CalendarTab, PersonalCalendar,
    UserFavorites, Categories], // agregar InputField y/o RectBaseButton para poder usarlosmports: [RouterOutlet, SidebarMenu, MainAppComponent],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',

})
export class MainLayoutComponent {
  protected readonly title = signal('Schedio');
  protected readonly viewTitle = signal('Módulo de contacto');

  cambiarTitulo(nuevoTitulo: string) {
    this.viewTitle.set(nuevoTitulo);
  }
}