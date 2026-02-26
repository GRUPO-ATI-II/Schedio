import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarMenu } from './components/sidebar-menu/sidebar-menu';
import { MainAppComponent } from './components/main-app/main-app';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SidebarMenu, MainAppComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
