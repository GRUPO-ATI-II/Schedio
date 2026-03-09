import { Component, OnInit, inject, signal, computed } from '@angular/core';
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
    imports: [CommonModule, RouterModule, CardCheckbox],
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

    completedCount = computed(() =>
      this.habits().filter(h => this.isCompletedToday(h)).length
    );

    pendingCount = computed(() =>
      this.habits().length - this.completedCount()
    );

    completionPercent = computed(() => {
      const total = this.habits().length;
      if (total === 0) return 0;
      return Math.round((this.completedCount() / total) * 100);
    });

    /** Returns the 7 days of the current week (Monday to Sunday) */
    get weekDays(): { date: Date; label: string; isToday: boolean }[] {
        const today = new Date();
        const todayStr = today.toDateString();
        const dayOfWeek = today.getDay(); // 0 = Sunday
        // Normalize to Monday start
        const monday = new Date(today);
        monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

        const labels = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
        return labels.map((label, i) => {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            return {
                date,
                label,
                isToday: date.toDateString() === todayStr // reliable comparison
            };
        });
    }

    /** Returns a formatted string for today's date in Spanish */
    get todayLabel(): string {
        const today = new Date();
        return today.toLocaleDateString('es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
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

  onToggleHabit(habit: Habit) {

    if (this.isCompletedToday(habit)) {

      // DESMARCAR
      const updated = this.habits().map(h =>
        h._id === habit._id
          ? { ...h, lastCompleted: null, streak: Math.max(h.streak - 1, 0) }
          : h
      );

      this.habits.set(updated);

    } else {

      // MARCAR
      const updated = this.habits().map(h =>
        h._id === habit._id
          ? { ...h, lastCompleted: new Date(), streak: h.streak + 1 }
          : h
      );

      this.habits.set(updated);

    }

  }
}

