const assignmentRoutes = require("./routers/assignment.routes");

module.exports = (app) => {
  app.use("/api/assignment", assignmentRoutes);

  console.log("[Module]: Assignment cargado (Rutas: /api/assignment)");
};
