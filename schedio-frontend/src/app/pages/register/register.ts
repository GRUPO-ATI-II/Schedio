import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { InputField } from '../../components/ui/input-field/input-field';
import { RectBaseButton } from '../../components/ui/rect-base-button/rect-base-button';
import { RouterModule } from '@angular/router';
import { DateField } from '../../components/ui/date-field/date-field';

@Component({
    selector: 'app-register',
    imports: [InputField, RectBaseButton, RouterModule, DateField],
    templateUrl: './register.html',
    styleUrl: './register.css',
})
export class Register {
    constructor(private router: Router) { }

    register() {
        this.router.navigate(['/login']);
    }
}
