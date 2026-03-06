const remindersRoutes = require("./routers/reminders.routes");

module.exports = (app) => {
  app.use("/api/remminders", remindersRoutes);

  console.log("[Module]: Reminders cargado (Rutas: /api/reminders)");
};
