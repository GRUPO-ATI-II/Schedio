const Habit = require("../entities/habit.entity");

const createHabit = async (habitData) => {
    const habit = new Habit(habitData);
    return await habit.save();
};

const getHabitsByUser = async (userId) => {
    return await Habit.find({ user: userId });
};

const getHabitById = async (id) => {
    return await Habit.findById(id);
};

const updateHabit = async (id, updateData) => {
    return await Habit.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteHabit = async (id) => {
    return await Habit.findByIdAndDelete(id);
};

const completeHabit = async (id) => {
    const habit = await Habit.findById(id);
    if (!habit) throw new Error("Hábito no encontrado");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already completed today
    const alreadyCompleted = habit.completions.some(date => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d.getTime() === today.getTime();
    });

    if (alreadyCompleted) {
        // Toggle: remove it if already completed today? Or just ignore?
        // Let's implement toggle for more flexibility
        habit.completions = habit.completions.filter(date => {
            const d = new Date(date);
            d.setHours(0, 0, 0, 0);
            return d.getTime() !== today.getTime();
        });
    } else {
        habit.completions.push(today);
    }

    // Recalculate streak
    habit.streak = calculateStreak(habit.completions, habit.frequency);
    habit.lastCompleted = habit.completions.length > 0 ? habit.completions[habit.completions.length - 1] : null;

    return await habit.save();
};

const calculateStreak = (completions, frequency) => {
    if (!completions || completions.length === 0) return 0;

    // Sort completions descending
    const sortedDates = [...completions]
        .map(d => new Date(d).setHours(0, 0, 0, 0))
        .sort((a, b) => b - a);

    let streak = 0;
    const today = new Date().setHours(0, 0, 0, 0);
    const yesterday = new Date(today - 86400000).setHours(0, 0, 0, 0);

    // If last completion wasn't today or yesterday, streak is broken
    if (sortedDates[0] < yesterday && frequency === 'daily') return 0;
    // (Simple version for now, could be more complex for weekly)

    let currentDate = sortedDates[0];
    streak = 1;

    for (let i = 1; i < sortedDates.length; i++) {
        const prevDate = sortedDates[i];
        const diffDays = (currentDate - prevDate) / 86400000;

        if (diffDays === 1) {
            streak++;
            currentDate = prevDate;
        } else {
            break;
        }
    }

    return streak;
};

module.exports = {
    createHabit,
    getHabitsByUser,
    getHabitById,
    updateHabit,
    deleteHabit,
    completeHabit,
};
