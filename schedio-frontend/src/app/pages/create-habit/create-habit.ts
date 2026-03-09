import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputField } from '../../shared/components/ui/input-field/input-field';
import { InputTextarea } from '../../shared/components/ui/input-textarea/input-textarea';
import { HabitService } from '../../core/services/habit.service';
import { Habit } from '../../shared/entities/habit.entity';
import { ButtonBox } from '../../shared/components/ui/button-box/button-box';
import { MainLayoutComponent } from '../../layout/main-layout/main-layout';

@Component({
    selector: 'app-create-habit',
    standalone: true,
    imports: [ButtonBox, InputField, InputTextarea, FormsModule],
    templateUrl: './create-habit.html',
    styleUrl: './create-habit.css',
})
export class CreateHabit {
    private readonly habitService = inject(HabitService);
    private readonly router = inject(Router);
    private readonly mainLayout = inject(MainLayoutComponent);

    name = '';
    description = '';
    frequency: 'daily' | 'weekly' | '' = '';

    // Mock user ID
    userId = '65f123456789012345678901';

    ngOnInit() {
    }

    onSave() {
        if (!this.name) {
            alert('El nombre es obligatorio');
            return;
        }
        if (!this.frequency) {
            alert('La frecuencia es obligatoria');
            return;
        }

        const newHabit: Partial<Habit> = {
            name: this.name,
            description: this.description,
            frequency: (this.frequency as 'daily' | 'weekly') || undefined,
            user: this.userId
        };

        this.habitService.createHabit(newHabit).subscribe({
            next: () => {
                alert('Hábito creado con éxito');
                this.router.navigate(['/streaks']);
            },
            error: (err) => alert('Error: ' + err.error.message)
        });
    }

    onCancel() {
        this.router.navigate(['/streaks']);
    }
}
