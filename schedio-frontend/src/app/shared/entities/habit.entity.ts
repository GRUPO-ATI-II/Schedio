export interface Habit {
    _id?: string;
    name: string;
    description?: string;
    frequency: 'daily' | 'weekly';
    user: string;
    completions: Date[];
    streak: number;
    lastCompleted: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}
