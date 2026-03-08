import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HabitService } from '../../core/services/habit.service';
import { Habit } from '../../shared/entities/habit.entity';
import { RectBaseButton } from '../../shared/components/ui/rect-base-button/rect-base-button';
import { CardCheckbox } from '../../shared/components/ui/card-checkbox/card-checkbox';
import { MainLayoutComponent } from '../../layout/main-layout/main-layout';

@Component({
    selector: 'app-streaks',
    standalone: true,
    imports: [CommonModule, RouterModule, RectBaseButton, CardCheckbox],
    templateUrl: './streaks.html',
    styleUrl: './streaks.css',
})
export class Streaks implements OnInit {
    private readonly habitService = inject(HabitService);
    private readonly router = inject(Router);
    private readonly mainLayout = inject(MainLayoutComponent);

    habits = signal<Habit[]>([]);
    currentTab = signal<'month' | 'week' | 'day'>('month');

    // Mock user ID
    userId = '65f123456789012345678901';

    ngOnInit() {
        this.loadHabits();
    }

    loadHabits() {
        this.habitService.getHabitsByUser(this.userId).subscribe({
            next: (data) => {
                this.habits.set(data);
            },
            error: (err) => console.error('Error loading habits', err)
        });
    }

    get completedCount() {
        return this.habits().filter(h => this.isCompletedToday(h)).length;
    }

    get pendingCount() {
        return this.habits().length - this.completedCount;
    }

    onComplete(habitId: string) {
        this.habitService.completeHabit(habitId).subscribe({
            next: () => this.loadHabits(),
            error: (err) => alert('Error: ' + err.message)
        });
    }

    onCreateNew() {
        this.router.navigate(['/streaks/new']);
    }

    isCompletedToday(habit: Habit): boolean {
        if (!habit.lastCompleted) return false;
        const last = new Date(habit.lastCompleted);
        const today = new Date();
        return last.getDate() === today.getDate() &&
            last.getMonth() === today.getMonth() &&
            last.getFullYear() === today.getFullYear();
    }

    setTab(tab: 'month' | 'week' | 'day') {
        this.currentTab.set(tab);
    }

    prevMonth() {
        console.log('Previous month');
    }

    nextMonth() {
        console.log('Next month');
    }
}
