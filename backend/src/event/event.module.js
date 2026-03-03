const eventsRoutes = require("./routers/event.routes");

module.exports = (app) => {
  app.use("/api/events", eventsRoutes);

  console.log("[Module]: Events cargado (Rutas: /api/events)");
};
