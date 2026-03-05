const subjectRoutes = require("./routers/subject.routes");
require("./entities/subject.entity");
require("./entities/studies.entity");

module.exports = (app) => {
  app.use("/api/subjects", subjectRoutes);

  console.log("📚 [Module]: Subjects & Studies cargado (Rutas: /api/subjects)");
};
