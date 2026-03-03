const gradeRoutes = require("./routers/grade.routes");

module.exports = (app) => {
  app.use("/api/grade", gradeRoutes);

  console.log("[Module]: Grade cargado (Rutas: /api/grade)");
};
