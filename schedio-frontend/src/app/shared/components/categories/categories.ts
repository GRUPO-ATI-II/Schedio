import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categories',
  imports: [CommonModule],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories {
  isExpanded = false;

  toggle() {
    this.isExpanded = !this.isExpanded;
  }
}
