import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-favorites',
  imports: [CommonModule],
  templateUrl: './user-favorites.html',
  styleUrl: './user-favorites.css',
})
export class UserFavorites {
  isExpanded = false;

  toggle() {
    this.isExpanded = !this.isExpanded;
  }
}
