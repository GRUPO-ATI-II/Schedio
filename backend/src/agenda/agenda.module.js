const agendaRoutes = require("./routers/agenda.routes");

module.exports = (app) => {
  app.use("/api/agenda", agendaRoutes);

  console.log("[Module]: Agenda cargado (Rutas: /api/agenda)");
};
