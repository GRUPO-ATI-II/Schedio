const habitRouter = require("./routers/habit.router");

module.exports = (app) => {
    app.use("/api/habits", habitRouter);
};
