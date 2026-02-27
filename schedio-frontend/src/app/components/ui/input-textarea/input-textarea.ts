import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-input-textarea',
  standalone: true,
  imports: [],
  templateUrl: './input-textarea.html',
  styleUrl: './input-textarea.css',
})
export class InputTextarea {
    @Input() placeholder: string = '';
}
