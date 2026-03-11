const habitService = require("../services/habit.service");

const create = async (req, res) => {
    try {
        const habit = await habitService.createHabit(req.body);
        res.status(201).json(habit);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getByUser = async (req, res) => {
    try {
        const habits = await habitService.getHabitsByUser(req.params.userId);
        res.status(200).json(habits);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getById = async (req, res) => {
    try {
        const habit = await habitService.getHabitById(req.params.id);
        if (!habit) return res.status(404).json({ message: "Hábito no encontrado" });
        res.status(200).json(habit);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const update = async (req, res) => {
    try {
        const habit = await habitService.updateHabit(req.params.id, req.body);
        if (!habit) return res.status(404).json({ error: "No encontrado" });
        res.status(200).json(habit);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const remove = async (req, res) => {
    try {
        const habit = await habitService.deleteHabit(req.params.id);
        if (!habit) return res.status(404).json({ error: "No encontrado" });
        res.status(200).json({ message: "Hábito eliminado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const complete = async (req, res) => {
    try {
        const habit = await habitService.completeHabit(req.params.id);
        res.status(200).json(habit);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    create,
    getByUser,
    getById,
    update,
    remove,
    complete,
};
