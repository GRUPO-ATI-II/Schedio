import { Component } from '@angular/core';
import { MenuOption } from '../menu-option/menu-option';

@Component({
  selector: 'app-sidebar-menu',
  standalone: true,
  imports: [MenuOption],
  templateUrl: './sidebar-menu.html',
  styleUrl: './sidebar-menu.css',
})
export class SidebarMenu {}
