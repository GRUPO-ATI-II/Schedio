import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-date-field',
    imports: [],
    templateUrl: './date-field.html',
    styleUrl: './date-field.css',
})
export class DateField {
    @Input() label: string = '';
}
