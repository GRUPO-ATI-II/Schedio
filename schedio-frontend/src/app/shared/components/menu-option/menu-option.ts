import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-menu-option',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu-option.html',
  styleUrl: './menu-option.css',
})
export class MenuOption {
  @Input({ required: true }) link: string = '';

  @Input({ required: true }) iconSrc: string = '';

  @Input() label: string = '';
}
