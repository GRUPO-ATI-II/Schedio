import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-pfp',
  imports: [],
  templateUrl: './pfp.html',
  styleUrl: './pfp.css',
})
export class Pfp {
  @Input() src:string = '';
}
